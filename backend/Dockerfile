# Imagen base: Node.js 22 sobre Alpine (ligera)
FROM node:22-alpine

# Carpeta de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivo package*.json para aprovechar la caché de Docker.
COPY package*.json ./

# Instala todas las dependencias, incluidas las de desarrollo.
RUN npm install

# Copia el resto del código del backend
COPY . .

# Documenta que la API escucha en el puerto 3000
EXPOSE 3000

# Comando de inicio del contenedor: arranca la API directamente con Node.
CMD ["node", "server.js"]

