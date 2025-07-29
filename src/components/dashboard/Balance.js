'use client';
import React from 'react';

// Custom SVG icon for 'Balance', updated to use the theme gradient.
const BalanceIcon = (props) => {
    // A unique ID for the gradient definition.
    const uniqueId = 'balance-icon-gradient';

    // Transform ensures the gradient's appearance is consistent with other icons.
    const gradientTransform = "translate(22.4957 35.4552) rotate(-105.581) scale(39.6972 35.3611)";

    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <defs>
                <radialGradient
                    id={uniqueId}
                    gradientUnits="userSpaceOnUse"
                    gradientTransform={gradientTransform}
                >
                    {/* These CSS variables can be pulled from a global stylesheet for theme consistency */}
                    <stop stopColor="var(--icon-gradient-start, #26D0CE)" />
                    <stop offset="1" stopColor="var(--icon-gradient-end, #34D399)" />
                </radialGradient>
            </defs>
            {/* The <g> tag applies the gradient stroke to all nested paths */}
            <g stroke={`url(#${uniqueId})`} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 7H5C3.89543 7 3 7.89543 3 9V18C3 19.1046 3.89543 20 5 20H19C20.1046 20 21 19.1046 21 18V9C21 7.89543 20.1046 7 19 7Z"/>
                <path d="M16 7V5C16 4.46957 15.7893 3.96086 15.4142 3.58579C15.0391 3.21071 14.5304 3 14 3H8C7.46957 3 6.96086 3.21071 6.58579 3.58579C6.21071 3.96086 6 4.46957 6 5V7"/>
            </g>
        </svg>
    );
};

// Custom SVG icon for the 'Buy Credits' button, as seen in the image.
const BuyCreditsIcon = (props) => (
     <svg xmlns="http://www.w3.org/2000/svg" width="10" height="16" viewBox="0 0 10 16" fill="none" {...props}>
        <path d="M8.525 5C8.37572 4.57643 8.10309 4.20722 7.7422 3.9399C7.38132 3.67258 6.94869 3.51937 6.5 3.5H3.5C2.90326 3.5 2.33097 3.73705 1.90901 4.15901C1.48705 4.58097 1.25 5.15326 1.25 5.75C1.25 6.34674 1.48705 6.91903 1.90901 7.34099C2.33097 7.76295 2.90326 8 3.5 8H6.5C7.09674 8 7.66903 8.23705 8.09099 8.65901C8.51295 9.08097 8.75 9.65326 8.75 10.25C8.75 10.8467 8.51295 11.419 8.09099 11.841C7.66903 12.2629 7.09674 12.5 6.5 12.5H3.5C3.05131 12.4806 2.61868 12.3274 2.2578 12.0601C1.89691 11.7928 1.62429 11.4236 1.475 11M5 1.25V3.5M5 12.5V14.75" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);


const BalanceCard = () => (
    <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-4 shadow-sm ">
        <div className="flex items-center gap-2 mb-2">
            <BalanceIcon />
            <h3 className="text-2xl font-semibold text-neutral">Balance</h3>
        </div>

        <div className="flex items-center justify-between mt-4">
             <p className="text-3xl font-bold text-gray-800 tracking-tighter">
                $1,554
            </p>

            <button
                className="inline-flex items-center justify-center whitespace-nowrap text-s font-semibold rounded-lg px-3 py-1 text-white transition-all duration-300 shadow-md hover:shadow-lg"
                style={{
                    background: 'linear-gradient(to right, #26D0CE, #34D399)'
                }}
            >
                <BuyCreditsIcon className="mr-2" />
                <span>Buy Credits</span>
            </button>
        </div>
    </div>
);

export default BalanceCard;
