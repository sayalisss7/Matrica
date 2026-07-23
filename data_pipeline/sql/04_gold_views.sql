-- ==============================================================================
-- File: 04_gold_views.sql
-- Layer: Gold
-- Description: Creates analytical views on top of the Gold schema.
-- ==============================================================================

USE matrica_gold;

-- View 1: Top Players by Rating
CREATE OR REPLACE VIEW vw_top_players AS
SELECT 
    p.Player_Name,
    p.Team,
    AVG(f.Rating) AS Avg_Rating,
    SUM(f.Kills) AS Total_Kills,
    SUM(f.Clutches_Won) AS Total_Clutches_Won
FROM fact_player_stats f
JOIN dim_players p ON f.Player_ID = p.Player_ID
GROUP BY p.Player_Name, p.Team
ORDER BY Avg_Rating DESC;

-- View 2: Agent Pick Effectiveness
CREATE OR REPLACE VIEW vw_agent_effectiveness AS
SELECT 
    a.Agent_Name,
    COUNT(f.Match_ID) AS Pick_Count,
    AVG(f.`Average Combat Score`) AS Avg_Combat_Score,
    AVG(f.KAST) AS Avg_KAST
FROM fact_player_stats f
JOIN dim_agents a ON f.Agent_ID = a.Agent_ID
GROUP BY a.Agent_Name
ORDER BY Pick_Count DESC;
