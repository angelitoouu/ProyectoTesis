# Sistema Web para Gestión de Pedidos, Clientes y Estados en Taller de Costura

Sistema web desarrollado para la gestión integral de pedidos, control de estados de confección, registro de clientes con medidas corporales, autenticación de usuarios y seguimiento público de prendas.

El software cubre los cuatro objetivos específicos del proyecto:
1. **Registro de encargos:** Datos de cliente, especificaciones de la prenda, medidas corporales (cintura, largo, tiro, busto, cadera), fecha estimada de entrega, precio total y abono inicial con generación automática de ticket único (TK-XXXX).
2. **Panel de control con estados:** Tablero de seguimiento ordenado por fecha de entrega que gestiona el ciclo completo de confección (Pendiente → En proceso → Listo para prueba → Listo para retiro → Entregado).
3. **Historial de clientes:** Registro centralizado de clientes, datos de contacto, historial de trabajos y consulta de medidas anteriores.
4. **Consulta pública:** Interfaz para que el cliente final verifique el avance de su prenda y el saldo pendiente mediante su número de teléfono o código de ticket.

---

## Estructura del Proyecto

```text
ProyectoTesis/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuración de base de datos y variables de entorno
│   │   ├── controllers/     # Controladores de peticiones HTTP (encargo, cliente, consulta)
│   │   ├── helpers/         # Helpers reutilizables (bcrypt)
│   │   ├── middlewares/     # Middleware de captura y gestión de errores
│   │   ├── routes/          # Rutas modulares de la API (/api/encargos, /api/clientes, /api/consulta, /api/health, /api/auth)
│   │   ├── services/        # Capa de lógica de negocio y consultas SQL (encargo, cliente, mail)
│   │   ├── tests/
│   │   │   ├── integration/ # Pruebas de integración (health, auth, encargos, consulta, estados, abonos, validaciones, rutas)
│   │   │   └── unit/        # Pruebas unitarias (bcrypt, ticket, fechas, montos, teléfono, nombre, estados)
│   │   ├── utils/           # Generador de tickets únicos y validadores
│   │   └── validations/     # Esquemas de validación por recurso (encargo, cliente, consulta)
│   │   └── app.js           # Configuración de Express y middlewares globales
│   ├── Dockerfile
│   ├── server.js            # Punto de entrada del servidor
│   └── package.json
├── frontend/
│   ├── cypress/             # Pruebas E2E con Cypress
│   ├── src/
│   │   ├── assets/styles/   # Sistema de estilos y variables CSS
│   │   ├── components/      # Componentes reutilizables (Navbar, EstadoBadge)
│   │   ├── context/         # Contexto global de autenticación (AuthContext)
│   │   ├── pages/           # Vistas (Inicio, Login, NuevoEncargo, Panel, Clientes, Consulta)
│   │   ├── routes/          # Rutas de la app (AppRoutes, RutaProtegida)
│   │   ├── services/        # Cliente HTTP Axios configurado
│   │   └── utils/           # Formateo de fechas y moneda (CLP)
│   ├── Dockerfile
│   ├── vite.config.js       # Configuración de Vite
│   └── package.json
├── .github/
│   └── workflows/
│       └── deploy.yml       # Pipeline CI/CD con GitHub Actions (self-hosted)
├── docker-compose.yaml      # Orquestación de servicios (db, backend, frontend)
├── .gitignore
├── LICENSE
└── README.md
```

---

## Organización del Repositorio

### Estrategia de Ramificación
El repositorio implementa una estrategia de ramas estructurada:
- `main`: Rama protegida que contiene código estable y validado.
- `develop`: Rama de integración y desarrollo activo.
- `feature/*`: Ramas temporales para la implementación de funcionalidades específicas.
- `fix/*`: Ramas para corrección de errores puntuales.

### Convención de Commits
Los commits del proyecto siguen el estándar Conventional Commits para asegurar trazabilidad y claridad en el historial:
- `feat`: Nueva funcionalidad (ejemplo: `feat: agregar cálculo automático de saldo`).
- `fix`: Corrección de un fallo (ejemplo: `fix: corregir desbordamiento en campos del formulario`).
- `docs`: Actualizaciones a la documentación (ejemplo: `docs: actualizar guía de instalación`).
- `style`: Ajustes de diseño, espaciado o formato sin alterar lógica.
- `refactor`: Reestructuración interna de código sin cambio funcional.
- `test`: Creación o modificación de pruebas unitarias o de integración.

---

## Requisitos Previos

- Node.js (v18.0 o superior)
- PostgreSQL (v14.0 o superior)
- Git
- Docker y Docker Compose *(opcional, para ejecución containerizada)*

---

## Guía de Instalación y Ejecución Local

### 1. Configuración de la Base de Datos

Crear la base de datos en PostgreSQL y cargar el esquema inicial con los datos de prueba:

```bash
createdb TallerCostura
psql -d TallerCostura -f backend/database/schema.sql
```

El script genera las tablas `clientes` y `encargos`, los índices de búsqueda y registros iniciales de ejemplo.

### 2. Configuración y Puesta en Marcha del Backend

```bash
cd backend
npm install
cp .env.example .env
```

Revisar el archivo `.env` para ajustar las credenciales de PostgreSQL en caso de ser necesario (por defecto utiliza puerto `5432`, usuario `postgres` y base de datos `TallerCostura`).

Iniciar el servidor en modo desarrollo:
```bash
npm run dev
```

El backend estará disponible en `http://localhost:3000`.

Ejecutar la suite de pruebas con Vitest:
```bash
npm test
```

### 3. Configuración y Puesta en Marcha del Frontend

En una terminal separada:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

La aplicación quedará disponible en `http://localhost:5173`.

Ejecutar pruebas E2E con Cypress:
```bash
npm run cypress:open   # modo interactivo
npm run cypress:run    # modo headless (CI)
```

Para verificar la compilación de producción:
```bash
npm run build
```

---

## Ejecución con Docker Compose

El proyecto incluye un archivo `docker-compose.yaml` que levanta los tres servicios de forma orquestada:

```bash
docker compose up --build
```

| Servicio | Puerto expuesto | Descripción |
|---|---|---|
| `db` | `5432` | PostgreSQL 16 con volumen persistente |
| `backend` | `3000` | API Node.js / Express |
| `frontend` | `4173` | Build de React servida con Vite Preview |

> [!NOTE]
> El backend espera que la base de datos esté `healthy` antes de iniciar. El frontend se conecta al backend en `http://localhost:3000/api`.

---

## Endpoints de la API REST

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/health` | Verificación de estado del servicio |
| POST | `/api/auth/login` | Autenticación de usuario (email + contraseña) |
| GET | `/api/encargos` | Obtener lista de encargos ordenados por fecha de entrega |
| GET | `/api/encargos/:id` | Obtener el detalle de un encargo específico |
| POST | `/api/encargos` | Registrar un encargo y generar código de ticket |
| PATCH | `/api/encargos/:id/estado` | Actualizar la etapa o estado de un encargo |
| PUT | `/api/encargos/:id` | Modificar datos y especificaciones de un encargo |
| DELETE | `/api/encargos/:id` | Eliminar un encargo del sistema |
| GET | `/api/clientes` | Obtener listado de clientes registrados |
| GET | `/api/clientes/:id` | Obtener historial de encargos y medidas de un cliente |
| GET | `/api/consulta` | Consulta pública de encargos por teléfono o código de ticket |

---

## Flujo Operativo del Sistema

1. **Login:** El administrador o costurera inicia sesión para acceder al sistema protegido.
2. **Nuevo Encargo:** Se ingresan los datos del cliente, prenda, medidas corporales y presupuesto (precio y abono). El sistema calcula el saldo en tiempo real y asigna un código de ticket único.
3. **Panel de Estados:** La costurera visualiza el tablero de control, el saldo pendiente de cada encargo y avanza el estado del pedido según la etapa de confección.
4. **Clientes:** Permite consultar el historial de clientes, facilitando la recuperación de medidas previas sin necesidad de volver a tomarlas.
5. **Consulta Pública:** El cliente final ingresa a la consulta web con su teléfono o código de ticket para conocer el avance de su encargo y el monto pendiente a pagar al momento del retiro.

---

## CI/CD

El repositorio cuenta con un pipeline de GitHub Actions (`.github/workflows/deploy.yml`) que se ejecuta automáticamente en cada push a `main`:

1. Descarga el código (`actions/checkout@v4`).
2. Instala dependencias del backend.
3. Inyecta las variables de entorno desde el servidor (`~/backend.env`).
4. Compila el frontend con `vite build`.
5. Reinicia el backend en producción con PM2 (`api-backend`).

El pipeline corre sobre un runner **self-hosted**.

---

## Licencia

Este proyecto está bajo la Licencia MIT. Para más detalles, consultar el archivo [LICENSE](LICENSE).
