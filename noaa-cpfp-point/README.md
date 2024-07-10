# Setting up the NOAA CPFP POINT

### Steps
* Install Node
* Install NVM (optional).
    * If NVM installed, `nvm use`
    * Else, upgrade to latest LTS version. (atleast v.16.17.0)
* Install dependencies using `yarn` or `npm i`
* create `.env` file in the proect root. A copy of `.env.example` with your own mapbox access token.
    - Note: To run the application locally, put \
        `PUBLIC_URL=http://localhost:<port>`
    - Example: \
        `PUBLIC_URL=http://localhost:8080`
* `yarn start` to start the project.

# Building the NOAA CPFP POINT

### Steps

In the console do the following:
* `export PUBLIC_URL=XXX`, as an env variable
* `yarn development` for development build
* `yarn production` for production build
* The webpacked version is available inside `<project_root>/dist/` and is ready for hosting.