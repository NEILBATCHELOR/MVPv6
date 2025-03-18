import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";

const MainLayout = () => {
  const location = useLocation();
  console.log("Rendering MainLayout, Current Path:", location.pathname);

  return (
    <div className="flex h-screen w-full bg-gray-50">
      {/* Prevent Sidebar duplication */}
      {location.pathname !== "/login" && <Sidebar />}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
