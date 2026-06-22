import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScadaDemo from "@/pages/ScadaDemo";
import { Toaster } from "sonner";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ScadaDemo />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" theme="dark" />
    </div>
  );
}

export default App;
