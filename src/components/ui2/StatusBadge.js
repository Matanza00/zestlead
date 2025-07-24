'use client';
import React from 'react';

const StatusBadge = ({ status }) => {
    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'Not Contacted':
                return 'bg-red-100 text-red-700 border-red-200';
            case 'Contacted':
                return 'bg-green-100 text-green-700 border-green-200';
            case 'Reached Out':
                return 'bg-gray-100 text-gray-700 border-gray-200';
            default:
                return 'bg-secondary text-secondary-foreground';
        }
    };

    return (
        <div className={inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold }>
            {status}
        </div>
    );
};

export default StatusBadge;
