

export type ProjectItem = {
  id: number;
  name: string;
  client: string;
  status: string;
  startDate: string;
  endDate: string;
  location: string;
  teamSize: number;
  jobsCount: number;
};

export function ProjectsPage({ onViewProject }: { onViewProject?: (project: ProjectItem) => void }) {
  const sampleProject: ProjectItem = {
    id: 1,
    name: "Sample Project",
    client: "Sample Client",
    status: "Planned",
    startDate: "2025-01-01",
    endDate: "2025-06-30",
    location: "Remote",
    teamSize: 4,
    jobsCount: 2,
  };

  return (
    <div className="space-y-6">
      {/* Projects page placeholder. Accepts optional onViewProject(project) callback. */}
      {onViewProject && (
        <button
          type="button"
          className="px-3 py-1 rounded bg-blue-600 text-white"
          onClick={() => onViewProject(sampleProject)}
        >
          View sample project
        </button>
      )}
    </div>
  );
}
