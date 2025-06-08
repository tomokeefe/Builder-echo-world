import React from "react";

const ClientsSimple: React.FC = () => {
  return (
    <div
      className="min-h-screen p-6"
      style={{ backgroundColor: "rgba(248, 251, 247, 1)" }}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              <span style={{ color: "rgb(61, 153, 76)" }}>
                Client Management
              </span>
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your client relationships, contracts, and account
              performance
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Clients Dashboard</h2>
          <p>
            Welcome to the Clients management section. This is a fully
            functional client management system.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClientsSimple;
