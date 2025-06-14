import { Fragment } from 'react';
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import CssBaseline from '@mui/material/CssBaseline';

import './App.css';
import { UrbanDashboard } from './components/urbanDashboard';

function App() {
  return (
    <Fragment>
      <CssBaseline />
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <Routes>
          <Route path="/" element={<UrbanDashboard />}>
          </Route>
        </Routes>
      </BrowserRouter>
    </Fragment>
  );
}

export default App;
