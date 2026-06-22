import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/pages/Layout";
import OverviewPage from "@/pages/OverviewPage";
import { KazanPage, DegazorPage, IsgPage, HidroforPage, FiltrePage } from "@/pages/SlidePages";
import { Toaster } from "sonner";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<OverviewPage />} />
            <Route path="/kazan" element={<KazanPage />} />
            <Route path="/degazor" element={<DegazorPage />} />
            <Route path="/isg" element={<IsgPage />} />
            <Route path="/hidrofor" element={<HidroforPage />} />
            <Route path="/filtreleme" element={<FiltrePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" />
    </div>
  );
}

export default App;
