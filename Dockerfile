FROM node:latest

# Set the working directory in the container
WORKDIR /app

COPY . /app

# Install dependencies 
RUN npm install

# Expose the port300
EXPOSE 3000

ENV NAME candid

# Define the command  run your app
CMD ["npm", "run", "dev"]
