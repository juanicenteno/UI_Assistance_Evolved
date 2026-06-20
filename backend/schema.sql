-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS ux_brief;
USE ux_brief;

-- Crear la tabla briefs para almacenar los briefs generados
CREATE TABLE IF NOT EXISTS briefs (
  id VARCHAR(36) PRIMARY KEY,
  data JSON NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending'
);
