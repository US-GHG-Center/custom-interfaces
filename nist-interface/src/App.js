import { Fragment } from 'react';
import {
  // #createBrowserRouter,
  createHashRouter,
  RouterProvider,
} from "react-router-dom";

import './App.css';
import CssBaseline from '@mui/material/CssBaseline';
import { Dashboard } from './pages/dashboard';
import { DashboardContainer } from './pages/dashboardContainer';

const router = createHashRouter([
  {
    path: "/",
    element: <DashboardContainer />,
  }
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
