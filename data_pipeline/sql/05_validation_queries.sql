-- ==============================================================================
-- File: 05_validation_queries.sql
-- Layer: Gold
-- Description: Validation queries for data quality checks.
-- ==============================================================================

USE matrica_gold;

-- 1. Row Counts for all tables
SELECT 'dim_players' AS Table_Name, COUNT(*) AS Row_Count FROM dim_players
UNION ALL
SELECT 'dim_agents', COUNT(*) FROM dim_agents
UNION ALL
SELECT 'dim_teams', COUNT(*) FROM dim_teams
UNION ALL
SELECT 'dim_maps', COUNT(*) FROM dim_maps
UNION ALL
SELECT 'dim_tournaments', COUNT(*) FROM dim_tournaments
UNION ALL
SELECT 'fact_player_stats', COUNT(*) FROM fact_player_stats
UNION ALL
SELECT 'fact_matches', COUNT(*) FROM fact_matches;

-- 2. Null Counts in Fact Table
SELECT 
    SUM(CASE WHEN Player_ID IS NULL THEN 1 ELSE 0 END) AS Null_Player_IDs,
    SUM(CASE WHEN Agent_ID IS NULL THEN 1 ELSE 0 END) AS Null_Agent_IDs,
    SUM(CASE WHEN Match_ID IS NULL THEN 1 ELSE 0 END) AS Null_Match_IDs
FROM fact_player_stats;

-- 3. Duplicate Primary Key Checks (Should return 0)
SELECT Player_ID, COUNT(*) 
FROM dim_players 
GROUP BY Player_ID 
HAVING COUNT(*) > 1;

-- 4. Foreign Key Check (Orphan Records in Fact Table)
SELECT COUNT(*) AS Orphan_Records
FROM fact_player_stats f
LEFT JOIN dim_players p ON f.Player_ID = p.Player_ID
WHERE p.Player_ID IS NULL;
