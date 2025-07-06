
import React from 'react';
import { Search, Plus, Minus } from 'lucide-react';



const StepSelectLeads = ({
  searchQuery,
  setSearchQuery,
  availableEmployees,
  addedLeads,
  handleAddLead,
  handleRemoveLead,
}) => {
  const filteredEmployees = availableEmployees.filter((employee) =>
    employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Search and select approval leads</h3>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
        <input
          type="text"
          placeholder="Search for any employee"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm outline-none"
        />
      </div>

      <div className="flex gap-6">
        {/* Available Employees */}
        <div className="flex-1 border border-gray-300 rounded bg-gray-50 h-96 overflow-y-auto">
          {filteredEmployees.map((employee, index) => (
            <div
              key={employee.id}
              className={`flex items-center justify-between px-4 py-3 border-b border-gray-200 last:border-b-0`}
            >
              <div>
                <div className="font-medium text-sm">{employee.name}</div>
                <div className="text-xs text-gray-500">{employee.role}</div>
              </div>
              <button
                onClick={() => handleAddLead(employee)}
                className="w-8 h-8 rounded-full border border-blue-600 text-blue-600 hover:bg-blue-50 flex items-center justify-center"
              >
                <Plus size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* Added Leads */}
        <div className="flex-1">
          <div className="flex items-center mb-3">
            <span className="text-sm font-medium mr-2">Added Leads</span>
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
              {addedLeads.length}
            </span>
          </div>

          <div className="border border-gray-300 rounded bg-gray-50">
            {addedLeads.map((lead, index) => (
              <div
                key={lead.id}
                className={`flex items-center justify-between px-4 py-3 border-b border-gray-200 last:border-b-0`}
              >
                <div>
                  <div className="font-medium text-sm">{lead.name}</div>
                  <div className="text-xs text-gray-500">{lead.role}</div>
                </div>
                <button
                  onClick={() => handleRemoveLead(lead.id)}
                  className="w-8 h-8 rounded-full border border-red-600 text-red-600 hover:bg-red-50 flex items-center justify-center"
                >
                  <Minus size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepSelectLeads;
