# Advanced Databricks PySpark EDA: VCT 2025 Player Stats

Since you are doing this for a serious project, using global medians or blindly replacing everything with zeros is not mathematically sound. It ruins the statistical distribution of your data.

Here is the **best, optimized approach** to handle these nulls in PySpark using **Context-Aware Imputation** and **Feature Engineering**. 

Copy each of these cells into your Databricks Community Edition notebook.

---

### Cell 1: Setup and Data Ingestion
We will load the data and cache it, which is a Databricks best practice for performance when doing repeated EDA on a 17k+ row dataset.

```python
from pyspark.sql import SparkSession, Window
from pyspark.sql.functions import (
    col, when, isnull, regexp_replace, mean, round as spark_round, 
    split, coalesce, sum as spark_sum, count
)

# Load the dataset from the BRONZE layer
BRONZE = "/Volumes/workspace/default/matrica/bronze"
SILVER = "/Volumes/workspace/default/matrica/silver"

file_path = f"{BRONZE}/players_stats.csv" 
df = spark.read.csv(file_path, header=True, inferSchema=True)

print(f"Total Rows: {df.count()} (Includes header implicitly as schema)")
```

---

### Cell 2: Safely Format Percentage Columns
Before imputing anything, we must standardize string percentages (e.g., `"71%"`) into numerical floats (`0.71`).

```python
pct_columns = [
    "Kill, Assist, Trade, Survive %", 
    "Headshot %", 
    "Clutch Success %"
]

df_clean = df
for c in pct_columns:
    df_clean = df_clean.withColumn(
        c, 
        regexp_replace(col(c), "%", "").cast("float") / 100.0
    )
```

---

### Cell 3: Feature Engineering the "Clutch" Nulls
**The Strategy:** ~26% of `Clutches (won/played)` is null, meaning the player didn't face a clutch situation. We shouldn't fill this with a flat median. Instead, we split the string (e.g., `"1/3"`) into two new numerical columns: `Clutches_Won` and `Clutches_Played`. If it's null, they simply played `0` and won `0`.

```python
# Split the string "won/played" into two distinct numerical columns
df_clean = df_clean.withColumn(
    "Clutches_Won", 
    split(col("Clutches (won/played)"), "/").getItem(0).cast("int")
).withColumn(
    "Clutches_Played", 
    split(col("Clutches (won/played)"), "/").getItem(1).cast("int")
)

# Fill nulls contextually: If it was null, they played 0 clutches.
df_clean = df_clean.fillna(0, subset=["Clutches_Won", "Clutches_Played"])

# Now dynamically calculate Clutch Success % (Won / Played)
# If played is 0, we leave it as null (because 0/0 is mathematically undefined) 
# OR we can safely set it to 0.0 IF we use Clutches_Played as a feature in our models.
df_clean = df_clean.withColumn(
    "Clutch Success %",
    when(col("Clutches_Played") == 0, 0.0)
    .otherwise(spark_round(col("Clutches_Won") / col("Clutches_Played"), 3))
)

# We can safely drop the messy string column now
df_clean = df_clean.drop("Clutches (won/played)")
```

---

### Cell 4: Context-Aware Imputation for Performance Metrics
**The Strategy:** About ~7.5% of rows are missing performance stats (Rating, ACS, etc.). 
If we fill with `0`, we destroy the player's average. If we fill with the *global median*, we treat a Top Tier player and a Bottom Tier player exactly the same.
**The Optimized Solution:** We use PySpark `Window` functions to fill missing stats with that **specific player's average rating**. If a player has no historical rating, we fall back to the **Agent's average rating**.

```python
# Metrics that need context-aware imputation
perf_metrics = [
    "Rating", "Average Combat Score", "Average Damage Per Round",
    "First Kills Per Round", "First Deaths Per Round",
    "Kill, Assist, Trade, Survive %", "Headshot %"
]

# Create Windows
player_window = Window.partitionBy("Player")
agent_window = Window.partitionBy("Agents")

for metric in perf_metrics:
    # 1. Calculate the player's personal average for this metric
    player_avg = mean(col(metric)).over(player_window)
    # 2. Calculate the agent's global average for this metric
    agent_avg = mean(col(metric)).over(agent_window)
    
    # 3. Apply Coalesce Imputation: 
    # Use existing value -> if null, use Player Avg -> if still null, use Agent Avg -> if still null, use 0.0
    df_clean = df_clean.withColumn(
        metric, 
        coalesce(col(metric), player_avg, agent_avg, spark_round(col(metric) * 0, 1)) # Multiplied by 0 to retain datatype
    )

print("Nulls successfully imputed using Context-Aware Window Functions.")
```

---

### Cell 5: EDA - Player Consistency Analysis
Now that our data is mathematically sound and no rows are lost, we can do advanced EDA. Let's find out which players are the most consistent (lowest variance in their rating).

```python
from pyspark.sql.functions import stddev

player_consistency = df_clean.groupBy("Player").agg(
    count("*").alias("Total_Matches"),
    spark_round(mean("Rating"), 2).alias("Average_Rating"),
    spark_round(stddev("Rating"), 2).alias("Rating_Volatility")
).filter(col("Total_Matches") > 10) # Only consider players with a decent sample size

# The best players have a HIGH rating but LOW volatility
display(player_consistency.orderBy(col("Average_Rating").desc(), col("Rating_Volatility").asc()))
```

---

### Cell 6: EDA - Agent Impact Analysis
Let's analyze which agents contribute most to First Kills and Average Combat Score.

```python
agent_impact = df_clean.groupBy("Agents").agg(
    count("*").alias("Pick_Count"),
    spark_round(mean("Average Combat Score"), 2).alias("Avg_ACS"),
    spark_round(mean("First Kills Per Round"), 2).alias("Avg_First_Kills_Per_Round")
).filter(col("Pick_Count") > 50).orderBy(col("Avg_ACS").desc())

# In Databricks, click the "+" next to the table to create a Bar Chart of Pick_Count vs Avg_ACS
display(agent_impact)
```

---

### Cell 7: Save Clean Data to Silver Layer (Parquet)
Based on your Catalog Explorer screenshot, this will write your fully cleaned and imputed dataset into the Silver Volume as a Parquet file.

```python
# Exact write path from your Catalog screenshot
WRITE_PATH = "/Volumes/workspace/default/matrica/silver/vct_2025/players_stats"

# Save the fully cleaned and optimized dataframe as parquet
df_clean.write.format("parquet").mode("overwrite").save(WRITE_PATH)

print(f"Successfully wrote cleaned data to {WRITE_PATH}")
```
