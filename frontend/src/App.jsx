import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Library from "./pages/Library";
import Watch from "./pages/Watch";
import Upload from "./pages/Upload";
import "./App.css";

export default function App() {
  return (
    <div className="app-shell">
      <div className="bg-orb bg-orb--one" />
      <div className="bg-orb bg-orb--two" />

      <Header />

      <main className="app-content">
        <Routes>
          <Route path="/" element={<Library />} />
          <Route path="/watch/:id" element={<Watch />} />
          <Route path="/upload" element={<Upload />} />
        </Routes>
      </main>
    </div>
  );
}
