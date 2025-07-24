import { DollarSign } from 'lucide-react';

export default function BalanceCard() {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-brand-gray-DEFAULT">
            <h3 className="font-semibold text-sm text-gray-800 mb-2">Balance</h3>
            <p className="text-3xl font-bold text-gray-800 mb-4">$1,554</p>
            <button className="w-full bg-brand-green text-white font-semibold py-2 rounded-lg hover:bg-brand-green-dark flex items-center justify-center">
                <DollarSign className="w-4 h-4 mr-2" />
                Buy Credits
            </button>
        </div>
    );
}