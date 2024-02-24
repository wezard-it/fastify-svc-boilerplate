# Use the official Node.js 20 image as the base image
FROM node:20

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Copy the rest of the application code to the working directory
COPY ./src ./src
COPY ./schemaGenerator.js ./
COPY ./tsconfig.json ./
COPY ./prisma ./prisma
# COPY ./.env ./

# Install the application's dependencies
RUN npm install
RUN npm run schema:generate
RUN npm run prisma:generate
RUN npm run build

# Expose the port on which the application will run
EXPOSE 3000

# Start the application
CMD [ "npm", "start" ]
