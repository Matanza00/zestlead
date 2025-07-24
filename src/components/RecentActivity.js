import { Tag, Phone, UploadCloud, FileText, UserPlus, CreditCard } from 'lucide-react';

const activities = {
  "24th Jan 2024": [
    { text: "You bought 15 leads for $59", icon: CreditCard },
    { text: "Tagged Glenn as 'Contacted'", icon: Tag },
  ],
  "22nd Jan 2024": [
    { text: "Called Glenn", icon: Phone },
  ],
  "20th Jan 2024": [
    { text: "Credit Topped Up", icon: CreditCard },
    { text: "Upgraded to Pro Monthly", icon: UploadCloud },
    { text: "Plan paused", icon: FileText },
  ],
};

const iconMap = {
    CreditCard: <CreditCard className="w-4 h-4 text-brand-gray-text" />,
    Tag: <Tag className="w-4 h-4 text-brand-gray-text" />,
    Phone: <Phone className="w-4 h-4 text-brand-gray-text" />,
    UploadCloud: <UploadCloud className="w-4 h-4 text-brand-gray-text" />,
    FileText: <FileText className="w-4 h-4 text-brand-gray-text" />,
};

export default function RecentActivity() {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-brand-gray-DEFAULT">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-sm text-gray-800">Recent Activity</h3>
                <button className="text-xs font-medium text-brand-green-dark hover:underline">
                    view all
                </button>
            </div>
            <div className="space-y-4">
                {Object.entries(activities).map(([date, items]) => (
                    <div key={date}>
                        <p className="text-xs font-semibold text-brand-gray-text mb-2">{date}</p>
                        <ul className="space-y-3">
                            {items.map((item, index) => (
                                <li key={index} className="flex items-start space-x-3">
                                    <div className="p-1.5 bg-brand-gray-light rounded-full mt-0.5">
                                        {iconMap[item.icon.name]}
                                    </div>
                                    <p className="text-sm text-gray-700">{item.text}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
}