import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "../App";
import CandidateScan from "../pages/CandidateScan";
import CandidateReport from "../pages/CandidateReport";
import Dashboard from "../pages/Dashboard";

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/scan" element={<CandidateScan />} />
                <Route path="/candidate/:id" element={<CandidateReport />} />
                <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
        </BrowserRouter>
    );
}
