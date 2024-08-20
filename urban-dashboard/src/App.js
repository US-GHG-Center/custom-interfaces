import { Fragment } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import './App.css';
import CssBaseline from '@mui/material/CssBaseline';
import { ExploreTowerData } from './components/exploreData/exploreTowerData';
import { ExploreAirborneData } from './components/exploreData/exploreAirborneData';
import { DashboardContainer } from './components/dashboardContainer';

const router = createBrowserRouter([
  {
    path: "/",
    element: <DashboardContainer />,
  },
  {
    path: "/explore/tower",
    element: <ExploreTowerData />,
  },
  {
    path: "/explore/airborne",
    element: <ExploreAirborneData />,
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
