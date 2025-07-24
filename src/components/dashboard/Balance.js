'use client';
import React from 'react';

const BalanceCard = () => (
    <div className="rounded-lg border bg-white text-card-foreground shadow-sm p-6 w-full max-w-sm mx-auto">
        <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm text-gray-800">Balance</h3>
        </div>

        {/* This div now wraps both the balance and the button */}
        {/* Corrected 'justify-space-between' to 'justify-between' */}
        <div className="flex items-center justify-between">
            <p className="text-3xl font-bold text-gray-900">1,554</p>

            <button
                // The 'ml-4' is removed as 'justify-between' handles the spacing
                className="inline-flex items-center justify-center whitespace-nowrap text-xs font-medium h-8 rounded-md px-3 text-white transition-colors"
                style={{
                    background: 'radial-gradient(187.72% 415.92% at 52.87% 247.14%, #3A951B 0%, #1CDAF4 100%)'
                }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="16" viewBox="0 0 10 16" fill="none" className="mr-2">
                    <path d="M8.525 5C8.37572 4.57643 8.10309 4.20722 7.7422 3.9399C7.38132 3.67258 6.94869 3.51937 6.5 3.5H3.5C2.90326 3.5 2.33097 3.73705 1.90901 4.15901C1.48705 4.58097 1.25 5.15326 1.25 5.75C1.25 6.34674 1.48705 6.91903 1.90901 7.34099C2.33097 7.76295 2.90326 8 3.5 8H6.5C7.09674 8 7.66903 8.23705 8.09099 8.65901C8.51295 9.08097 8.75 9.65326 8.75 10.25C8.75 10.8467 8.51295 11.419 8.09099 11.841C7.66903 12.2629 7.09674 12.5 6.5 12.5H3.5C3.05131 12.4806 2.61868 12.3274 2.2578 12.0601C1.89691 11.7928 1.62429 11.4236 1.475 11M5 1.25V3.5M5 12.5V14.75" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Buy Credits</span>
            </button>
        </div>
    </div>
);

export default BalanceCard;
