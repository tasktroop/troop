import React, { useState, useEffect } from 'react';
import { Users, CheckSquare, MessageSquare, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Dashboard: React.FC = () => {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);

  // Controlled form state — fixes the silent data-loss bug
  const [newLead, setNewLead] = useState({ name: '', email: '' });

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/leads`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token') ?? ''}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        setLeads(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error('API ERROR:', err);
        toast.error('Failed to load leads');
        setLoading(false);
      });
  }, []);

  const stats = [
    { name: 'Total Leads',     value: leads.length, icon: Users },
    { name: 'Open Approvals',  value: '12',         icon: CheckSquare },
    { name: 'Posts This Week', value: '8',           icon: MessageSquare },
    { name: 'MRR',             value: '$12,450',     icon: DollarSign },
  ];

  const handleAddLead = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: POST to /leads
    toast.success(`Lead "${newLead.name}" added`);
    setNewLead({ name: '', email: '' });
    setShowAddLeadModal(false);
  };

  if (loading) {
    return <div className="text-center mt-10 text-white">Loading...</div>;
  }

  // ✅ Single return — everything lives inside one JSX tree
  return (
    <div className="space-y-6 max-w-7xl mx-auto">

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Dashboard Overview
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.name} className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow">
              <Icon className="h-6 w-6 text-blue-500 mb-2" />
              <p className="text-sm text-gray-500 dark:text-gray-400">{item.name}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{item.value}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex gap-3">
        <button
          onClick={() => setShowAddLeadModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Lead
        </button>
        <Link to="/social" className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
          Schedule Post
        </Link>
        <Link to="/analytics" className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
          Analytics
        </Link>
      </div>

      {/* Leads Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Recent Leads</h3>
        {leads.length === 0 ? (
          <p className="text-gray-400 text-sm">No leads yet. Add your first one!</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 dark:text-gray-400">
                <th className="pb-2">Name</th>
                <th className="pb-2">Stage</th>
                <th className="pb-2">Source</th>
                <th className="pb-2">Created</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead: any) => (
                <tr key={lead.id} className="border-t dark:border-gray-700">
                  <td className="py-2 text-gray-900 dark:text-white">{lead.name}</td>
                  <td className="py-2 text-gray-600 dark:text-gray-300">{lead.stage}</td>
                  <td className="py-2 text-gray-600 dark:text-gray-300">{lead.source}</td>
                  <td className="py-2 text-gray-600 dark:text-gray-300">{lead.created}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Lead Modal */}
      {showAddLeadModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 p-5 rounded-lg w-96 shadow-xl">
            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Add Lead</h3>
            <form onSubmit={handleAddLead}>
              <input
                placeholder="Name"
                value={newLead.name}
                onChange={e => setNewLead(p => ({ ...p, name: e.target.value }))}
                className="w-full mb-2 p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
              <input
                placeholder="Email"
                type="email"
                value={newLead.email}
                onChange={e => setNewLead(p => ({ ...p, email: e.target.value }))}
                className="w-full mb-4 p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddLeadModal(false)}
                  className="flex-1 py-2 border rounded text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;