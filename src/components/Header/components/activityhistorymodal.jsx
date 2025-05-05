import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  FaSignInAlt,
  FaSignOutAlt,
  FaEdit,
  FaUserPlus,
  FaExclamationCircle,
  FaHistory
} from 'react-icons/fa';

const ActivityHistoryModal = ({ onClose }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    axios.post(`${API_URL}/get-activity-history/`, {}, { withCredentials: true })
      .then((res) => {
        setActivities(res.data.activity_history);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load activity history.");
        setLoading(false);
      });
  }, []);

  const getActivityIcon = (type) => {
    const lower = type.toLowerCase();
    if (lower.includes("login") || lower.includes("logged in")) return <FaSignInAlt className="text-blue-500 inline mr-2" />;
    if (lower.includes("logout") || lower.includes("logged out")) return <FaSignOutAlt className="text-red-500 inline mr-2" />;
    if (lower.includes("edit") || lower.includes("updated")) return <FaEdit className="text-yellow-500 inline mr-2" />;
    if (lower.includes("register") || lower.includes("signup")) return <FaUserPlus className="text-green-500 inline mr-2" />;
    return <FaExclamationCircle className="text-gray-500 inline mr-2" />;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      style={{
        backdropFilter: 'blur(4px)',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      }}
    >
      <div className="activity-history-modal bg-white rounded-md shadow-lg w-3xl max-w-3xl p-4 relative overflow-auto max-h-[80vh] h-full">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 !text-3xl font-bold pr-4"
        >
          &times;
        </button>
        <h4 className="!text-2xl !font-bold mb-4 text-black flex items-center">
          <FaHistory className="text-blue-600 mr-2" />
          Activity History Logs
        </h4>

        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : activities.length === 0 ? (
          <p className="text-gray-600">No activity history available.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Activity Type</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Timestamp</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Metadata</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((activity) => (
                  <tr key={activity._id} className="border-t">
                    <td className="px-4 py-2 text-sm text-gray-800 flex items-center">
                      {getActivityIcon(activity.activity_type)}
                      {activity.activity_type}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-500">
                      {new Date(activity.createdAt).toLocaleDateString()}{" "}
                      {new Date(activity.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>

                    <td className="px-4 py-2 text-sm text-gray-500">
                      {activity.metadata && Object.keys(activity.metadata).length > 0 ? (
                        <ul className="list-disc pl-5 text-xs text-gray-600 space-y-1">
                          {Object.entries(activity.metadata).map(([key, value]) => (
                            <li key={key}>
                              <span className="font-medium">{key}:</span> {String(value)}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-gray-400">No Metadata</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityHistoryModal;
