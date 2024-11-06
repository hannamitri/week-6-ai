import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Upload from "./pages/Upload";

function App() {
  const [base64Image, setBase64Image] = useState(null);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Home setBase64Image={setBase64Image} />}
        />
        <Route
          path="/upload"
          element={<Upload base64Image={base64Image} setBase64Image={setBase64Image} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
