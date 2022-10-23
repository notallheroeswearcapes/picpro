# PicPro

This is the project for `PicPro` - a scalable image transformation application for the second assignment of the QUT course *CAB432 Cloud Computing*. It consists of an Angular frontend and an Express backend. The whole project is built to be run in a cloud environment. The project can easily be dockerized with `docker compose`. 

## Description
TODO 

## Architecture
We decided to follow a more real-life approach and divided frontend and backend into separate sub-projects which can be dockerized independently. This also accounts for separation of concerns, encapsulation, abstraction and several other principles of software architecture. We chose Angular as a frontend framework as the team already had experience with this tech stack and wanted to take the opportunity of the assignment to freshen up their knowledge with respect to the dockerization of a SPA. Dockerization happens in principle with `docker compose` to minimize the effort required to run the project from scratch.

### frontend
This is the client-side project for `PicPro`. It is an Angular single-page web application served on a NGINX web server in production mode responsible for proxying requests to the server. Please refer to the documentation of the client here: `frontend/README.md`.

### backend
This is the server-side project for `PicPro`. It is an Express backend served on a Node.js server written in JavaScript. An API with TODO endpoints is exposed to TODO. Please refer to the documentation of the server here: `backend/README.md`.

## How to use
The project can easily be started via Docker by running `docker compose up`. This creates the images and containers for the server and client and starts them. It is necessary to set AWS keys as environment variables and sourcing them from the same shell as the `docker compose` command is executed before actually running the project. The following variables need to be set:

* AWS_ACCESS_KEY_ID: key ID for AWS
* AWS_SECRET_ACCESS_KEY: access key for AWS
* AWS_SESSION_TOKEN: session token for AWS

If the images have already been created and you want to run the containers, it is recommended to execute the following commands to facilitate communication between frontend and backend, as well as set environment variables explicitly:

```
docker network create net
docker run --network net --name backend -p 3000:3000 -e AWS_ACCESS_KEY_ID="XYZ" -e AWS_SECRET_ACCESS_KEY="XYZ" -e AWS_SESSION_TOKEN="XYZ" -t your-registry/picpro-image-name:server
docker run --network net --name frontend -p 4200:80 -t your-registry/picpro-image-name:client
```

Please note that the images are distinguished only by tag server or client. This is due to a limitation on DockerHub allowing only a single private repository. It was necessary to keep the project private for the submission of the assignment. Otherwise the two images would have been pushed to separate repositories.