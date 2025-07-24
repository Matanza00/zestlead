import { Rocket } from 'lucide-react';

export default function SubscriptionCard() {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-brand-gray-DEFAULT">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-sm text-gray-800">Subscription</h3>
                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-800">
                    Active
                </span>
            </div>
            <div className="space-y-4">
                <div className="flex items-center space-x-2">
                    <Rocket className="w-5 h-5 text-purple-600" />
                    <p className="font-medium text-purple-600">Ultimate Agent</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-xs text-brand-gray-text">Leads Purchased</p>
                        <p className="font-semibold text-sm text-gray-800">10 <span className="text-brand-gray-text font-normal">out of 10</span></p>
                    </div>
                    <div>
                        <p className="text-xs text-brand-gray-text">Days Left</p>
                        <p className="font-semibold text-sm text-gray-800">12</p>
                    </div>
                </div>
            </div>
        </div>
    );
}