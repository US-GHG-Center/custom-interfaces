import { Fragment } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CssBaseline from '@mui/material/CssBaseline';
import { DashboardContainer } from './pages/dashboardContainer';
import './App.css';

const PUBLIC_URL = process.env.REACT_APP_PUBLIC_URL;

function App() {
  return (
    <Fragment>
      <CssBaseline />
      <BrowserRouter basename={PUBLIC_URL}>
        <Routes>
          <Route path="/" element={<DashboardContainer />}>
          </Route>
        </Routes>
      </BrowserRouter>
    </Fragment>
  );
}

export default App;
