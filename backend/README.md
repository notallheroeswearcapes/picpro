# PicPro - Backend

This is the server side project for `PicPro` - our mashup for the second assignment of the QUT course *CAB432 Cloud Computing*. The server provides an API to TODO...

## Description
The server is written using JavaScript and consists of a basic [Express](https://expressjs.com/en/starter/installing.html) backend served on a [Node.js](https://nodejs.org/en/) server. The API of the server exposes TODO endpoints: ...

1. `/upload`



## APIs


1. `sharp`



2. `AWS S3`

A bucket on [AWS S3](https://aws.amazon.com/s3/) contains TODO
If the bucket does not exist yet it is created using the provided AWS credentials (see section *How to use*). The name of the S3 bucket can be redefined in the `.env` file or as an environment variable in the `docker run` command. It is set to `TODO` as default. 

3. `AWS ElastiCache for Redis`
TODO


## How to use
Run the command `npm run start:dev` to start up a development server which will run at port 3000. You can also create a Docker image and start up a container with the following commands: 
```
docker build -t your-registry/picpro-image-name:server .
docker run --name server -p 3000:3000 your-registry/picpro-image-name:server
```
The server application will then be available at `http://localhost:3000/`. If you wish to run the server locally, the AWS credentials should be supplied in the `credentials` file located in the `.aws` folder in the user's directory. Loading the credentials from this location is facilitated by setting the environment variable `AWS_SDK_LOAD_CONFIG` to 1 in the `.env` file. Using Docker to run the server requires you to set the environment variables for the AWS credentials and API key as well. You can either set these as environment variables in the bash shell and source them before conjuring up the container or set them explicitly with the `docker run` command with the `-e` options. A full command to run the container would look like this:

`docker run --name server -p 3000:3000 -e -e AWS_ACCESS_KEY_ID="XYZ" -e AWS_SECRET_ACCESS_KEY="XYZ" -e AWS_SESSION_TOKEN="XYZ" -t your-registry/picpro-image-name:server`

Note that `docker compose up` can be used from the root project to run both server and client at once.

## Authors

**Names:** Matthias Eder and Eric Zhang

**Student numbers:** 11378093 and 10319191

**Email addresses:** n11378093@qut.edu.au and n10319191@qut.edu.au