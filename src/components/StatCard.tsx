import { ShoppingCart } from "lucide-react";
import { ReactNode } from "react";

type StatCardProps = {
  title: string;
  value: number | string;
  icon: ReactNode;
  buttonText: string;
};

export default function StatCard({ title, value, icon, buttonText }: StatCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-brand-gray-DEFAULT flex flex-col justify-between">
      <div className="flex items-center space-x-3">
        <div className="bg-brand-green-light p-2 rounded-full">
            {icon}
        </div>
        <h3 className="text-sm font-medium text-brand-gray-text">{title}</h3>
      </div>
      <div className="mt-4 flex items-end justify-between">
        <p className="text-4xl font-bold text-gray-800">{value}</p>
        <button className="flex items-center bg-brand-green-light text-brand-green-dark text-xs font-semibold px-3 py-1.5 rounded-md hover:bg-green-200">
          <ShoppingCart className="w-3.5 h-3.5 mr-1.5" />
          {buttonText}
        </button>
      </div>
    </div>
  );
}