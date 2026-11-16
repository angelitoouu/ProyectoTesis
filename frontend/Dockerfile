# Imagen base: Node.js 22 sobre Alpine
FROM node:22-alpine

# Carpeta de trabajo dentro de esta etapa
WORKDIR /app

# Copia los archivo package*.json para aprovechar la caché de Docker.
COPY package*.json ./

# Instala todas las dependencias, incluidas las de desarrollo.
RUN npm install

# Copia el resto del código del frontend
COPY . .

# Variable de build: URL de la API. Se inserta en el JS final al compilar, por lo que debe estar disponible antes de hacer npm run build
ARG VITE_API_URL=http://localhost:3000/api
ARG VITE_BASE_URL=http://localhost:3000/api
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_BASE_URL=${VITE_BASE_URL}

# Genera la carpeta dist/ con los archivos estáticos listos para producción.
RUN npm run build

# Documenta que el servidor escucha en el puerto 4173
EXPOSE 4173

# Inicia Vite Preview en 0.0.0.0 para que sea accesible desde fuera del contenedor.
CMD ["./node_modules/.bin/vite", "preview", "--host", "0.0.0.0", "--port", "4173"]

