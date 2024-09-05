import { Fragment } from 'react';
import {
  createHashRouter,
  RouterProvider,
} from "react-router-dom";

import './App.css';
import CssBaseline from '@mui/material/CssBaseline';
import { DashboardContainer } from './components/dashboardContainer';

const router = createHashRouter([
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
