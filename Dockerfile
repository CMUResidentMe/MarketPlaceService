# Use an official Node runtime as a parent image
FROM node:20

# Set the working directory in the container
WORKDIR /usr/src/application

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# If you are building your code for production
# RUN npm ci --only=production
RUN npm install

# Bundle app source inside the Docker image
COPY . .

# Your app binds to port 7070 so you'll use the EXPOSE instruction to have it mapped by the docker daemon
EXPOSE 7070

# Run the app when the container launches
CMD [ "node", "server.js" ]
