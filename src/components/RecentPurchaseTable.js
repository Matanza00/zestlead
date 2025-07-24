import { Phone, Edit, Info } from 'lucide-react';

const leadsData = [
  { name: 'John Smith', phone: '+1(405)234 3452', property: 'Street 16, Sunset Boulevard', status: 'Not Contacted', statusColor: 'red' },
  { name: 'Jane Doe', phone: '+1(312)456 7890', property: 'Avenue 21, Maple Street', status: 'Contacted', statusColor: 'green' },
  { name: 'Emily Carter', phone: '+1(415)789 1234', property: '123 Elm Street, Oakwood', status: 'Reached Out', statusColor: 'blue' },
  { name: 'Sophia Bennett', phone: '+1(408)555 9876', property: '456 Maple Avenue, Greenfield', status: 'Contacted', statusColor: 'green' },
  { name: 'Sophia Johnson', phone: '+1(408)555 1234', property: '789 Oak Street, Maplewood', status: 'Reached Out', statusColor: 'blue' },
  { name: 'Jake Bennett', phone: '+1(408)555 9876', property: '456 Maple Avenue, Greenfield', status: 'Contacted', statusColor: 'green' },
];

const statusStyles = {
    red: 'bg-red-100 text-red-800',
    green: 'bg-green-100 text-green-800',
    blue: 'bg-blue-100 text-blue-800',
}

export default function RecentPurchasesTable() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-brand-gray-DEFAULT">
      <div className="p-4 border-b">
        <h3 className="font-semibold text-gray-800">Recently Purchased Leads</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-gray-50 text-left text-xs text-brand-gray-text uppercase">
              <th className="p-3 font-medium">Name</th>
              <th className="p-3 font-medium">Phone</th>
              <th className="p-3 font-medium">Property</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leadsData.map((lead, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium text-gray-800">{lead.name}</td>
                <td className="p-3 text-brand-gray-text">{lead.phone}</td>
                <td className="p-3 text-brand-gray-text">{lead.property}</td>
                <td className="p-3">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusStyles[lead.statusColor]}`}>
                    {lead.status}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex items-center justify-center space-x-2">
                    <button className="p-1.5 hover:bg-green-100 rounded-full text-brand-green-dark">
                      <Phone size={16} />
                    </button>
                    <button className="p-1.5 hover:bg-blue-100 rounded-full text-blue-600">
                      <Edit size={16} />
                    </button>
                    <button className="p-1.5 hover:bg-red-100 rounded-full text-red-600">
                      <Info size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}