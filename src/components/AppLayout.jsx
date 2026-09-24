import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function AppLayout() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-shell__main">
        <Outlet />
      </main>
    </div>
  );
}
