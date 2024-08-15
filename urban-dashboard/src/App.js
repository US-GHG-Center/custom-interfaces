import { Fragment } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import './App.css';
import CssBaseline from '@mui/material/CssBaseline';
import { Dashboard } from './components/dashboard';
import { ExploreTowerData } from './components/exploreData/exploreTowerData';
import { ExploreAirborneData } from './components/exploreData/exploreAirborneData';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
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
