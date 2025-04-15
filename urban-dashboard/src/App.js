import { Fragment } from 'react';
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import { DashboardContainer } from './components/dashboardContainer';
import CssBaseline from '@mui/material/CssBaseline';

import './App.css';

function App() {
  return (
    <Fragment>
      <CssBaseline />
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <Routes>
          <Route path="/" element={<DashboardContainer />}>
          </Route>
        </Routes>
      </BrowserRouter>
    </Fragment>
  );
}

export default App;
