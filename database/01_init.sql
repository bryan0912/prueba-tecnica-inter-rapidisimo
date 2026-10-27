-- ==========================================
-- SCRIPT DE CREACIÓN: Inter Rapidísimo Test
-- Autor: Bryan - Senior .NET Developer
-- ==========================================

CREATE DATABASE IF NOT EXISTS inter_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE inter_db;

-- 1. Tabla de Profesores
CREATE TABLE profesores (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. Tabla de Materias
CREATE TABLE materias (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    creditos INT NOT NULL DEFAULT 3,
    profesor_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_materia_profesor FOREIGN KEY (profesor_id) REFERENCES profesores(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- 3. Tabla de Estudiantes (Con campo activo para soft-delete)
CREATE TABLE estudiantes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE, -- Soft delete implementado
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 4. Tabla Pivote: Inscripciones
CREATE TABLE inscripciones (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    estudiante_id BIGINT NOT NULL,
    materia_id BIGINT NOT NULL,
    fecha_inscripcion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_inscripcion_estudiante FOREIGN KEY (estudiante_id) REFERENCES estudiantes(id) ON DELETE CASCADE,
    CONSTRAINT fk_inscripcion_materia FOREIGN KEY (materia_id) REFERENCES materias(id) ON DELETE RESTRICT,
    CONSTRAINT uq_estudiante_materia UNIQUE (estudiante_id, materia_id)
) ENGINE=InnoDB;

-- ==========================================
-- DATOS SEMILLA (SEED DATA)
-- ==========================================

-- 5 Profesores
INSERT INTO profesores (nombre) VALUES 
('Prof. García'), ('Prof. Martínez'), ('Prof. López'), ('Prof. Rodríguez'), ('Prof. Fernández');

-- 10 Materias (2 por profesor)
INSERT INTO materias (nombre, profesor_id) VALUES 
('Matemáticas', 1), ('Física', 1),
('Programación', 2), ('Bases de Datos', 2),
('Redes', 3), ('Seguridad', 3),
('Arquitectura', 4), ('Cloud Computing', 4),
('Ética', 5), ('Gestión de Proyectos', 5);

-- Índices para optimización (Senior touch)
CREATE INDEX idx_materias_profesor ON materias(profesor_id);
CREATE INDEX idx_inscripciones_estudiante ON inscripciones(estudiante_id);