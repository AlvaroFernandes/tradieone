import DashboardLayout from '../layouts/DashboardLayout';

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="bg-white p-8 rounded-lg shadow">
          <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
          <p>Welcome to your dashboard!</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
