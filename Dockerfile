# Use the official Node.js 20 image as the base image
FROM node:20

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and yarn.lock to the working directory
COPY package*.json ./
COPY ./yarn.lock ./

# Copy the rest of the application code to the working directory
COPY ./src ./src
COPY ./wezard-scripts ./wezard-scripts
COPY ./tsconfig.json ./
COPY ./index.ts ./
COPY ./prisma ./prisma
# COPY ./.env ./

# Install the application's dependencies
RUN yarn install
RUN yarn run prisma:generate
RUN yarn run schema:generate
RUN yarn run build

# Expose the port on which the application will run
EXPOSE 3000

# Start the application
CMD [ "yarn", "start" ]
