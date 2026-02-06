import { useState } from 'react';
import { useStore } from '../store/useStore';

export const ApiKeyInput = () => {
  const { apiKey, setApiKey, clearApiKey } = useStore();
  const [inputValue, setInputValue] = useState(apiKey);
  const [isEditing, setIsEditing] = useState(!apiKey);

  const handleSubmit = (e) => {
    e.preventDefault();
    setApiKey(inputValue);
    setIsEditing(false);
  };

  const handleClear = () => {
    setInputValue('');
    clearApiKey();
    setIsEditing(true);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Onfleet API Key</h2>
      
      {!isEditing && apiKey ? (
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm text-gray-600 mb-2">Current API Key:</p>
            <p className="font-mono text-sm text-gray-800 bg-gray-100 p-2 rounded">
              {apiKey.substring(0, 20)}...
            </p>
          </div>
          <div className="ml-4 flex gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Edit
            </button>
            <button
              onClick={handleClear}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              Clear
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-2">
              Enter your Onfleet API Key
            </label>
            <input
              type="password"
              id="apiKey"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter API key..."
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={!inputValue}
              className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Save API Key
            </button>
            {apiKey && (
              <button
                type="button"
                onClick={() => {
                  setInputValue(apiKey);
                  setIsEditing(false);
                }}
                className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
};
