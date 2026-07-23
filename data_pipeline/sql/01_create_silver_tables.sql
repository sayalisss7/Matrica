-- ==============================================================================
-- File: 01_create_silver_tables.sql
-- Layer: Silver
-- Description: Registers Parquet files created by Databricks notebooks as tables.
-- ==============================================================================

-- Variables for paths (Can be passed using SET in Databricks or configured as variables)
-- SET var.catalog = workspace;
-- SET var.schema = default;
-- SET var.silver_path = /Volumes/workspace/default/matrica/silver/vct_2025;

CREATE DATABASE IF NOT EXISTS matrica_silver;
USE matrica_silver;

-- 1. Silver Agents Table
DROP TABLE IF EXISTS silver_agents;
CREATE TABLE silver_agents
USING PARQUET
LOCATION '/Volumes/workspace/default/matrica/silver/vct_2025/agents/agents_pick_rates';

-- 2. Silver Matches Table
DROP TABLE IF EXISTS silver_matches;
CREATE TABLE silver_matches
USING PARQUET
LOCATION '/Volumes/workspace/default/matrica/silver/vct_2025/matches/draft_phase';

-- 3. Silver Player Stats Table
DROP TABLE IF EXISTS silver_players_stats;
CREATE TABLE silver_players_stats
USING PARQUET
LOCATION '/Volumes/workspace/default/matrica/silver/vct_2025/players_stats';
