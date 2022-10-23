FROM node:16-alpine

# Set basic AWS credentials
ENV AWS_ACCESS_KEY_ID XXID
ENV AWS_SECRET_ACCESS_KEY XXSECRET
ENV AWS_SESSION_TOKEN XXTOKEN

# Set the work directory to app folder. 
# We will be copying our code here
WORKDIR /backend

# Copy package.json file in the node folder inside container
COPY package.json .

# Install the dependencies in the container
RUN npm install

# Copy the rest of the code in the container
COPY . .

# Run the node server with compiled server file
CMD ["node", "server.js"]

# Expose port
EXPOSE 3000