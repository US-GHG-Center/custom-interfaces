import { Fragment } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import './App.css';
import CssBaseline from '@mui/material/CssBaseline';
import { DashboardContainer } from './components/dashboardContainer';

const router = createBrowserRouter([
  {
    path: "/",
    element: <DashboardContainer />,
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
