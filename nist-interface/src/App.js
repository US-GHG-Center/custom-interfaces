import { Fragment } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CssBaseline from '@mui/material/CssBaseline';
import { DashboardContainer } from './pages/dashboardContainer';
import './App.css';

function App() {
  return (
    <Fragment>
      <CssBaseline />
      <BrowserRouter basename={"/ghgcenter/custom-interfaces/nist-interface"}>
        <Routes>
          <Route path="/" element={<DashboardContainer />}>
          </Route>
        </Routes>
      </BrowserRouter>
    </Fragment>
  );
}

export default App;
