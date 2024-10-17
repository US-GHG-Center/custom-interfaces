# Installation and Usage
The steps below will walk you through setting up your own instance of the project. 

## Install Project Dependencies
To set up the development environment for this website, you'll need to install the following on your system:

- [Node](http://nodejs.org/) v20 (To manage multiple node versions we recommend [nvm](https://github.com/creationix/nvm))
- [npm](https://www.npmjs.com/) Package manager
- [Yarn](https://yarnpkg.com/) Package manager

## Install Application Dependencies

If you use [`nvm`](https://github.com/creationix/nvm), activate the desired Node version:

`nvm install`

Install Node modules:

`yarn install`
OR 
`npm install`

This command  will install all the dependencies and devtools needed for local development. 
 
### Config files
Configuration is done using [dot.env](https://parceljs.org/features/node-emulation/#.env-files) files.

These files are used to simplify the configuration of the app and should not contain sensitive information.

Copy the `.env.local-sample` to `.env` to add your configuration variables.

`cp .env.local-sample .env`

Replace `xxxxxxx` with keys and token.

### Get Data

To set the environment variables from the `.env` file, add export in front of each variable. 
For example:

`export MAP_STYLE=“xxxxxxxxxxxx”`
 
Run `update_data.js` to get the data using node 

` node update_data.js `

After updating the data remove the `export` from each line of `.env` files
### Serve 
Serve the project using 

` yarn serve` 
    OR 
` npm serve` 

This will serve in the default port `port 3000`

See the app in `http://localhost:3000/dist/`


# Interactive Emission Plumes

![image](https://github.com/US-GHG-Center/custom-interfaces/assets/3404817/896306f9-2d05-4793-b6a6-a1d829392b66)

See https://earth.gov/ghgcenter/data-catalog/emit-ch4plume-v1

