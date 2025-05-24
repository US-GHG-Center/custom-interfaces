import { Fragment } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import { NistInterface } from "./pages/nistInterface";
import "./App.css";

const BASE_PATH = process.env.PUBLIC_URL;

function App() {
  return (
    <Fragment>
      <CssBaseline />
      <BrowserRouter basename={BASE_PATH}>
        <Routes>
          <Route path="/" element={<NistInterface />}></Route>
        </Routes>
      </BrowserRouter>
    </Fragment>
  );
}

export default App;
