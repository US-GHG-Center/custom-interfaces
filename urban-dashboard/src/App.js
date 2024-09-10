import { Fragment } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  useRouteError,
} from "react-router-dom";

import CssBaseline from '@mui/material/CssBaseline';

import './App.css';
import { DashboardContainer } from './components/dashboardContainer';

const ErrorPage = () => {
  const error = useRouteError();

  console.error(error);

  return (
    <div>
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
}


const router = createBrowserRouter([
  {
    path: "/",
    element: <DashboardContainer />,
    errorElement: <ErrorPage />
  },
]);

function App() {
  return (
    <Fragment>
      <CssBaseline />
      <RouterProvider router={router} />
    </Fragment>
  );
}

export default App;
