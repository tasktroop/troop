import React, { useState, useEffect } from 'react';
import { Users, CheckSquare, MessageSquare, DollarSign, Plus, Calendar as CalendarIcon, BarChart2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Dashboard: React.FC = () => {
const [leads, setLeads] = useState([]);
const [loading, setLoading] = useState(true);
const [showAddLeadModal, setShowAddLeadModal] = useState(false);

// 🔥 API CALL
useEffect(() => {
fetch(`${import.meta.env.VITE_API_URL}/leads`)
.then(res => res.json())
.then(data => {
setLeads(data);
setLoading(false);
})
.catch(err => {
console.error("API ERROR:", err);
setLoading(false);
});
}, []);

// Dynamic stats
const stats = [
{ name: 'Total Leads', value: leads.length, icon: Users },
{ name: 'Open Approvals', value: '12', icon: CheckSquare },
{ name: 'Posts This Week', value: '8', icon: MessageSquare },
{ name: 'MRR', value: '$12,450', icon: DollarSign },
];

if (loading) {
return <div className="text-center mt-10 text-white">Loading...</div>;
}

return ( <div className="space-y-6 max-w-7xl mx-auto"> <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Dashboard Overview</h1>

```
  {/* Stats */}
  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
    {stats.map((item) => {
      const Icon = item.icon;
      return (
        <div key={item.name} className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow">
          <Icon className="h-6 w-6 text-blue-500 mb-2" />
          <p className="text-sm text-gray-500">{item.name}</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">{item.value}</p>
        </div>
      );
    })}
  </div>

  {/* Quick Actions */}
  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex gap-3">
    <button onClick={() => setShowAddLeadModal(true)} className="px-4 py-2 bg-blue-600 text-white rounded">
      Add Lead
    </button>
    <Link to="/social" className="px-4 py-2 bg-purple-600 text-white rounded">
      Schedule Post
    </Link>
    <Link to="/analytics" className="px-4 py-2 bg-gray-600 text-white rounded">
      Analytics
    </Link>
  </div>

  {/* Leads Table */}
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
    <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Recent Leads</h3>

    <table className="w-full text-sm">
      <thead>
        <tr className="text-left text-gray-500">
          <th>Name</th>
          <th>Stage</th>
          <th>Source</th>
          <th>Created</th>
        </tr>
      </thead>

      <tbody>
        {leads.map((lead: any) => (
          <tr key={lead.id} className="border-t">
            <td>{lead.name}</td>
            <td>{lead.stage}</td>
            <td>{lead.source}</td>
            <td>{lead.created}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  {/* Modal */}
  {showAddLeadModal && (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-5 rounded-lg w-96">
        <h3 className="text-lg font-bold mb-4">Add Lead</h3>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            toast.success("Lead Added");
            setShowAddLeadModal(false);
          }}
        >
          <input placeholder="Name" className="w-full mb-2 p-2 border rounded" required />
          <input placeholder="Email" className="w-full mb-2 p-2 border rounded" required />
          <button className="w-full bg-blue-600 text-white py-2 rounded">
            Save
          </button>
        </form>
      </div>
    </div>
  )}
</div>
```

);
};

export default Dashboard;
