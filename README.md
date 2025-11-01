<div align="center">

# 🏠 AlquilAR
### Sistema Web de Gestión de Alquileres  
**Trabajo Final Integrador — Tecnicatura Universitaria en Programación**  
📍 *Universidad Tecnológica Nacional — Facultad Regional Rosario (UTN FRRo)*

---

<img src="./frontend/public/logo/techo-amarillo-blanco.webp" alt="Logo de AlquilAR" width="280" style="border-radius: 10px;"/>

---

</div>

## 🧩 Introducción

**AlquilAR** es una plataforma web desarrollada como **Trabajo Final Integrador (TFI)** de la carrera **Tecnicatura Universitaria en Programación (UTN FRRo)**.  
Su objetivo es ofrecer una solución moderna y directa para conectar **propietarios e inquilinos**, eliminando la intermediación de inmobiliarias.

El sistema permite:
- Registrar propiedades con sus características, ubicación, imágenes y documentación.
- Administrar alquileres de forma sencilla y transparente.
- Brindar una experiencia intuitiva, segura y eficiente para ambas partes.

---

## 👥 Integrantes del equipo

| Nombre | Rol |
|---------|------|
| 🧑‍💻 **Baptista Carvalho, Gabriela** | Fullstack |
| 👩‍💻 **Calvo, Celeste** | Fullstack |
| 👩‍💻 **Ríos, Elena** | Fullstack |

---

## 💻 Tecnologías utilizadas

<div align="center">

| Frontend | Backend | ORM | Base de Datos |
|-----------|----------|-----|----------------|
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="60" alt="React JS" /> | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" width="60" alt="Express JS" /> | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sequelize/sequelize-original.svg" width="60" alt="Sequelize ORM" /> | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg" width="60" alt="SQLite" /> |

</div>

---

### ⚛️ **React JS (Frontend)**
> Framework de JavaScript utilizado para construir interfaces dinámicas, rápidas y modulares.  
> En *AlquilAR*, React gestiona todo el flujo de interacción del usuario: registro de propiedades, carga de imágenes y navegación entre formularios con *React Router DOM*.  
>  
> Además, se implementaron componentes reutilizables y un diseño *responsive*, garantizando una experiencia fluida tanto en escritorio como en dispositivos móviles.

---

### 🧩 **Express JS (Backend)**
> Framework minimalista para Node.js que permite crear servidores HTTP y APIs REST de manera sencilla.  
> En *AlquilAR*, **Express** actúa como el intermediario entre el frontend y la base de datos, gestionando rutas, validaciones, middlewares y autenticación con **JWT**.  
>  
> También maneja operaciones CRUD seguras para los distintos módulos del sistema (usuarios, propiedades, alquileres, etc.) y aplica buenas prácticas de separación en controladores y servicios.

---

### 🗂️ **Sequelize (ORM)**
> ORM (Object-Relational Mapping) que facilita la comunicación entre el código JavaScript y la base de datos.  
>  
> Con Sequelize, el equipo definió los **modelos y relaciones** (por ejemplo, *Propiedad–Usuario–Localidad*), evitando escribir SQL manualmente y manteniendo la integridad referencial.  
>  
> Además, permite migraciones controladas, validaciones de datos, y la posibilidad de cambiar de motor de base de datos en el futuro sin modificar la lógica del sistema.

---

### 🪶 **SQLite (Base de Datos)**
> Motor de base de datos liviano, embebido y altamente eficiente, ideal para entornos académicos o proyectos en fase de desarrollo.  
>  
> *AlquilAR* utiliza SQLite para persistir la información de usuarios, propiedades, publicaciones y alquileres.  
> Su integración con Sequelize permite manejar datos relacionales (por ejemplo: una propiedad pertenece a una localidad y a un propietario) de forma práctica y portable, sin necesidad de un servidor adicional.

---

### ⚙️ **Dependencias adicionales**
| Herramienta | Uso principal |
|--------------|----------------|
| **Bcrypt** | Hash de contraseñas de usuario |
| **JWT (Json Web Token)** | Autenticación y manejo de sesiones seguras |
| **Dotenv** | Manejo de variables de entorno |
| **CORS** | Permitir comunicación entre cliente y servidor en entornos distintos |
| **Bootstrap / CSS personalizado** | Estilo visual, grillas y componentes responsivos |

---


### ✨ Características principales

- Registro y autenticación de usuarios (JWT + Bcrypt)
- Alta, modificación y baja de propiedades
- Carga de imágenes y documentación
- Visualización de propiedades disponibles
- Validaciones en frontend y backend
- Interfaz responsive y moderna (Bootstrap + CSS personalizado)



