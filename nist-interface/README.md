# NIST Plume Viewer Interface

A React-based application for visualizing NIST

---

## Local Setup

To get NIST interface up and running on your local machine, follow these steps:

### Prerequisites

You'll need the following tools installed:

- **nvm** (Node Version Manager): For managing Node.js versions. You can find installation instructions on the [nvm GitHub page](https://github.com/nvm-sh/nvm).
- **Yarn**: A fast, reliable, and secure dependency manager. Install it by following the instructions on the [Yarn website](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable).

### Environment Variables

Create a copy of the `.env.local-sample` file and name it `.env`. Populate it with your specific environment variables:

```
REACT_APP_MAPBOX_TOKEN='xxxxxxxxxx'
REACT_APP_MAPBOX_STYLE_URL='mapbox://styles/xxxxxxxxx'
REACT_APP_FEATURES_API_URL='xxxxxxxxxx'
REACT_APP_BASEMAP_STYLES_MAPBOX_ID='xxxxxxx'
```

### Installation and Running

Once your environment variables are set, use the following commands:

1.  **Select Node.js Version**:

    ```bash
    nvm use
    ```

    This command ensures you're using the appropriate Node.js version specified for the project.

2.  **Install Dependencies**:

    ```bash
    yarn
    ```

    This will install all the necessary project dependencies.

3.  **Start Development Server**:
    ```bash
    yarn serve
    ```
    This command will launch the development server, and you can access NIST App in your browser.

---

## Bundling as a Library

You can package `custom-interface-nist` as a reusable library for distribution via the [npm registry](https://www.npmjs.com/).

### 1. Build the Library

Use the provided build command to generate the library bundle:

This will create a production-ready build in the `dist` (or equivalent) directory.

```bash
yarn build-lib
```

### 2. Prepare for Publishing

Ensure the `name` and `version` fields in your [`package.json`](https://docs.npmjs.com/cli/v10/configuring-npm/package-json) are correctly set.  
 These two fields together uniquely identify your package in the npm registry.

### 3. Authenticate with npm

If you haven't already, log in to your npm account.  
If you don’t have one, you can [sign up here](https://www.npmjs.com/signup).

```bash
npm login
```

### 4. Publish the Package

Once authenticated, publish your library to npm:

```bash
npm publish
```

**Note:**

> - Make sure your package name is unique if it's public.
> - Consider using [scoped packages](https://docs.npmjs.com/cli/v10/using-npm/scope) (e.g., `@your-org/nist-interface`) for organization or private packages.
> - For more details, see the [npm publishing guide](https://docs.npmjs.com/cli/v10/commands/npm-publish).

---

After publishing, your library can be installed in any project via:

## Usage as a Library

NIST interface can also be used as a library within other React applications.

### Installation

Install the library via npm or yarn:

```bash
npm install custom-interface-nist
# or
yarn add custom-interface-nist
```

## Usage

### Import NIST Interface:

```JavaScript
import { NistInterface } from 'custom-interface-nist';
```

### Create a Configuration Variable:

```JavaScript

const defaultConfig = {
  mapboxToken:"xxxxxxxxxxxxxx",
  mapboxStyle: "xxxxxxxxxxxxxx",
  basemapStyle: "xxxxxxxxxxxxxx",
  featuresApiUrl: "xxxxxxxxxxxxxx",
};
```

### Add some default map configuration to start with

```Javascript
const defaultZoomLevel?:number = 4;
const agency?:string = 'nist';
const dataCategory?:string;
const region?:string  = 'nec'
const ghg?:string = 'co2'
const stationCode?:string = 'buc';
```

### Use the CloudBrowse Component:

```JavaScript
  <NistInterface 
    config={defaultConfig}
    agency={agency}
    stationCode={stationCode}
    ghg={ghg}
    region={region}
    dataCategory={dataCategory}
    defaultZoomLevel={defaultZoomLevel} />
```

#### Note: Configuration settings can also be provided directly in the host React application's .env file. For example:

```
REACT_APP_MAPBOX_TOKEN='xxxxxxxxxx'
REACT_APP_MAPBOX_STYLE_URL='mapbox://styles/xxxxxxxxx'
REACT_APP_FEATURES_API_URL='xxxxxxxxxx'
REACT_APP_BASEMAP_STYLES_MAPBOX_ID='xxxxxxx'
```

## Peer Dependencies

This component has the following peer dependencies that you will need to install in your host application:

```JSON
"peerDependencies": {
    "react": "^18.2.0 || ^19.0.0",
    "react-dom": "^18.2.0 || ^19.0.0",
    "@mui/material": "^5.14.2 || ^6.0.0 || ^7.0.0"
}
```

Make sure these versions (or compatible ones) are installed in your project to avoid issues.
