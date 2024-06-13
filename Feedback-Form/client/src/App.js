import React from "react";
import { Routes, BrowserRouter, Route } from "react-router-dom";
import Home from "./componen/home"


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}