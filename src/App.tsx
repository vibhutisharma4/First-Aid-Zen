import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CPRPage from "./pages/CPRPage";
import BleedingPage from "./pages/BleedingPage";
import BurnsPage from "./pages/BurnsPage";
import FracturesPage from "./pages/FracturesPage";
import HeartStrokePage from "./pages/HeartStrokePage";
import PoisoningPage from "./pages/PoisoningPage";
import ChokingPage from "./pages/ChokingPage";
import SeizuresPage from "./pages/SeizuresPage";
import CrisisPage from "./pages/CrisisPage";
import NotFound from "./pages/NotFound";
import TriagePage from "./pages/TriagePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cpr" element={<CPRPage />} />
        <Route path="/bleeding" element={<BleedingPage />} />
        <Route path="/burns" element={<BurnsPage />} />
        <Route path="/fractures" element={<FracturesPage />} />
        <Route path="/heart-stroke" element={<HeartStrokePage />} />
        <Route path="/poisoning" element={<PoisoningPage />} />
        <Route path="/choking" element={<ChokingPage />} />
        <Route path="/seizures" element={<SeizuresPage />} />
        <Route path="/crisis" element={<CrisisPage />} />
        <Route path="/triage" element={<TriagePage />} />  {/* ✅ moved above * */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;