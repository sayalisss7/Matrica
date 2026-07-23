-- ==============================================================================
-- File: 02_create_gold_dimensions.sql
-- Layer: Gold
-- Description: Creates Star Schema Dimension tables from Silver layer.
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS matrica_gold;
USE matrica_gold;

-- 1. dim_players
DROP TABLE IF EXISTS dim_players;
CREATE TABLE dim_players AS
SELECT 
    MD5(Player) AS Player_ID, -- Surrogate Key
    Player AS Player_Name,
    Team,
    NULL AS Country, -- Placeholder, assuming not directly in stats
    NULL AS Role -- Placeholder
FROM (
    SELECT DISTINCT Player, Team
    FROM matrica_silver.silver_players_stats
    WHERE Player IS NOT NULL
);

-- 2. dim_agents
DROP TABLE IF EXISTS dim_agents;
CREATE TABLE dim_agents AS
SELECT 
    MD5(Agent) AS Agent_ID,
    Agent AS Agent_Name,
    NULL AS Class -- Adjust if 'Class' is available in silver_agents
FROM (
    SELECT DISTINCT Agent
    FROM matrica_silver.silver_agents
    WHERE Agent IS NOT NULL
);

-- 3. dim_teams
DROP TABLE IF EXISTS dim_teams;
CREATE TABLE dim_teams AS
SELECT 
    MD5(Team_Name) AS Team_ID,
    Team_Name,
    NULL AS Region
FROM (
    SELECT DISTINCT Team AS Team_Name FROM matrica_silver.silver_players_stats WHERE Team IS NOT NULL
    UNION
    SELECT DISTINCT Team FROM matrica_silver.silver_agents WHERE Team IS NOT NULL
);

-- 4. dim_maps
DROP TABLE IF EXISTS dim_maps;
CREATE TABLE dim_maps AS
SELECT 
    MD5(Map) AS Map_ID,
    Map AS Map_Name
FROM (
    SELECT DISTINCT Map FROM matrica_silver.silver_matches WHERE Map IS NOT NULL
    UNION
    SELECT DISTINCT Map FROM matrica_silver.silver_agents WHERE Map IS NOT NULL
);

-- 5. dim_tournaments
DROP TABLE IF EXISTS dim_tournaments;
CREATE TABLE dim_tournaments AS
SELECT 
    MD5(Tournament_Name) AS Tournament_ID,
    Tournament_Name,
    Stage,
    NULL AS Year,
    NULL AS Region
FROM (
    SELECT DISTINCT 
        Event AS Tournament_Name, -- Adjust if column is named differently in matches
        Stage
    FROM matrica_silver.silver_matches
    WHERE Event IS NOT NULL
);
