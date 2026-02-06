import { useTasks } from '../hooks/useOnfleet';
import { useStore } from '../store/useStore';

const STATUS_COLORS = {
  0: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Unassigned' },
  1: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Assigned' },
  2: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Active' },
  3: { bg: 'bg-green-100', text: 'text-green-800', label: 'Completed' },
};

const formatTaskDate = (timestamp) => {
  if (!timestamp) return 'N/A';
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);
  
  // If today, show time
  if (diffDays === 0) {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }
  // If within last 7 days, show day and time
  else if (diffDays < 7) {
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  }
  // Otherwise show full date
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};

export const Tasks = () => {
  const { apiKey } = useStore();
  const { data: tasks, isLoading, isError, error } = useTasks(apiKey);

  if (!apiKey) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Tasks</h2>
        <p className="text-gray-600">Please enter an API key to view tasks.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Tasks</h2>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Tasks</h2>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Error loading tasks</p>
          <p className="text-sm">{error?.message || 'An error occurred'}</p>
        </div>
      </div>
    );
  }

  const getStatusInfo = (state) => {
    return STATUS_COLORS[state] || { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Unknown' };
  };

  const groupedTasks = tasks?.reduce((acc, task) => {
    const status = getStatusInfo(task.state).label;
    if (!acc[status]) {
      acc[status] = [];
    }
    acc[status].push(task);
    return acc;
  }, {}) || {};
  
  // Sort tasks within each group by timeCreated (newest first)
  Object.keys(groupedTasks).forEach(status => {
    groupedTasks[status].sort((a, b) => (b.timeCreated || 0) - (a.timeCreated || 0));
  });

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Tasks (Last 7 Days)</h2>
      
      {tasks && tasks.length > 0 ? (
        <div className="space-y-6">
          {Object.entries(groupedTasks).map(([status, statusTasks]) => (
            <div key={status}>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">
                {status} ({statusTasks.length})
              </h3>
              <div className="space-y-3">
                {statusTasks.map((task) => {
                  const statusInfo = getStatusInfo(task.state);
                  return (
                    <div key={task.id} className={`border rounded-lg p-4 ${statusInfo.bg}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="text-lg font-semibold text-gray-800">
                              {task.shortId || task.id}
                            </h4>
                            <span className={`px-2 py-1 ${statusInfo.bg} ${statusInfo.text} text-xs font-semibold rounded-full border border-current`}>
                              {statusInfo.label}
                            </span>
                          </div>
                          
                          {task.destination?.address && (
                            <p className="text-sm text-gray-700 mb-1">
                              📍 {task.destination.address.unparsed || 
                                  `${task.destination.address.street || ''} ${task.destination.address.city || ''}`}
                            </p>
                          )}
                          
                          {task.recipient && (
                            <p className="text-sm text-gray-600">
                              👤 {task.recipient.name || 'No recipient name'}
                              {task.recipient.phone && ` • ${task.recipient.phone}`}
                            </p>
                          )}
                          
                          {task.worker && (
                            <p className="text-sm text-gray-600 mt-1">
                              👷 Assigned to: Worker ID {task.worker}
                            </p>
                          )}
                          
                          <div className="text-xs text-gray-500 mt-2">
                            Created: {formatTaskDate(task.timeCreated)}
                          </div>
                        </div>
                      </div>
                      
                      {task.notes && (
                        <div className="mt-3 pt-3 border-t">
                          <p className="text-sm text-gray-700">
                            <span className="font-semibold">Notes:</span> {task.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No tasks found in the last 7 days.</p>
      )}
    </div>
  );
};
