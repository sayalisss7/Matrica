-- ==============================================================================
-- File: 03_create_gold_fact_tables.sql
-- Layer: Gold
-- Description: Creates Star Schema Fact tables linking to dimensions.
-- ==============================================================================

USE matrica_gold;

-- 1. fact_player_stats
DROP TABLE IF EXISTS fact_player_stats;
CREATE TABLE fact_player_stats AS
SELECT 
    MD5(CONCAT(ps.Player, ps.Agents, COALESCE(ps.Map, ''))) AS Match_ID, -- Proxy for Match ID if not explicitly present
    p.Player_ID,
    t.Tournament_ID,
    a.Agent_ID,
    m.Map_ID,
    ps.Rating,
    ps.`Average Combat Score`,
    ps.`Average Damage Per Round` AS ADR,
    NULL AS Kills, -- Adjust based on exact silver columns
    NULL AS Deaths,
    NULL AS Assists,
    ps.`Headshot %`,
    ps.`Kill, Assist, Trade, Survive %` AS KAST,
    ps.`First Kills Per Round` AS First_Kills,
    ps.`First Deaths Per Round` AS First_Deaths,
    ps.Clutches_Won,
    ps.Clutches_Played
FROM matrica_silver.silver_players_stats ps
LEFT JOIN dim_players p ON ps.Player = p.Player_Name
LEFT JOIN dim_agents a ON ps.Agents = a.Agent_Name
LEFT JOIN dim_maps m ON ps.Map = m.Map_Name
LEFT JOIN dim_tournaments t ON ps.Event = t.Tournament_Name; -- Assuming Event exists

-- 2. fact_matches
DROP TABLE IF EXISTS fact_matches;
CREATE TABLE fact_matches AS
SELECT 
    MD5(CONCAT(sm.Team1, sm.Team2, sm.Map)) AS Match_ID,
    t1.Team_ID AS TeamA_ID,
    t2.Team_ID AS TeamB_ID,
    NULL AS Winner,
    m.Map_ID,
    tr.Tournament_ID,
    NULL AS Rounds,
    NULL AS Duration
FROM matrica_silver.silver_matches sm
LEFT JOIN dim_teams t1 ON sm.Team1 = t1.Team_Name
LEFT JOIN dim_teams t2 ON sm.Team2 = t2.Team_Name
LEFT JOIN dim_maps m ON sm.Map = m.Map_Name
LEFT JOIN dim_tournaments tr ON sm.Event = tr.Tournament_Name;
