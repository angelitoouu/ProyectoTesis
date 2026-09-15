# Sistema Web - Gestión de Pedidos, Clientes y Estados (Taller de Costura)

Avance funcional del proyecto de título. Cubre los 4 objetivos específicos de la propuesta:

1. **Registro de encargos** (cliente, prenda, medidas, fecha de entrega, pago) → página "Nuevo Encargo"
2. **Panel de control con estados** (Pendiente → En proceso → Listo para prueba → Listo para retiro → Entregado) → página "Panel de Estados"
3. **Historial de clientes** (medidas y trabajos anteriores) → página "Clientes"
4. **Vista pública de consulta** por teléfono o código de ticket → página "Consulta Pública"

## Requisitos previos
- Node.js instalado
- PostgreSQL instalado y corriendo

## 1. Crear la base de datos

```bash
createdb taller_costura
psql -d taller_costura -f backend/database/schema.sql
```

Esto crea las tablas `clientes` y `encargos`, además de 2 clientes y 2 encargos de ejemplo para que tengas datos al mostrar el avance.

## 2. Levantar el backend

```bash
cd backend
npm install
cp .env.example .env
```

El archivo `.env` ya usa `DATABASE_URL=postgresql://postgres:1234@localhost:5432/taller_costura` por defecto; si tu PostgreSQL usa otro usuario o contraseña, ajústalo ahí. Luego:

```bash
npm run dev
```

Corre en `http://localhost:4000`

## 3. Levantar el frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Corre en `http://localhost:3000`

## Flujo para la demo de mañana
1. Entra a **"Nuevo Encargo"** y registra un encargo de prueba → anota el código de ticket que se genera.
2. Ve a **"Panel de Estados"** y cambia el estado del encargo con el selector.
3. Ve a **"Clientes"** y muestra el historial del cliente que acabas de crear.
4. Ve a **"Consulta Pública"** e ingresa el teléfono o código de ticket para mostrar la vista del cliente final.

## Próximos pasos (para la memoria)
- Autenticación para el panel administrativo (solo la costurera debe editar estados).
- Notificaciones automáticas (WhatsApp/email) al cambiar a "Listo para retiro".
- Validaciones más robustas de formularios (express-validator o zod).
- Deploy en un hosting simple (Render, Railway) para la prueba piloto.
