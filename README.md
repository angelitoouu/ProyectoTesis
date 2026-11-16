# Sistema Web para Gestion de Pedidos, Clientes y Estados en Taller de Costura

Sistema web desarrollado para la gestion integral de pedidos, control de estados de confeccion, registro de clientes con medidas corporales y seguimiento publico de prendas.

El software da cobertura a los cuatro objetivos especificos del proyecto:
1. Registro de encargos: Datos de cliente, especificaciones de la prenda, medidas corporales (cintura, largo, tiro, busto, cadera), fecha estimada de entrega, precio total y abono inicial con generacion automatica de ticket unico (TK-XXXX).
2. Panel de control con estados: Tablero de seguimiento ordenado por fecha de entrega que gestiona el ciclo completo de confeccion (Pendiente -> En proceso -> Listo para prueba -> Listo para retiro -> Entregado).
3. Historial de clientes: Registro centralizado de clientes, datos de contacto, historial de trabajos y consulta de medidas anteriores.
4. Consulta publica: Interfaz para que el cliente final verifique el avance de su prenda y el saldo pendiente mediante su numero de telefono o codigo de ticket.

---

## Estructura del Proyecto

```text
ProyectoTesis/
├── backend/
│   ├── database/
│   │   └── schema.sql       # Script DDL de PostgreSQL con tablas y datos iniciales
│   ├── src/
│   │   ├── config/          # Configuracion de base de datos y variables de entorno
│   │   ├── controllers/     # Controladores de peticiones HTTP
│   │   ├── middlewares/     # Middleware de captura y gestion de errores
│   │   ├── routes/          # Rutas modulares de la API (/api/encargos, /api/clientes, /api/consulta, /api/health)
│   │   ├── services/        # Capa de logica de negocio y consultas SQL
│   │   └── utils/           # Generador de tickets unicos
│   ├── tests/               # Pruebas automatizadas unitarias
│   ├── .env.example         # Plantilla de configuracion de entorno
│   └── server.js            # Punto de entrada del servidor
├── frontend/
│   ├── src/
│   │   ├── assets/styles/   # Sistema de estilos y variables CSS
│   │   ├── components/      # Componentes reutilizables (Navbar, EstadoBadge)
│   │   ├── pages/           # Vistas (NuevoEncargo, Panel, Clientes, Consulta)
│   │   ├── services/        # Cliente HTTP Axios configurado
│   │   └── utils/           # Formateo de fechas y moneda (CLP)
│   ├── .env.example         # Plantilla de configuracion de entorno
│   └── vite.config.js       # Configuracion de Vite
├── .gitignore               # Archivos y carpetas ignoradas por Git
├── LICENSE                  # Licencia de uso
└── README.md                # Documentacion principal del repositorio
```

---

## Organizacion del Repositorio

### Estrategia de Ramificacion
El repositorio implementa una estrategia de ramas estructurada:
- main: Rama protegida que contiene codigo estable y validado.
- develop: Rama de integracion y desarrollo activo.
- feature/*: Ramas temporales para la implementacion de funcionalidades especificas.
- fix/*: Ramas para correccion de errores puntuales.

### Convencion de Commits
Los commits del proyecto siguen el estandar Conventional Commits para asegurar trazabilidad y claridad en el historial:
- feat: Nueva funcionalidad (ejemplo: feat: agregar calculo automatico de saldo).
- fix: Correccion de un fallo (ejemplo: fix: corregir desbordamiento en campos del formulario).
- docs: Actualizaciones a la documentacion (ejemplo: docs: actualizar guia de instalacion).
- style: Ajustes de disenio, espaciado o formato sin alterar logica.
- refactor: Reestructuracion interna de codigo sin cambio funcional.
- test: Creacion o modificacion de pruebas unitarias.

---

## Requisitos Previos

- Node.js (v18.0 o superior)
- PostgreSQL (v14.0 o superior)
- Git

---

## Guia de Instalacion y Ejecucion Local

### 1. Configuracion de la Base de Datos

Crear la base de datos en PostgreSQL y cargar el esquema inicial con los datos de prueba:

```bash
createdb TallerCostura
psql -d TallerCostura -f backend/database/schema.sql
```

El script genera las tablas `clientes` y `encargos`, los indices de busqueda y registros iniciales de ejemplo.

### 2. Configuracion y Puesta en Marcha del Backend

```bash
cd backend
npm install
cp .env.example .env
```

Revisar el archivo `.env` para ajustar las credenciales de PostgreSQL en caso de ser necesario (por defecto utiliza puerto 5432, usuario postgres y base de datos TallerCostura).

Iniciar el servidor en modo desarrollo:
```bash
npm run dev
```

El backend estara disponible en `http://localhost:3000`.

Para ejecutar la suite de pruebas automatizadas:
```bash
npm test
```

### 3. Configuracion y Puesta en Marcha del Frontend

En una terminal separada:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

La aplicacion quedara disponible en `http://localhost:5173`.

Para verificar la compilacion de produccion:
```bash
npm run build
```

---

## Endpoints de la API REST

| Metodo | Ruta | Descripcion |
|---|---|---|
| GET | /api/health | Verificacion de estado del servicio |
| GET | /api/encargos | Obtener lista de encargos ordenados por fecha de entrega |
| GET | /api/encargos/:id | Obtener el detalle de un encargo especifico |
| POST | /api/encargos | Registrar un encargo y generar codigo de ticket |
| PATCH | /api/encargos/:id/estado | Actualizar la etapa o estado de un encargo |
| PUT | /api/encargos/:id | Modificar datos y especificaciones de un encargo |
| DELETE | /api/encargos/:id | Eliminar un encargo del sistema |
| GET | /api/clientes | Obtener listado de clientes registrados |
| GET | /api/clientes/:id | Obtener historial de encargos y medidas de un cliente |
| GET | /api/consulta | Consulta publica de encargos por telefono o codigo de ticket |

---

## Flujo Operativo del Sistema

1. Nuevo Encargo: Se ingresan los datos del cliente, prenda, medidas corporales y presupuesto (precio y abono). El sistema calcula el saldo en tiempo real y asigna un codigo de ticket unico.
2. Panel de Estados: La costurera o encargado visualiza el tablero de control, el saldo pendiente de cada encargo y avanza el estado del pedido segun la etapa de confeccion.
3. Clientes: Permite consultar el historial de clientes, facilitando la recuperacion de medidas previas sin necesidad de volver a tomarlas.
4. Consulta Publica: El cliente final ingresa a la consulta web con su telefono o codigo de ticket para conocer el avance de su encargo y el monto pendiente a pagar al momento del retiro.

---

## Licencia

Este proyecto esta bajo la Licencia MIT. Para mas detalles, consultar el archivo LICENSE.
