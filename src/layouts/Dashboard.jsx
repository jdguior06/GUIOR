import { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const Dashboard = ({ selectedSucursal }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme } = useTheme(); 

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{
        backgroundColor: theme.backgroundColor, 
        fontFamily: theme.fontFamily, 
      }}
    >
      <Navbar toggleSidebar={toggleSidebar} />
      <div className="flex flex-1">
        <Sidebar
          isOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
          selectedSucursal={selectedSucursal}
        />
        <main className="flex-1 p-4 overflow-y-auto">
          <Outlet /> 
        </main>
      </div>
    </div>
  );
};

export default Dashboard;


