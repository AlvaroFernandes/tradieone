import { useParams } from 'react-router-dom';

const ProjectPage = () => {
  const { projectId } = useParams();

  return (
    <div className="p-6">
      <div className="bg-white p-8 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4">Project Details</h1>
        <p>Viewing project: {projectId || 'No project selected'}</p>
      </div>
    </div>
  );
};

export default ProjectPage;