import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Remove from "./pages/Remove";

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
          path="/remove"
          element={<Remove base64Image={base64Image} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
