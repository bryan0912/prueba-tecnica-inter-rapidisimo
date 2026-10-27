# Prueba Técnica - Inter Rapidísimo

Aplicación web para el registro de estudiantes y gestión de inscripción de materias, desarrollada con un enfoque en **Clean Architecture** y buenas prácticas de nivel Senior.

## 🛠️ Stack Tecnológico
*   **Backend:** .NET 8 (C#), Entity Framework Core, MySQL, JWT (JSON Web Tokens), BCrypt.
*   **Frontend:** Angular 17+ (Standalone Components), Angular Material, SCSS.
*   **Base de Datos:** MySQL 8.0.

## 🏗️ Arquitectura del Proyecto
El backend está construido siguiendo los principios de **Clean Architecture**:
*   **Domain:** Entidades puras y reglas de negocio (ej. validación de máximo 3 materias y no repetir profesor).
*   **Application:** DTOs e interfaces de casos de uso.
*   **Infrastructure:** Implementación de persistencia con EF Core y MySQL.
*   **Api:** Controladores RESTful, configuración de seguridad (JWT) y CORS.

## 🚀 Cómo ejecutar el proyecto localmente

### Requisitos previos
*   .NET 8 SDK
*   Node.js (v18+) y Angular CLI
*   MySQL Server (corriendo en el puerto 3306)

### 1. Configurar la Base de Datos
1. Abre MySQL Workbench y crea una base de datos vacía llamada `inter_db`.
2. Ejecuta el script `database/init.sql` (incluido en el repositorio) para crear las tablas e insertar los datos de prueba (10 materias, 5 profesores).

### 2. Levantar el Backend
1. En la raíz del proyecto, abre una terminal y ejecuta:
   ```bash
   dotnet run --project src/StudentRegistration.Api


La API estará disponible en http://localhost:5177 (Swagger en /swagger).

3. Levantar el Frontend
Entra a la carpeta del frontend:

bash
cd student-registration-ui
Instala las dependencias (si no lo has hecho):

bash
npm install
Inicia el servidor de Angular:

bash
ng serve -o
La aplicación abrirá automáticamente en http://localhost:4200.

🧠 Decisiones de Diseño (Toque Senior)
Seguridad: Las contraseñas se encriptan con BCrypt y la autenticación se maneja con JWT. Se configuró un interceptor en Angular para inyectar el token automáticamente.

Reglas de Negocio: La validación de "máximo 3 materias" y "no repetir profesor" se realiza en la capa de Domain lanzando excepciones personalizadas, las cuales son capturadas por la API para devolver errores HTTP semánticos (400 Bad Request, 409 Conflict).

Experiencia de Usuario: El Dashboard permite cancelar materias inscritas, liberando el cupo para seleccionar otras, con validaciones en tiempo real.

Mejora Futura (Docker): Por limitaciones del entorno local, no se implementó Docker, pero la aplicación está estructurada para ser dockerizada fácilmente en el futuro con un Dockerfile y docker-compose.yml.

👨‍💻 Autor
[Bryan Ospina]

text

---

### 🗄️ Paso 2: El Script SQL de Respaldo (`init.sql`)

Para que el evaluador no tenga que correr las migraciones de .NET, crearemos el script SQL con los datos. 

1. Crea una carpeta llamada `database` en la raíz del proyecto.
2. Dentro, crea un archivo `init.sql` y pega esto (ya incluye las correcciones de los nombres de las columnas que aprendimos):

```sql
CREATE DATABASE IF NOT EXISTS inter_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE inter_db;

-- Tablas
CREATE TABLE profesores (
    Id BIGINT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL
);

CREATE TABLE materias (
    Id BIGINT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    Creditos INT NOT NULL DEFAULT 3,
    ProfesorId BIGINT NOT NULL,
    FOREIGN KEY (ProfesorId) REFERENCES profesores(Id)
);

CREATE TABLE estudiantes (
    Id BIGINT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    Email VARCHAR(150) NOT NULL UNIQUE,
    PasswordHash VARCHAR(255) NOT NULL,
    Activo BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE inscripciones (
    Id BIGINT AUTO_INCREMENT PRIMARY KEY,
    EstudianteId BIGINT NOT NULL,
    MateriaId BIGINT NOT NULL,
    FechaInscripcion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (EstudianteId) REFERENCES estudiantes(Id) ON DELETE CASCADE,
    FOREIGN KEY (MateriaId) REFERENCES materias(Id),
    UNIQUE (EstudianteId, MateriaId)
);

-- Datos Semilla
INSERT INTO profesores (Nombre) VALUES 
('Prof. García'), ('Prof. Martínez'), ('Prof. López'), ('Prof. Rodríguez'), ('Prof. Fernández');

INSERT INTO materias (Nombre, Creditos, ProfesorId) VALUES 
('Matemáticas', 3, 1), ('Física', 3, 1),
('Programación', 3, 2), ('Bases de Datos', 3, 2),
('Redes', 3, 3), ('Seguridad', 3, 3),
('Arquitectura', 3, 4), ('Cloud Computing', 3, 4),
('Ética', 3, 5), ('Gestión de Proyectos', 3, 5);
