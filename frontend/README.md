# PicPro - Frontend

This is the client side project for `PicPro` - our application for the second assignment of the QUT course *CAB432 Cloud Computing*. The client provides a user interface to upload or choose previously uploaded images from an AWS S3 bucket, transform these images using an array of options like resizing, transcoding, greyscaling, etc. and then uploading or downloading the transformed image. It is also possible to store transformation settings as presets to a Redis cache hosted on AWS ElastiCache.

## Description
The client is a SPA created with the frontend framework Angular. It was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.1.3. Please refer to `package.json` for dependencies and versions. 

### Components
The app consists of a single, default `AppComponent`. It was not necessary to divide the application in additional components as a single HTML page suffices for the use cases of `PicPro`. There is only a small additional dialog component for saving transformed images called `SaveOutputDialog`. 

### Services
A single service called `PicProService` is responsible for performing HTTP calls to the server API. It is injected into the `AppComponent`.

### Models
* `Image`: data for an image (name, file, url, metadata)
* `Metadata`: metadata of an image, received from the backend (format, size, width, height, etc.)
* `Preset`: a defined set of transformation options with a specific name for reuse
* `Transformation`: a specific set of transformation options to be used on a specific image

### Charts
The charts are created with the open-source Javascript library [Chart.js](https://www.chartjs.org/docs/2.9.4/) in version 2.9.4. The charts are created in the frontend based on the results of the sentiment analysis.

### Pipes
The `BytesPipe` displays a file size given in Bytes to the best possible human-readable format (kB, MB, etc.).

### Interceptors
The `LoadingInterceptor` is an HTTP interceptor to detect the loading state of a web request. It is linked with the `PicProService` to provide the state to the progress bar during requests.

### Styling
Normal CSS is used to style components. Additionally, I experimented with the CSS framework [Tailwind](https://tailwindcss.com/docs/installation).

## How to use
Run `ng serve` for a development server. Navigate to `http://localhost:4200/`. The requests to the server will be proxied. Please refer to the `proxy.conf.json` file and the configurations which may need to be adapted according to your setup of the server.

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

You can also create a Docker image and start up a container with the following commands: 
```
docker build -t your-registry/picpro-image-name:client .
docker run --name server -p 4200:80 your-registry/picpro-image-name:client
```
The client application will then be available at `http://localhost:4200/`.

The Dockerfile of the client uses a multi-stage build. The first stage builds the Angular application and copies the artifacts. The second stage serves the app on a lightweight [NGINX](https://nginx.org/en/docs/beginners_guide.html) web server. This server also acts as a reverse proxy to redirect requests between client and server in any environment. This setup follows best-practise guidelines for serving Angular applications in a production environment and reduces the size of the Docker image heavily to around 25 MB (serving the app on the development server would have resulted in >2 GB). The configuration of the server was a major challenge.

Note that `docker compose up` can be used from the root project to run both server and client at once.

## Author

**Names:** Matthias Eder and Eric Zhang

**Student numbers:** 11378093 and 10319191

**Email addresses:** n11378093@qut.edu.au and n10319191@qut.edu.au