import { useTeams } from '../hooks/useOnfleet';
import { useStore } from '../store/useStore';

export const Teams = () => {
  const { apiKey } = useStore();
  const { data: teams, isLoading, isError, error } = useTeams(apiKey);

  if (!apiKey) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Teams</h2>
        <p className="text-gray-600">Please enter an API key to view teams.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Teams</h2>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Teams</h2>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Error loading teams</p>
          <p className="text-sm">{error?.message || 'An error occurred'}</p>
        </div>
      </div>
    );
  }

  // Sort teams by number of workers (descending - most workers first)
  const sortedTeams = teams ? [...teams].sort((a, b) => {
    const aWorkers = a.workers?.length || 0;
    const bWorkers = b.workers?.length || 0;
    return bWorkers - aWorkers;
  }) : [];

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Teams</h2>
      
      {sortedTeams && sortedTeams.length > 0 ? (
        <div className="space-y-4">
          {sortedTeams.map((team) => (
            <div key={team.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{team.name}</h3>
                  <p className="text-sm text-gray-600">ID: {team.id}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">
                    Workers: <span className="font-semibold">{team.workers?.length || 0}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Managers: <span className="font-semibold">{team.managers?.length || 0}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No teams found.</p>
      )}
    </div>
  );
};
