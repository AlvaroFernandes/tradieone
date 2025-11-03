import { useState } from "react";
import {
  LayoutDashboard,
  FolderKanban,
  ChevronRight,
  Briefcase,
  Users,
  User,
  UserCheck,
  Clock,
} from "lucide-react";
import logo from '@/assets/logo.png';


type page = "home" | "my-projects" | "view-project" | "jobs" | "clients" | "employees" | "contractors" | "timesheets";



const AppSidebar = () => {
 const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
 const [currentPage, setCurrentPage] = useState<page>("home");
 const [projectsExpanded, setProjectsExpanded] = useState(false);
 const [selectedProject, setSelectedProject] = useState<string | null>(null); // Placeholder for selected project state

  return (
    // sidebar container
    <aside
      className={`${
        sidebarCollapsed ? "w-20" : "w-64"
      } bg-[#1e293b] text-white flex flex-col transition-all duration-300`}
    >
      {/* logo */}
      <div className="p-6 flex items-center justify-between">
        {!sidebarCollapsed ? (
          <img
            src={logo}
            alt="TradieOne"
            className="h-8 w-auto object-contain"
          />
        ) : (
          <div className="w-8 h-8 flex items-center justify-center">
            <img src={logo} alt="TradieOne" className="h-6 object-contain" />
          </div>
        )}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="p-2 hover:bg-[#334155] rounded-lg transition-colors ml-auto"
        >
          <svg
            className={`w-5 h-5 transition-transform ${
              sidebarCollapsed ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      </div>
      {/* navigation */}
      <nav className="flex-1 px-4 overflow-y-auto">
        {/* Home */}
        <button
          onClick={() => setCurrentPage("home")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
            currentPage === "home"
              ? "bg-[#334155] text-white"
              : "text-gray-400 hover:bg-[#334155] hover:text-white"
          }`}
          title={sidebarCollapsed ? "Home" : ""}
        >
          <LayoutDashboard size={20} />
          {!sidebarCollapsed && <span>Home</span>}
        </button>
        {/* Projects with Submenu */}
        <div className="mb-1">
          <button
            onClick={() => {
              setCurrentPage("my-projects");
              if (!sidebarCollapsed) {
                setProjectsExpanded(!projectsExpanded);
              }
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              currentPage === "my-projects" || currentPage === "view-project"
                ? "bg-[#334155] text-white"
                : "text-gray-400 hover:bg-[#334155] hover:text-white"
            }`}
            title={sidebarCollapsed ? "Projects" : ""}
          >
            <FolderKanban size={20} />
            {!sidebarCollapsed && (
              <>
                <span className="flex-1 text-left">Projects</span>
                <ChevronRight
                  size={16}
                  className={`transition-transform ${
                    projectsExpanded ? "rotate-90" : ""
                  }`}
                />
              </>
            )}
          </button>
          {/* Submenu */}
          {!sidebarCollapsed && projectsExpanded && (
            <div className="ml-4 mt-1 space-y-1">
              <button
                onClick={() => setCurrentPage("my-projects")}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-colors ${
                  currentPage === "my-projects"
                    ? "bg-[#334155] text-white"
                    : "text-gray-400 hover:bg-[#334155] hover:text-white"
                }`}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
                <span>My Projects</span>
              </button>
              <button
                onClick={() => {
                  if (selectedProject) {
                    setCurrentPage("view-project");
                  } else {
                    setCurrentPage("my-projects");
                  }
                }}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-colors ${
                  currentPage === "view-project"
                    ? "bg-[#334155] text-white"
                    : "text-gray-400 hover:bg-[#334155] hover:text-white"
                }`}
                disabled={!selectedProject}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
                <span>View Project</span>
              </button>
            </div>
          )}
        </div>
        {/* Other Menu Items */}
        <button
          onClick={() => setCurrentPage("jobs")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
            currentPage === "jobs"
              ? "bg-[#334155] text-white"
              : "text-gray-400 hover:bg-[#334155] hover:text-white"
          }`}
          title={sidebarCollapsed ? "Jobs" : ""}
        >
          <Briefcase size={20} />
          {!sidebarCollapsed && <span>Jobs</span>}
        </button>

        <button
          onClick={() => setCurrentPage("clients")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
            currentPage === "clients"
              ? "bg-[#334155] text-white"
              : "text-gray-400 hover:bg-[#334155] hover:text-white"
          }`}
          title={sidebarCollapsed ? "Clients" : ""}
        >
          <Users size={20} />
          {!sidebarCollapsed && <span>Clients</span>}
        </button>

        <button
          onClick={() => setCurrentPage("employees")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
            currentPage === "employees"
              ? "bg-[#334155] text-white"
              : "text-gray-400 hover:bg-[#334155] hover:text-white"
          }`}
          title={sidebarCollapsed ? "Employees" : ""}
        >
          <User size={20} />
          {!sidebarCollapsed && <span>Employees</span>}
        </button>

        <button
          onClick={() => setCurrentPage("contractors")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
            currentPage === "contractors"
              ? "bg-[#334155] text-white"
              : "text-gray-400 hover:bg-[#334155] hover:text-white"
          }`}
          title={sidebarCollapsed ? "Contractors" : ""}
        >
          <UserCheck size={20} />
          {!sidebarCollapsed && <span>Contractors</span>}
        </button>

        <button
          onClick={() => setCurrentPage("timesheets")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
            currentPage === "timesheets"
              ? "bg-[#334155] text-white"
              : "text-gray-400 hover:bg-[#334155] hover:text-white"
          }`}
          title={sidebarCollapsed ? "Timesheets" : ""}
        >
          <Clock size={20} />
          {!sidebarCollapsed && <span>Timesheets</span>}
        </button>
      </nav>
    </aside>
  );
}

export default AppSidebar