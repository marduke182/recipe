# Digital Origin Test

Thanks for taking the time to do our frontend coding test!

**Introduction:**

Our CEO talked with us last week and the
company is looking for new business area, he is
fan of movies and TV Shows (who does not?), so
he propose us to make an application to
store our favorites Movies and TV Shows, share it, etc,
The purpose of this test is to make an MVP about this new idea.

**Rules:**

* There is no time limit.
* We provide a base setup for the frontend. This setup is based in the famous create-react-app. If you don't feel comfortable using it, just feel free to use whatever technology you want.
* (Not mandatory) It would be great if you use our DigitalOrigin's CSS Framework a.k.a do-css-framework in your test. We provide a copy the styles under `./frontend/public/css/do-css-framework.css`. Anyway feel free use another CSS framework or build plain SCSS / CSS if you don't want to use it.
* The final test should build properly and we should be able to see something in our browsers (provide instructions if needed)

**Explanation:**

One of our interns started working on the project (Ver+Tarde),
but summer ended and he had to leave the company.

As far as we know, our intern did almost the whole
backend part and started doing some frontend implementation, actually
he did not do to much, so if you want you can replace it
for the technology of your preference.

Below you can find the documentation our intern made:

**TL;DR; Backend is almost done, but he didn't had time
to finish frontend application.**

## Current status

The application has two parts,

### Running instructions

#### Frontend

* From `frontend` folder
* Install dependencies ```npm install```
* Copy frontend.env in dot env into frontend folder ```cp ../frontend.env frontend/.env```
* Start application ```npm start```

#### Backend with Docker

There is a docker-compose configured to get the server up on port 3000

* From the base test folder
* [Install docker](https://docs.docker.com/engine/installation/) be sure
support docker compose version 3
*  Run ```docker-compose up server```

#### Backend without Docker

* Requirement: node v8.9.0
* From the `backend` folder
* Install mongodb
* Install dependencies ```npm install```
* Copy backend.env in dot env at folder ```cp ../backend.env backend/.env```
* Start application ```npm start```

### API Endpoints

The API will be served under http://localhost:3001

##### Swagger

You can find swagger documentation in *backend/docs* under filename *swagger.json*.

To see the documentation you can getting with docker-compose.yml with this command: `docker-compose up doc` 
Or if you want you can paste json content in: [swagger editor](https://editor.swagger.io/)

##### Public endpoints

  Can be accessed with no authentication.

  * **POST** */user* -> Create a new user
  * **POST** */login* -> Try to login in the application returns a JWT token

##### Protected endpoints

  Each request should have an HTTP header `Authorization BEARER {JWT_TOKEN}` otherwise the API server will respond with 401 Unauthorized HTTP Code.

* **GET** */movies* -> Get a list of the top movies
* **GET** */movies/{movieId}* -> Get info about a specific movie
* **GET** */movies/configuration* -> Meta information about image paths and size
* **GET** */user/favorites* -> Get current user favorite movies
* **POST** */user/favorites* -> Add a new movie to favorites

#### Get a movie poster or image

* Get base URL and available size from */movies/configuration* endpoint
* The final URL will be `{base_url}{poster_size}{url_in_movie}`. For more information (https://developers.themoviedb.org/3/getting-started/images)

#### Architecture

* NodeJS v8.9.0
* MongoDB

### Frontend

WIP: Is still in construction.

#### Done

* React application created with create-react-app
* Configured do-css-framework to work with the application
* Configured *react-router*
* Simple Login page created (unfinished) (http://localhost:3000/login)
* SignUp page page created (unfinished) (http://localhost:3000/users/sign_up)

#### Missing

* Dashboard Page
* Show discovery movies
* Add movies to favorites
* See user favorites
* Some unit testing or e2e testing will be great!

#### Architecture

* React
* React Router
* Do CSS Framework

#### DO CSS Framework

This is our internal CSS framework you can find
the styleguide [here](https://digitalorigin.github.io/pmt-mbo-fe/)
