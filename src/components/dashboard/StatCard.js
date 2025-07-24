// src/components/dashboard/StatCard.js

'use client';
import React from 'react';

const StatCard = ({ icon, title, value, buttonText, buttonIcon }) => (
    <div className="rounded-lg flex flex-col justify-between border border-neutral-300 bg-white text-card-foreground shadow-sm p-4">
        <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2 mb-3">
            {icon}
            {title}
        </h3>
        <div className="flex items-end justify-between">
            <p className="text-4xl font-bold text-gray-900">{value}</p>
            <button
                className="inline-flex items-center justify-center whitespace-nowrap text-xs font-medium h-8 rounded-md px-3 text-white transition-colors"
                // Apply the specified radial gradient for the button
                style={{
                    background: 'radial-gradient(187.72% 415.92% at 52.87% 247.14%, #3A951B 0%, #1CDAF4 100%)'
                }}
            >
                {buttonIcon}
                {buttonText}
            </button>
        </div>
    </div>
);

export default StatCard;