import { Fragment } from 'react';
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import { DashboardContainer } from './pages/dashboardContainer';
import CssBaseline from '@mui/material/CssBaseline';

import './App.css';

const BASE_PATH = process.env.REACT_APP_BASE_PATH;

function App() {
  return (
    <Fragment>
      <CssBaseline />
      <BrowserRouter basename={BASE_PATH}>
        <Routes>
          <Route path="/" element={<DashboardContainer />}>
          </Route>
        </Routes>
      </BrowserRouter>
    </Fragment>
  );
}

export default App;
