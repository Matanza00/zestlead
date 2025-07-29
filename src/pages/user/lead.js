'use client';
import React, { useState } from 'react';

// --- SVG ICONS (Embedded for simplicity) ---




// --- NEW ICONS FOR BOTTOM BAR ---
const DeselectAllIcon = (props) => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M5.75 8H10.25M1.25 8C1.25 8.88642 1.42459 9.76417 1.76381 10.5831C2.10303 11.4021 2.60023 12.1462 3.22703 12.773C3.85382 13.3998 4.59794 13.897 5.41689 14.2362C6.23583 14.5754 7.11358 14.75 8 14.75C8.88642 14.75 9.76417 14.5754 10.5831 14.2362C11.4021 13.897 12.1462 13.3998 12.773 12.773C13.3998 12.1462 13.897 11.4021 14.2362 10.5831C14.5754 9.76417 14.75 8.88642 14.75 8C14.75 7.11358 14.5754 6.23583 14.2362 5.41689C13.897 4.59794 13.3998 3.85382 12.773 3.22703C12.1462 2.60023 11.4021 2.10303 10.5831 1.76381C9.76417 1.42459 8.88642 1.25 8 1.25C7.11358 1.25 6.23583 1.42459 5.41689 1.76381C4.59794 2.10303 3.85382 2.60023 3.22703 3.22703C2.60023 3.85382 2.10303 4.59794 1.76381 5.41689C1.42459 6.23583 1.25 7.11358 1.25 8Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const AddToCartIcon = (props) => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M3 14.25C3 14.6478 3.15804 15.0294 3.43934 15.3107C3.72064 15.592 4.10218 15.75 4.5 15.75C4.89782 15.75 5.27936 15.592 5.56066 15.3107C5.84196 15.0294 6 14.6478 6 14.25C6 13.8522 5.84196 13.4706 5.56066 13.1893C5.27936 12.908 4.89782 12.75 4.5 12.75C4.10218 12.75 3.72064 12.908 3.43934 13.1893C3.15804 13.4706 3 13.8522 3 14.25Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9.375 12.75H4.5V2.25H3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M4.5 3.75L15 4.5L14.355 9.01275M12.375 9.75H4.5M12 14.25H16.5M14.25 12V16.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);



const ShoppingBagIcon = (props) => (
<svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 34 34" fill="none">
<path d="M8.96893 11.3333H25.0325C25.441 11.3333 25.8447 11.4216 26.2159 11.5922C26.5871 11.7627 26.9171 12.0116 27.1831 12.3216C27.4491 12.6316 27.645 12.9955 27.7572 13.3883C27.8694 13.7811 27.8954 14.1936 27.8333 14.5973L26.0553 26.146C25.901 27.1496 25.3924 28.0648 24.6217 28.7259C23.8509 29.387 22.8689 29.7503 21.8535 29.75H12.1465C11.1313 29.7499 10.1497 29.3865 9.37923 28.7255C8.60878 28.0644 8.1004 27.1494 7.94609 26.146L6.16818 14.5973C6.10608 14.1936 6.13203 13.7811 6.24426 13.3883C6.35648 12.9955 6.55232 12.6316 6.81835 12.3216C7.08438 12.0116 7.4143 11.7627 7.7855 11.5922C8.1567 11.4216 8.56041 11.3333 8.96893 11.3333Z" stroke="#285B19" stroke-width="2.83333" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M12.75 15.5833V8.5C12.75 7.37283 13.1978 6.29183 13.9948 5.4948C14.7918 4.69777 15.8728 4.25 17 4.25C18.1272 4.25 19.2082 4.69777 20.0052 5.4948C20.8022 6.29183 21.25 7.37283 21.25 8.5V15.5833" stroke="#285B19" stroke-width="2.83333" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
);

// --- NEW ICON for empty checkbox ---
// Replace the existing CheckmarkIcon with this new one
const CheckmarkIcon = (props) => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M15.2773 1.66666C16.9107 1.66666 18.244 2.94749 18.329 4.55999L18.3332 4.72249V15.2775C18.3332 16.9108 17.0523 18.2442 15.4398 18.3292L15.2773 18.3333H4.72234C3.93998 18.3334 3.18741 18.0333 2.61967 17.4951C2.05193 16.9568 1.71227 16.2212 1.67067 15.44L1.6665 15.2775V4.72249C1.6665 3.08916 2.94734 1.75582 4.55984 1.67082L4.72234 1.66666H15.2773ZM13.089 7.74416C12.9327 7.58793 12.7208 7.50017 12.4998 7.50017C12.2789 7.50017 12.0669 7.58793 11.9107 7.74416L9.1665 10.4875L8.089 9.41082L8.01067 9.34166C7.84318 9.21215 7.63267 9.15125 7.4219 9.17132C7.21113 9.1914 7.01591 9.29095 6.87588 9.44976C6.73585 9.60856 6.66152 9.81471 6.66798 10.0263C6.67444 10.238 6.76121 10.4392 6.91067 10.5892L8.57734 12.2558L8.65567 12.325C8.81601 12.4494 9.01622 12.511 9.21874 12.4982C9.42126 12.4855 9.61218 12.3993 9.75567 12.2558L13.089 8.92249L13.1582 8.84416C13.2825 8.68382 13.3441 8.48361 13.3314 8.28109C13.3187 8.07857 13.2325 7.88765 13.089 7.74416Z" fill="#2E7219"/>
    </svg>
);

// Replace the existing EmptyCheckboxIcon with this new one
const EmptyCheckboxIcon = (props) => (
<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
<path d="M2.5 4.16667C2.5 3.72464 2.67559 3.30072 2.98816 2.98816C3.30072 2.67559 3.72464 2.5 4.16667 2.5H15.8333C16.2754 2.5 16.6993 2.67559 17.0118 2.98816C17.3244 3.30072 17.5 3.72464 17.5 4.16667V15.8333C17.5 16.2754 17.3244 16.6993 17.0118 17.0118C16.6993 17.3244 16.2754 17.5 15.8333 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V4.16667Z" stroke="#6A7282" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M7.5 10L9.16667 11.6667L12.5 8.33334" stroke="#6A7282" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
);

const MenuIcon = (props) => (
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><line x1="8" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="8" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="8" y1="18" x2="21" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="3" y1="6" x2="3.01" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="3" y1="12" x2="3.01" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="3" y1="18" x2="3.01" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
);

const FilterIcon = (props) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M4 6H12M2 3H14M6 9H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ChevronDownIcon = (props) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const LeafIcon = (props) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM17 13H13V17H11V13H7V11H11V7H13V11H17V13Z" fill="#34D399"/>
    </svg>
);

const BalanceIcon = (props) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <g stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 7H5C3.89543 7 3 7.89543 3 9V18C3 19.1046 3.89543 20 5 20H19C20.1046 20 21 19.1046 21 18V9C21 7.89543 20.1046 7 19 7Z"/>
            <path d="M16 7V5C16 4.46957 15.7893 3.96086 15.4142 3.58579C15.0391 3.21071 14.5304 3 14 3H8C7.46957 3 6.96086 3.21071 6.58579 3.58579C6.21071 3.96086 6 4.46957 6 5V7"/>
        </g>
    </svg>
);

const BuyCreditsIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="16" viewBox="0 0 12 16" fill="none" {...props}>
        <defs>
            <linearGradient id="buy-credits-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="var(--card-gradient-start)" />
                <stop offset="100%" stopColor="var(--card-gradient-end)" />
            </linearGradient>
        </defs>
        <path d="M9.525 5C9.37572 4.57643 9.10309 4.20722 8.7422 3.9399C8.38132 3.67258 7.94869 3.51937 7.5 3.5H4.5C3.90326 3.5 3.33097 3.73705 2.90901 4.15901C2.48705 4.58097 2.25 5.15326 2.25 5.75C2.25 6.34674 2.48705 6.91903 2.90901 7.34099C3.33097 7.76295 3.90326 8 4.5 8H7.5C8.09674 8 8.66903 8.23705 9.09099 8.65901C9.51295 9.08097 9.75 9.65326 9.75 10.25C9.75 10.8467 9.51295 11.419 9.09099 11.841C8.66903 12.2629 8.09674 12.5 7.5 12.5H4.5C4.05131 12.4806 3.61868 12.3274 3.2578 12.0601C2.89691 11.7928 2.62429 11.4236 2.475 11M6 1.25V3.5M6 12.5V14.75" stroke="url(#buy-credits-grad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const SubscriptionIcon = (props) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M14 2V8H20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const FlameIcon = (props) => ( <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}> <path d="M12 2C9.25 2 7 4.25 7 7C7 9.31 8.42 11.26 10.33 12.24C10.5 13.91 9.94 15.5 8.5 16.5C6.5 18 5 20 5 22H19C19 20 17.5 18 15.5 16.5C14.06 15.5 13.5 13.91 13.67 12.24C15.58 11.26 17 9.31 17 7C17 4.25 14.75 2 12 2Z" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="#FBBF24"/> </svg> );
const LockIcon = (props) => ( <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}> <rect x="5" y="11" width="14" height="10" rx="2" stroke="white" strokeWidth="2"/> <path d="M7 11V7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7V11" stroke="white" strokeWidth="2" strokeLinecap="round"/> </svg> );
const ChevronLeftIcon = (props) => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>);
const ChevronRightIcon = (props) => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>);
const EyeIcon = (props) => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>);
const PhoneIcon = (props) => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>);
const SearchIcon = (props) => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>);
const GridIcon = (props) => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path d="M10 3H3V10H10V3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M21 3H14V10H21V3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M21 14H14V21H21V14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M10 14H3V21H10V14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>);
const ListIcon = (props) => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><line x1="8" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="8" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="8" y1="18" x2="21" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="3" y1="6" x2="3.01" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="3" y1="12" x2="3.01" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="3" y1="18" x2="3.01" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>);


// --- SIDEBAR SUB-COMPONENTS ---

const BalanceCard = () => (
    <div className="w-full rounded-2xl p-4 text-white shadow-sm bg-buy-now-gradient">
        <div className="flex items-center gap-3">
            <BalanceIcon className="h-6 w-6" />
            <h3 className="text-2xl font-semibold leading-none">Balance</h3>
        </div>
        <div className="flex items-end justify-between mt-2">
            <p className="text-[32px] font-bold leading-none">$1,554</p>
            <button className="inline-flex items-center justify-center whitespace-nowrap text-base h-9 rounded-lg px-4 bg-white transition-all duration-300 shadow-sm hover:shadow-md">
                <BuyCreditsIcon className="mr-2 h-4 w-auto"/>
                <span className="font-semibold leading-none bg-clip-text text-primary bg-white">
                    Buy Credits
                </span>
            </button>
        </div>
    </div>
);
const SignpostIcon = (props) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M13 4V2H11V4H4V8H11V22H13V8H20V4H13Z" fill="currentColor"/>
    </svg>
);

const RemainingLeadsCard = () => (
    <div className="w-full rounded-lg bg-[#16B8D3] p-4 text-white shadow-sm">
        <div className="flex items-start gap-2.5 mb-2">
            <SignpostIcon className="h-6 w-6 flex-shrink-0 mt-1" />
            <div>
                <h3 className="text-2xl font-semibold leading-none">Remaining Leads</h3>
                <p className="text-base font-normal leading-none text-white/80">On Subscription</p>
            </div>
        </div>
        <p className="text-[32px] font-bold leading-none">10</p>
    </div>
);
const WarmLeadsCard = () => (
    <div className="w-full rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
                <h3 className="text-xl font-semibold text-gray-800">Warm Leads</h3>
                <FlameIcon />
            </div>
            <div className="flex items-center gap-2">
                <button className="text-gray-400 hover:text-gray-600"><ChevronLeftIcon /></button>
                <button className="text-gray-400 hover:text-gray-600"><ChevronRightIcon /></button>
            </div>
        </div>
        <div className="relative rounded-lg overflow-hidden mb-4">
            <img src="https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=2070&auto=format&fit=crop" alt="Property" className="w-full h-40 object-cover"/>
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white">
                <button className="flex items-center gap-2 rounded-lg bg-buy-now-gradient px-4 py-2 text-sm font-semibold hover:bg-black/80 transition-colors">
                    <LockIcon />
                    <span>Unlock for $59</span>
                </button>
            </div>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div><p className="text-gray-500">Owned By</p><p className="font-semibold text-gray-800">John Smith</p></div>
            <div><p className="text-gray-500">Type</p><p className="font-semibold text-gray-800">Condo</p></div>
            <div><p className="text-gray-500">Phone</p><p className="font-semibold text-gray-800">+1 (555) 234-3452</p></div>
            <div><p className="text-gray-500">Address</p><p className="font-semibold text-gray-800 truncate">1234 Sunset Blvd, Miami</p></div>
        </div>
    </div>
);

const RecentlyPurchasedCard = () => (
    <div className="w-full rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Recently Purchased</h3>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-4">
            <div><p className="text-gray-500">Owned By</p><p className="font-semibold text-gray-800">John Smith</p></div>
            <div><p className="text-gray-500">Type</p><p className="font-semibold text-gray-800">Condo</p></div>
            <div><p className="text-gray-500">Phone</p><p className="font-semibold text-gray-800">+1(423)234 5452</p></div>
            <div><p className="text-gray-500">Address</p><p className="font-semibold text-gray-800 truncate">Street 16, Sunset...</p></div>
        </div>
        <div className="flex items-center gap-3">
            <button className="flex-1 inline-flex items-center justify-center gap-2 text-sm font-semibold h-10 rounded-lg px-4 text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">
                <EyeIcon className="text-gray-500"/> View
            </button>
            <button className="flex-1 inline-flex items-center justify-center gap-2 text-sm font-semibold h-10 rounded-lg px-4 text-white bg-card-gradient">
                <PhoneIcon /> Call Now
            </button>
        </div>
    </div>
);

const RightSidebar = () => (
    <div className="space-y-6">
        <BalanceCard />
        <RemainingLeadsCard />
        <WarmLeadsCard />
        <RecentlyPurchasedCard />
    </div>
);


// --- MAIN CONTENT SUB-COMPONENTS ---

const FilterBar = () => (
    <div className="flex flex-wrap items-center gap-3 mb-4">
        <button className="flex items-center justify-between gap-4 h-11 px-4 text-sm font-medium text-gray-700  border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50">
            <span>Sort By</span>
            <ChevronDownIcon className="w-4 h-4 text-gray-500" />
        </button>
        <button className="flex items-center justify-between gap-4 h-11 px-4 text-sm font-medium text-gray-700  border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50">
            <span>Area</span>
            <ChevronDownIcon className="w-4 h-4 text-gray-500" />
        </button>
        <button className="flex items-center justify-between gap-4 h-11 px-4 text-sm font-medium text-gray-700  border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50">
            <span>Type</span>
            <ChevronDownIcon className="w-4 h-4 text-gray-500" />
        </button>
        
        <button className="flex items-center justify-between gap-2 h-11 px-4 text-sm font-medium text-gray-700  border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50">
            <span>Price</span>
            <FilterIcon className="w-4 h-4 text-gray-500" />
        </button>
        <button className="flex items-center justify-between gap-2 h-11 px-4 text-sm font-medium text-gray-700  border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50">
            <span>Property Price</span>
            <FilterIcon className="w-4 h-4 text-gray-500" />
        </button>

        <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <SearchIcon className="w-5 h-5 text-gray-400"/>
            </div>
            <input 
                type="text" 
                placeholder="Search for leads according to your type" 
                className="w-full border border-gray-300 rounded-lg pl-10 pr-4 h-11 text-sm shadow-sm focus:ring-green-500 focus:border-green-500"
            />
        </div>
    </div>
);

const PriceTagIcon = (props) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M21.44 11.05l-9.19-9.19C12.05 1.66 11.79 1.5 11.5 1.5H4c-1.1 0-2 .9-2 2v7.5c0 .29.16.55.36.75l9.19 9.19c.39.39 1.02.39 1.41 0l7.48-7.48c.39-.39.39-1.02 0-1.41z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="7.5" cy="7.5" r="1.5" fill="white"/>
    </svg>
);

const DeselectAllButtonSVG = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="140" height="38" viewBox="0 0 140 38" fill="none" {...props}>
        <g filter="url(#filter0_i_65_1518)">
            <rect x="0.5" y="0.5" width="139" height="37" rx="18.5" stroke="url(#paint0_radial_65_1518)"/>
            <path d="M18.75 19H23.25M14.25 19C14.25 19.8864 14.4246 20.7642 14.7638 21.5831C15.103 22.4021 15.6002 23.1462 16.227 23.773C16.8538 24.3998 17.5979 24.897 18.4169 25.2362C19.2358 25.5754 20.1136 25.75 21 25.75C21.8864 25.75 22.7642 25.5754 23.5831 25.2362C24.4021 24.897 25.1462 24.3998 25.773 23.773C26.3998 23.1462 26.897 22.4021 27.2362 21.5831C27.5754 20.7642 27.75 19.8864 27.75 19C27.75 18.1136 27.5754 17.2358 27.2362 16.4169C26.897 15.5979 26.3998 14.8538 25.773 14.227C25.1462 13.6002 24.4021 13.103 23.5831 12.7638C22.7642 12.4246 21.8864 12.25 21 12.25C20.1136 12.25 19.2358 12.4246 18.4169 12.7638C17.5979 13.103 16.8538 13.6002 16.227 14.227C15.6002 14.8538 15.103 15.5979 14.7638 16.4169C14.4246 17.2358 14.25 18.1136 14.25 19Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M18.75 19H23.25M14.25 19C14.25 19.8864 14.4246 20.7642 14.7638 21.5831C15.103 22.4021 15.6002 23.1462 16.227 23.773C16.8538 24.3998 17.5979 24.897 18.4169 25.2362C19.2358 25.5754 20.1136 25.75 21 25.75C21.8864 25.75 22.7642 25.5754 23.5831 25.2362C24.4021 24.897 25.1462 24.3998 25.773 23.773C26.3998 23.1462 26.897 22.4021 27.2362 21.5831C27.5754 20.7642 27.75 19.8864 27.75 19C27.75 18.1136 27.5754 17.2358 27.2362 16.4169C26.897 15.5979 26.3998 14.8538 25.773 14.227C25.1462 13.6002 24.4021 13.103 23.5831 12.7638C22.7642 12.4246 21.8864 12.25 21 12.25C20.1136 12.25 19.2358 12.4246 18.4169 12.7638C17.5979 13.103 16.8538 13.6002 16.227 14.227C15.6002 14.8538 15.103 15.5979 14.7638 16.4169C14.4246 17.2358 14.25 18.1136 14.25 19Z" stroke="url(#paint1_radial_65_1518)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M37.232 26V14.08H41.136C42.3733 14.08 43.4453 14.3307 44.352 14.832C45.2693 15.3227 45.9787 16.016 46.48 16.912C46.9813 17.808 47.232 18.848 47.232 20.032C47.232 21.2053 46.9813 22.2453 46.48 23.152C45.9787 24.048 45.2693 24.7467 44.352 25.248C43.4453 25.7493 42.3733 26 41.136 26H37.232ZM39.12 24.32H41.168C42.0107 24.32 42.7413 24.144 43.36 23.792C43.9893 23.44 44.4747 22.944 44.816 22.304C45.1573 21.664 45.328 20.9067 45.328 20.032C45.328 19.1573 45.152 18.4053 44.8 17.776C44.4587 17.136 43.9787 16.64 43.36 16.288C42.7413 15.936 42.0107 15.76 41.168 15.76H39.12V24.32ZM52.9794 26.192C52.1154 26.192 51.3474 25.9947 50.6754 25.6C50.014 25.1947 49.4967 24.6507 49.1234 23.968C48.75 23.2747 48.5634 22.5013 48.5634 21.648C48.5634 20.7733 48.75 20 49.1234 19.328C49.5074 18.656 50.0194 18.128 50.6594 17.744C51.2994 17.3493 52.0247 17.152 52.8354 17.152C53.486 17.152 54.0674 17.264 54.5794 17.488C55.0914 17.712 55.5234 18.0213 55.8754 18.416C56.2274 18.8 56.494 19.2427 56.6754 19.744C56.8674 20.2453 56.9634 20.7787 56.9634 21.344C56.9634 21.4827 56.958 21.6267 56.9474 21.776C56.9367 21.9253 56.9154 22.064 56.8834 22.192H49.9874V20.752H55.8594L54.9954 21.408C55.102 20.8853 55.0647 20.4213 54.8834 20.016C54.7127 19.6 54.446 19.2747 54.0834 19.04C53.7314 18.7947 53.3154 18.672 52.8354 18.672C52.3554 18.672 51.9287 18.7947 51.5554 19.04C51.182 19.2747 50.894 19.616 50.6914 20.064C50.4887 20.5013 50.4087 21.0347 50.4514 21.664C50.398 22.2507 50.478 22.7627 50.6914 23.2C50.9154 23.6373 51.2247 23.9787 51.6194 24.224C52.0247 24.4693 52.4834 24.592 52.9954 24.592C53.518 24.592 53.9607 24.4747 54.3234 24.24C54.6967 24.0053 54.99 23.7013 55.2034 23.328L56.6754 24.048C56.5047 24.4533 56.238 24.8213 55.8754 25.152C55.5234 25.472 55.0967 25.728 54.5954 25.92C54.1047 26.1013 53.566 26.192 52.9794 26.192ZM61.9279 26.192C61.0425 26.192 60.2639 25.9733 59.5919 25.536C58.9305 25.0987 58.4665 24.512 58.1999 23.776L59.5919 23.12C59.8265 23.6107 60.1465 24 60.5519 24.288C60.9679 24.576 61.4265 24.72 61.9279 24.72C62.3545 24.72 62.7012 24.624 62.9679 24.432C63.2345 24.24 63.3679 23.9787 63.3679 23.648C63.3679 23.4347 63.3092 23.264 63.1919 23.136C63.0745 22.9973 62.9252 22.8853 62.7439 22.8C62.5732 22.7147 62.3972 22.6507 62.2159 22.608L60.8559 22.224C60.1092 22.0107 59.5492 21.6907 59.1759 21.264C58.8132 20.8267 58.6319 20.32 58.6319 19.744C58.6319 19.2213 58.7652 18.768 59.0319 18.384C59.2985 17.9893 59.6665 17.6853 60.1359 17.472C60.6052 17.2587 61.1332 17.152 61.7199 17.152C62.5092 17.152 63.2132 17.3493 63.8319 17.744C64.4505 18.128 64.8879 18.6667 65.1439 19.36L63.7519 20.016C63.5812 19.6 63.3092 19.2693 62.9359 19.024C62.5732 18.7787 62.1625 18.656 61.7039 18.656C61.3092 18.656 60.9945 18.752 60.7599 18.944C60.5252 19.1253 60.4079 19.3653 60.4079 19.664C60.4079 19.8667 60.4612 20.0373 60.5679 20.176C60.6745 20.304 60.8132 20.4107 60.9839 20.496C61.1545 20.5707 61.3305 20.6347 61.5119 20.688L62.9199 21.104C63.6345 21.3067 64.1839 21.6267 64.5679 22.064C64.9519 22.4907 65.1439 23.0027 65.1439 23.6C65.1439 24.112 65.0052 24.5653 64.7279 24.96C64.4612 25.344 64.0879 25.648 63.6079 25.872C63.1279 26.0853 62.5679 26.192 61.9279 26.192ZM70.9794 26.192C70.1154 26.192 69.3474 25.9947 68.6754 25.6C68.014 25.1947 67.4967 24.6507 67.1234 23.968C66.75 23.2747 66.5634 22.5013 66.5634 21.648C66.5634 20.7733 66.75 20 67.1234 19.328C67.5074 18.656 68.0194 18.128 68.6594 17.744C69.2994 17.3493 70.0247 17.152 70.8354 17.152C71.486 17.152 72.0674 17.264 72.5794 17.488C73.0914 17.712 73.5234 18.0213 73.8754 18.416C74.2274 18.8 74.494 19.2427 74.6754 19.744C74.8674 20.2453 74.9634 20.7787 74.9634 21.344C74.9634 21.4827 74.958 21.6267 74.9474 21.776C74.9367 21.9253 74.9154 22.064 74.8834 22.192H67.9874V20.752H73.8594L72.9954 21.408C73.102 20.8853 73.0647 20.4213 72.8834 20.016C72.7127 19.6 72.446 19.2747 72.0834 19.04C71.7314 18.7947 71.3154 18.672 70.8354 18.672C70.3554 18.672 69.9287 18.7947 69.5554 19.04C69.182 19.2747 68.894 19.616 68.6914 20.064C68.4887 20.5013 68.4087 21.0347 68.4514 21.664C68.398 22.2507 68.478 22.7627 68.6914 23.2C68.9154 23.6373 69.2247 23.9787 69.6194 24.224C70.0247 24.4693 70.4834 24.592 70.9954 24.592C71.518 24.592 71.9607 24.4747 72.3234 24.24C72.6967 24.0053 72.99 23.7013 73.2034 23.328L74.6754 24.048C74.5047 24.4533 74.238 24.8213 73.8754 25.152C73.5234 25.472 73.0967 25.728 72.5954 25.92C72.1047 26.1013 71.566 26.192 70.9794 26.192ZM76.7279 26V13.888H78.5359V26H76.7279ZM84.7138 26.192C83.8498 26.192 83.0818 25.9947 82.4098 25.6C81.7484 25.1947 81.2311 24.6507 80.8578 23.968C80.4844 23.2747 80.2978 22.5013 80.2978 21.648C80.2978 20.7733 80.4844 20 80.8578 19.328C81.2418 18.656 81.7538 18.128 82.3938 17.744C83.0338 17.3493 83.7591 17.152 84.5698 17.152C85.2204 17.152 85.8018 17.264 86.3138 17.488C86.8258 17.712 87.2578 18.0213 87.6098 18.416C87.9618 18.8 88.2284 19.2427 88.4097 19.744C88.6018 20.2453 88.6978 20.7787 88.6978 21.344C88.6978 21.4827 88.6924 21.6267 88.6818 21.776C88.6711 21.9253 88.6498 22.064 88.6178 22.192H81.7218V20.752H87.5938L86.7298 21.408C86.8364 20.8853 86.7991 20.4213 86.6178 20.016C86.4471 19.6 86.1804 19.2747 85.8178 19.04C85.4658 18.7947 85.0498 18.672 84.5698 18.672C84.0898 18.672 83.6631 18.7947 83.2898 19.04C82.9164 19.2747 82.6284 19.616 82.4258 20.064C82.2231 20.5013 82.1431 21.0347 82.1858 21.664C82.1324 22.2507 82.2124 22.7627 82.4258 23.2C82.6498 23.6373 82.9591 23.9787 83.3538 24.224C83.7591 24.4693 84.2178 24.592 84.7298 24.592C85.2524 24.592 85.6951 24.4747 86.0578 24.24C86.4311 24.0053 86.7244 23.7013 86.9378 23.328L88.4097 24.048C88.2391 24.4533 87.9724 24.8213 87.6098 25.152C87.2578 25.472 86.8311 25.728 86.3298 25.92C85.8391 26.1013 85.3004 26.192 84.7138 26.192ZM94.5743 26.192C93.7103 26.192 92.9423 25.9947 92.2703 25.6C91.6089 25.1947 91.0809 24.6507 90.6863 23.968C90.3023 23.2853 90.1103 22.512 90.1103 21.648C90.1103 20.7947 90.3023 20.0267 90.6863 19.344C91.0703 18.6613 91.5983 18.128 92.2703 17.744C92.9423 17.3493 93.7103 17.152 94.5743 17.152C95.1609 17.152 95.7103 17.2587 96.2223 17.472C96.7343 17.6747 97.1769 17.9573 97.5503 18.32C97.9343 18.6827 98.2169 19.104 98.3983 19.584L96.8143 20.32C96.6329 19.872 96.3396 19.5147 95.9343 19.248C95.5396 18.9707 95.0863 18.832 94.5743 18.832C94.0836 18.832 93.6409 18.9547 93.2463 19.2C92.8623 19.4347 92.5583 19.7707 92.3343 20.208C92.1103 20.6347 91.9983 21.12 91.9983 21.664C91.9983 22.208 92.1103 22.6987 92.3343 23.136C92.5583 23.5627 92.8623 23.8987 93.2463 24.144C93.6409 24.3893 94.0836 24.512 94.5743 24.512C95.0969 24.512 95.5503 24.3787 95.9343 24.112C96.3289 23.8347 96.6223 23.4667 96.8143 23.008L98.3983 23.76C98.2276 24.2187 97.9503 24.6347 97.5663 25.008C97.1929 25.3707 96.7503 25.6587 96.2383 25.872C95.7263 26.0853 95.1716 26.192 94.5743 26.192ZM103.909 26.096C103.003 26.096 102.299 25.84 101.797 25.328C101.296 24.816 101.045 24.096 101.045 23.168V18.976H99.5254V17.344H99.7654C100.171 17.344 100.485 17.2267 100.709 16.992C100.933 16.7573 101.045 16.4373 101.045 16.032V15.36H102.853V17.344H104.821V18.976H102.853V23.088C102.853 23.3867 102.901 23.6427 102.997 23.856C103.093 24.0587 103.248 24.2187 103.461 24.336C103.675 24.4427 103.952 24.496 104.293 24.496C104.379 24.496 104.475 24.4907 104.581 24.48C104.688 24.4693 104.789 24.4587 104.885 24.448V26C104.736 26.0213 104.571 26.0427 104.389 26.064C104.208 26.0853 104.048 26.096 103.909 26.096ZM108.567 26L112.759 14.08H115.095L119.287 26H117.271L116.359 23.328H111.511L110.583 26H108.567ZM112.055 21.648H115.783L113.671 15.408H114.199L112.055 21.648ZM120.525 26V13.888H122.333V26H120.525ZM124.447 26V13.888H126.255V26H124.447Z" fill="url(#paint2_radial_65_1518)"/>
        </g>
        <defs>
            <filter id="filter0_i_65_1518" x="0" y="0" width="140" height="38" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                <feOffset/>
                <feGaussianBlur stdDeviation="2"/>
                <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.15 0"/>
                <feBlend mode="normal" in2="shape" result="effect1_innerShadow_65_1518"/>
            </filter>
            <radialGradient id="paint0_radial_65_1518" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(74.023 93.9143) rotate(-104.77) scale(163.451 287.976)">
                <stop stop-color="#D1D5DC"/>
                <stop offset="1" stop-color="#4A5565"/>
            </radialGradient>
            <radialGradient id="paint1_radial_65_1518" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(21.3879 45.6143) rotate(-94.0932) scale(56.2931 28.6448)">
                <stop stop-color="#D1D5DC"/>
                <stop offset="1" stop-color="#4A5565"/>
            </radialGradient>
            <radialGradient id="paint2_radial_65_1518" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(84.6437 62.3714) rotate(-106.66) scale(95.5123 187.493)">
                <stop stop-color="#D1D5DC"/>
                <stop offset="1" stop-color="#4A5565"/>
            </radialGradient>
        </defs>
    </svg>
);

// --- REPLICA of the new Lead Card design ---
// --- UPDATED LeadCard component ---

const LeadCard = ({ lead, onToggleSelect }) => (
    // The onClick for toggling selection remains on the main container
    <div 
        onClick={() => onToggleSelect(lead.id)}
        className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4 flex flex-col justify-between cursor-pointer transition-all duration-200 hover:shadow-lg"
    >
        <div>
            {/* Top and Middle sections remain unchanged */}
            <div className="flex justify-between items-start">
                <div className="flex gap-6">
                    <div>
                        <p className="text-sm font-bold text-gray-800">Owned By</p>
                        <p className="text-sm text-gray-500 mt-1">{lead.owner}</p>
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-800">Phone</p>
                        <p className="text-sm text-gray-500 mt-1">{lead.phone}</p>
                    </div>
                </div>
                <p className="text-3xl font-bold text-green-600">{lead.price}</p>
            </div>
            <div className="grid grid-cols-2 gap-y-4 mt-4">
                <div>
                    <p className="text-sm font-bold text-gray-800">Type</p>
                    <p className="text-sm text-gray-500 mt-1">{lead.type}</p>
                </div>
                <div>
                    <p className="text-sm font-bold text-gray-800">Area</p>
                    <p className="text-sm text-gray-500 mt-1">{lead.area}</p>
                </div>
                <div>
                    <p className="text-sm font-bold text-gray-800">Address</p>
                    <p className="text-sm text-gray-500 mt-1 truncate">{lead.address}</p>
                </div>
                <div>
                    <p className="text-sm font-bold text-gray-800">Property Value</p>
                    <p className="text-sm text-gray-500 mt-1">{lead.propertyValue}</p>
                </div>
            </div>
        </div>

        {/* Bottom Section: Updated to show status on left, button on right */}
        <div className="flex justify-between items-center pt-4 mt-2">
            {/* Left side: Conditionally shows "Selected" or "Select" */}
            <div className="flex items-center gap-2">
                {lead.selected ? (
                    <>
                        <CheckmarkIcon />
                        <span className="font-bold text-green-600 text-sm">Selected</span>
                    </>
                ) : (
                    <>
                        <EmptyCheckboxIcon />
                        <span className="font-semibold text-gray-500 text-sm">Select</span>
                    </>
                )}
            </div>

            {/* Right side: "Buy Now" button is always visible */}
            <div className="bg-buy-now-gradient text-white font-semibold text-sm px-5 py-2.5 rounded-full flex items-center gap-2">
                <PriceTagIcon />
                <span>Buy Now</span>
            </div>
        </div>
    </div>
);

// --- MOCK DATA to replicate the image ---
const mockLeads = [
    { id: 1, owner: 'Sarah Johnson', price: '$450', phone: '6666 ', type: 'Apartment', area: 'Los Angeles', address: ' ', propertyValue: '$550K-700K', selected: false },
    { id: 2, owner: 'Michael Brown', price: '$600', phone: ' ', type: 'Townhouse', area: 'Chicago', address: ' ', propertyValue: '$600K-800K', selected: true },
    { id: 3, owner: 'Emily Davis', price: '$1,200', phone: ' ', type: 'Single Family', area: 'San Francisco', address: ' ', propertyValue: '$1M - 1.3M', selected: false },
    { id: 4, owner: 'Olivia Wilson', price: '$800', phone: ' ', type: 'Loft', area: 'Boston', address: ' ', propertyValue: '$750K-900K', selected: true },
    { id: 5, owner: 'Daniel Martinez', price: '$1,500', phone: ' ', type: 'Villa', area: 'Miami', address: ' ', propertyValue: '$1.2M-1.8M', selected: true },
    { id: 6, owner: 'Sophia Clark', price: '$400', phone: ' ', type: 'Cottage', area: 'Dallas', address: ' ', propertyValue: '$300K-500K', selected: false },
    { id: 7, owner: 'James Lee', price: '$500', phone: ' ', type: 'Bungalow', area: 'Portland', address: ' ', propertyValue: '$450K-550K', selected: false },
    { id: 8, owner: 'Isabella Harris', price: '$300', phone: ' ', type: 'Maisonette', area: 'Raleigh', address: ' ', propertyValue: '$280K-350K', selected: true },
    { id: 9, owner: 'Liam Thomas', price: '$600', phone: ' ', type: 'Duplex', area: 'Phoenix', address: ' ', propertyValue: '$320K-240K', selected: false },
];

const initiallySelectedLeads = mockLeads.map(lead => ({ ...lead, selected: true }));

// --- NEW: LIST VIEW COMPONENTS ---

const LeadListItem = ({ lead, onToggleSelect }) => (
    <tr 
        onClick={() => onToggleSelect(lead.id)}
        className="border-b border-gray-200/50 hover:bg-gray-50/50 transition-colors cursor-pointer"
    >
        {/* Checkbox cell on the left */}
        <td className="p-2">
            {lead.selected ? <CheckmarkIcon /> : <EmptyCheckboxIcon />}
        </td>

        {/* Data cells */}
        <td className="p-2 font-medium text-sm text-gray-800 whitespace-nowrap">{lead.owner}</td>
        <td className="p-2 text-sm text-gray-600 whitespace-nowrap">{lead.type}</td>
        <td className="p-2 text-sm text-gray-600 whitespace-nowrap">{lead.area}</td>
        <td className="p-2 text-sm text-gray-600 whitespace-nowrap">{lead.propertyValue}</td>
        <td className="p-2 font-bold text-sm text-green-600 whitespace-nowrap">{lead.price}</td>

        {/* Action cell on the right, always showing "Buy Now" */}
        <td className="p-2 text-right">
            <button
                onClick={(e) => {
                    e.stopPropagation(); // Prevents the row's onClick from firing
                    // In a real app, you'd trigger a purchase action here
                    console.log(`Buy Now clicked for lead: ${lead.id}`);
                }}
                className="bg-buy-now-gradient text-white font-semibold text-sm px-4 py-2 rounded-full flex items-center gap-2 transition-opacity hover:opacity-90"
            >
                <PriceTagIcon />
                <span>Buy Now</span>
            </button>
        </td>
    </tr>
);


const LeadsListView = ({ leads, onToggleSelect }) => (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-x-auto">
        <table className="w-full">
            <thead>
                <tr className="border-b border-gray-200/50">
                    {/* Header for the new checkbox column */}
                    <th className="p-4 text-left"><span className="sr-only">Select</span></th>
                    <th className="p-4 text-left font-semibold text-neutral text-xs uppercase tracking-wider">Owned By</th>
                    <th className="p-4 text-left font-semibold text-neutral text-xs uppercase tracking-wider">Type</th>
                    <th className="p-4 text-left font-semibold text-neutral text-xs uppercase tracking-wider">Area</th>
                    <th className="p-4 text-left font-semibold text-neutral text-xs uppercase tracking-wider">Property Value</th>
                    <th className="p-4 text-left font-semibold text-neutral text-xs uppercase tracking-wider">Price</th>
                    <th className="p-4 text-right"><span className="sr-only">Action</span></th>
                </tr>
            </thead>
            <tbody>
                {leads.map(lead => (
                    <LeadListItem key={lead.id} lead={lead} onToggleSelect={onToggleSelect} />
                ))}
            </tbody>
        </table>
    </div>
);




const DeselectAllButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 rounded-full  text-base font-semibold border border-transparent"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="140" height="38" viewBox="0 0 140 38" fill="none">
        <g filter="url(#filter0_i_65_1518_deselect)">
          <rect x="0.5" y="0.5" width="139" height="37" rx="18.5" stroke="url(#paint0_radial_65_1518_deselect)" />
          <path d="M18.75 19H23.25M14.25 19C14.25 19.8864 14.4246 20.7642 14.7638 21.5831C15.103 22.4021 15.6002 23.1462 16.227 23.773C16.8538 24.3998 17.5979 24.897 18.4169 25.2362C19.2358 25.5754 20.1136 25.75 21 25.75C21.8864 25.75 22.7642 25.5754 23.5831 25.2362C24.4021 24.897 25.1462 24.3998 25.773 23.773C26.3998 23.1462 26.897 22.4021 27.2362 21.5831C27.5754 20.7642 27.75 19.8864 27.75 19C27.75 18.1136 27.5754 17.2358 27.2362 16.4169C26.897 15.5979 26.3998 14.8538 25.773 14.227C25.1462 13.6002 24.4021 13.103 23.5831 12.7638C22.7642 12.4246 21.8864 12.25 21 12.25C20.1136 12.25 19.2358 12.4246 18.4169 12.7638C17.5979 13.103 16.8538 13.6002 16.227 14.227C15.6002 14.8538 15.103 15.5979 14.7638 16.4169C14.4246 17.2358 14.25 18.1136 14.25 19Z" stroke="url(#paint1_radial_65_1518_deselect)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M37.232 26V14.08H41.136C42.3733 14.08 43.4453 14.3307 44.352 14.832C45.2693 15.3227 45.9787 16.016 46.48 16.912C46.9813 17.808 47.232 18.848 47.232 20.032C47.232 21.2053 46.9813 22.2453 46.48 23.152C45.9787 24.048 45.2693 24.7467 44.352 25.248C43.4453 25.7493 42.3733 26 41.136 26H37.232ZM39.12 24.32H41.168C42.0107 24.32 42.7413 24.144 43.36 23.792C43.9893 23.44 44.4747 22.944 44.816 22.304C45.1573 21.664 45.328 20.9067 45.328 20.032C45.328 19.1573 45.152 18.4053 44.8 17.776C44.4587 17.136 43.9787 16.64 43.36 16.288C42.7413 15.936 42.0107 15.76 41.168 15.76H39.12V24.32ZM52.9794 26.192C52.1154 26.192 51.3474 25.9947 50.6754 25.6C50.014 25.1947 49.4967 24.6507 49.1234 23.968C48.75 23.2747 48.5634 22.5013 48.5634 21.648C48.5634 20.7733 48.75 20 49.1234 19.328C49.5074 18.656 50.0194 18.128 50.6594 17.744C51.2994 17.3493 52.0247 17.152 52.8354 17.152C53.486 17.152 54.0674 17.264 54.5794 17.488C55.0914 17.712 55.5234 18.0213 55.8754 18.416C56.2274 18.8 56.494 19.2427 56.6754 19.744C56.8674 20.2453 56.9634 20.7787 56.9634 21.344C56.9634 21.4827 56.958 21.6267 56.9474 21.776C56.9367 21.9253 56.9154 22.064 56.8834 22.192H49.9874V20.752H55.8594L54.9954 21.408C55.102 20.8853 55.0647 20.4213 54.8834 20.016C54.7127 19.6 54.446 19.2747 54.0834 19.04C53.7314 18.7947 53.3154 18.672 52.8354 18.672C52.3554 18.672 51.9287 18.7947 51.5554 19.04C51.182 19.2747 50.894 19.616 50.6914 20.064C50.4887 20.5013 50.4087 21.0347 50.4514 21.664C50.398 22.2507 50.478 22.7627 50.6914 23.2C50.9154 23.6373 51.2247 23.9787 51.6194 24.224C52.0247 24.4693 52.4834 24.592 52.9954 24.592C53.518 24.592 53.9607 24.4747 54.3234 24.24C54.6967 24.0053 54.99 23.7013 55.2034 23.328L56.6754 24.048C56.5047 24.4533 56.238 24.8213 55.8754 25.152C55.5234 25.472 55.0967 25.728 54.5954 25.92C54.1047 26.1013 53.566 26.192 52.9794 26.192ZM61.9279 26.192C61.0425 26.192 60.2639 25.9733 59.5919 25.536C58.9305 25.0987 58.4665 24.512 58.1999 23.776L59.5919 23.12C59.8265 23.6107 60.1465 24 60.5519 24.288C60.9679 24.576 61.4265 24.72 61.9279 24.72C62.3545 24.72 62.7012 24.624 62.9679 24.432C63.2345 24.24 63.3679 23.9787 63.3679 23.648C63.3679 23.4347 63.3092 23.264 63.1919 23.136C63.0745 22.9973 62.9252 22.8853 62.7439 22.8C62.5732 22.7147 62.3972 22.6507 62.2159 22.608L60.8559 22.224C60.1092 22.0107 59.5492 21.6907 59.1759 21.264C58.8132 20.8267 58.6319 20.32 58.6319 19.744C58.6319 19.2213 58.7652 18.768 59.0319 18.384C59.2985 17.9893 59.6665 17.6853 60.1359 17.472C60.6052 17.2587 61.1332 17.152 61.7199 17.152C62.5092 17.152 63.2132 17.3493 63.8319 17.744C64.4505 18.128 64.8879 18.6667 65.1439 19.36L63.7519 20.016C63.5812 19.6 63.3092 19.2693 62.9359 19.024C62.5732 18.7787 62.1625 18.656 61.7039 18.656C61.3092 18.656 60.9945 18.752 60.7599 18.944C60.5252 19.1253 60.4079 19.3653 60.4079 19.664C60.4079 19.8667 60.4612 20.0373 60.5679 20.176C60.6745 20.304 60.8132 20.4107 60.9839 20.496C61.1545 20.5707 61.3305 20.6347 61.5119 20.688L62.9199 21.104C63.6345 21.3067 64.1839 21.6267 64.5679 22.064C64.9519 22.4907 65.1439 23.0027 65.1439 23.6C65.1439 24.112 65.0052 24.5653 64.7279 24.96C64.4612 25.344 64.0879 25.648 63.6079 25.872C63.1279 26.0853 62.5679 26.192 61.9279 26.192ZM70.9794 26.192C70.1154 26.192 69.3474 25.9947 68.6754 25.6C68.014 25.1947 67.4967 24.6507 67.1234 23.968C66.75 23.2747 66.5634 22.5013 66.5634 21.648C66.5634 20.7733 66.75 20 67.1234 19.328C67.5074 18.656 68.0194 18.128 68.6594 17.744C69.2994 17.3493 70.0247 17.152 70.8354 17.152C71.486 17.152 72.0674 17.264 72.5794 17.488C73.0914 17.712 73.5234 18.0213 73.8754 18.416C74.2274 18.8 74.494 19.2427 74.6754 19.744C74.8674 20.2453 74.9634 20.7787 74.9634 21.344C74.9634 21.4827 74.958 21.6267 74.9474 21.776C74.9367 21.9253 74.9154 22.064 74.8834 22.192H67.9874V20.752H73.8594L72.9954 21.408C73.102 20.8853 73.0647 20.4213 72.8834 20.016C72.7127 19.6 72.446 19.2747 72.0834 19.04C71.7314 18.7947 71.3154 18.672 70.8354 18.672C70.3554 18.672 69.9287 18.7947 69.5554 19.04C69.182 19.2747 68.894 19.616 68.6914 20.064C68.4887 20.5013 68.4087 21.0347 68.4514 21.664C68.398 22.2507 68.478 22.7627 68.6914 23.2C68.9154 23.6373 69.2247 23.9787 69.6194 24.224C70.0247 24.4693 70.4834 24.592 70.9954 24.592C71.518 24.592 71.9607 24.4747 72.3234 24.24C72.6967 24.0053 72.99 23.7013 73.2034 23.328L74.6754 24.048C74.5047 24.4533 74.238 24.8213 73.8754 25.152C73.5234 25.472 73.0967 25.728 72.5954 25.92C72.1047 26.1013 71.566 26.192 70.9794 26.192ZM76.7279 26V13.888H78.5359V26H76.7279ZM84.7138 26.192C83.8498 26.192 83.0818 25.9947 82.4098 25.6C81.7484 25.1947 81.2311 24.6507 80.8578 23.968C80.4844 23.2747 80.2978 22.5013 80.2978 21.648C80.2978 20.7733 80.4844 20 80.8578 19.328C81.2418 18.656 81.7538 18.128 82.3938 17.744C83.0338 17.3493 83.7591 17.152 84.5698 17.152C85.2204 17.152 85.8018 17.264 86.3138 17.488C86.8258 17.712 87.2578 18.0213 87.6098 18.416C87.9618 18.8 88.2284 19.2427 88.4097 19.744C88.6018 20.2453 88.6978 20.7787 88.6978 21.344C88.6978 21.4827 88.6924 21.6267 88.6818 21.776C88.6711 21.9253 88.6498 22.064 88.6178 22.192H81.7218V20.752H87.5938L86.7298 21.408C86.8364 20.8853 86.7991 20.4213 86.6178 20.016C86.4471 19.6 86.1804 19.2747 85.8178 19.04C85.4658 18.7947 85.0498 18.672 84.5698 18.672C84.0898 18.672 83.6631 18.7947 83.2898 19.04C82.9164 19.2747 82.6284 19.616 82.4258 20.064C82.2231 20.5013 82.1431 21.0347 82.1858 21.664C82.1324 22.2507 82.2124 22.7627 82.4258 23.2C82.6498 23.6373 82.9591 23.9787 83.3538 24.224C83.7591 24.4693 84.2178 24.592 84.7298 24.592C85.2524 24.592 85.6951 24.4747 86.0578 24.24C86.4311 24.0053 86.7244 23.7013 86.9378 23.328L88.4097 24.048C88.2391 24.4533 87.9724 24.8213 87.6098 25.152C87.2578 25.472 86.8311 25.728 86.3298 25.92C85.8391 26.1013 85.3004 26.192 84.7138 26.192ZM94.5743 26.192C93.7103 26.192 92.9423 25.9947 92.2703 25.6C91.6089 25.1947 91.0809 24.6507 90.6863 23.968C90.3023 23.2853 90.1103 22.512 90.1103 21.648C90.1103 20.7947 90.3023 20.0267 90.6863 19.344C91.0703 18.6613 91.5983 18.128 92.2703 17.744C92.9423 17.3493 93.7103 17.152 94.5743 17.152C95.1609 17.152 95.7103 17.2587 96.2223 17.472C96.7343 17.6747 97.1769 17.9573 97.5503 18.32C97.9343 18.6827 98.2169 19.104 98.3983 19.584L96.8143 20.32C96.6329 19.872 96.3396 19.5147 95.9343 19.248C95.5396 18.9707 95.0863 18.832 94.5743 18.832C94.0836 18.832 93.6409 18.9547 93.2463 19.2C92.8623 19.4347 92.5583 19.7707 92.3343 20.208C92.1103 20.6347 91.9983 21.12 91.9983 21.664C91.9983 22.208 92.1103 22.6987 92.3343 23.136C92.5583 23.5627 92.8623 23.8987 93.2463 24.144C93.6409 24.3893 94.0836 24.512 94.5743 24.512C95.0969 24.512 95.5503 24.3787 95.9343 24.112C96.3289 23.8347 96.6223 23.4667 96.8143 23.008L98.3983 23.76C98.2276 24.2187 97.9503 24.6347 97.5663 25.008C97.1929 25.3707 96.7503 25.6587 96.2383 25.872C95.7263 26.0853 95.1716 26.192 94.5743 26.192ZM103.909 26.096C103.003 26.096 102.299 25.84 101.797 25.328C101.296 24.816 101.045 24.096 101.045 23.168V18.976H99.5254V17.344H99.7654C100.171 17.344 100.485 17.2267 100.709 16.992C100.933 16.7573 101.045 16.4373 101.045 16.032V15.36H102.853V17.344H104.821V18.976H102.853V23.088C102.853 23.3867 102.901 23.6427 102.997 23.856C103.093 24.0587 103.248 24.2187 103.461 24.336C103.675 24.4427 103.952 24.496 104.293 24.496C104.379 24.496 104.475 24.4907 104.581 24.48C104.688 24.4693 104.789 24.4587 104.885 24.448V26C104.736 26.0213 104.571 26.0427 104.389 26.064C104.208 26.0853 104.048 26.096 103.909 26.096ZM108.567 26L112.759 14.08H115.095L119.287 26H117.271L116.359 23.328H111.511L110.583 26H108.567ZM112.055 21.648H115.783L113.671 15.408H114.199L112.055 21.648ZM120.525 26V13.888H122.333V26H120.525ZM124.447 26V13.888H126.255V26H124.447Z" fill="url(#paint2_radial_65_1518_deselect)" />
        </g>
        <defs>
          <filter id="filter0_i_65_1518_deselect" x="0" y="0" width="140" height="38" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
            <feOffset />
            <feGaussianBlur stdDeviation="2" />
            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
            <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.15 0" />
            <feBlend mode="normal" in2="shape" result="effect1_innerShadow_65_1518" />
          </filter>
          <radialGradient id="paint0_radial_65_1518_deselect" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(74.023 93.9143) rotate(-104.77) scale(163.451 287.976)">
            <stop stopColor="#D1D5DC" />
            <stop offset="1" stopColor="#4A5565" />
          </radialGradient>
          <radialGradient id="paint1_radial_65_1518_deselect" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(21.3879 45.6143) rotate(-94.0932) scale(56.2931 28.6448)">
            <stop stopColor="#D1D5DC" />
            <stop offset="1" stopColor="#4A5565" />
          </radialGradient>
          <radialGradient id="paint2_radial_65_1518_deselect" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(84.6437 62.3714) rotate(-106.66) scale(95.5123 187.493)">
            <stop stopColor="#D1D5DC" />
            <stop offset="1" stopColor="#4A5565" />
          </radialGradient>
        </defs>
      </svg>
    </button>
  );
};

const AddtoCartButton = ({ onClick }) => {
  return (
<svg xmlns="http://www.w3.org/2000/svg" width="138" height="38" viewBox="0 0 138 38" fill="none">
<g filter="url(#filter0_i_65_1533)">
<rect x="0.5" y="0.5" width="137" height="37" rx="18.5" stroke="url(#paint0_radial_65_1533)"/>
<path d="M15 24.25C15 24.6478 15.158 25.0294 15.4393 25.3107C15.7206 25.592 16.1022 25.75 16.5 25.75C16.8978 25.75 17.2794 25.592 17.5607 25.3107C17.842 25.0294 18 24.6478 18 24.25C18 23.8522 17.842 23.4706 17.5607 23.1893C17.2794 22.908 16.8978 22.75 16.5 22.75C16.1022 22.75 15.7206 22.908 15.4393 23.1893C15.158 23.4706 15 23.8522 15 24.25Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M15 24.25C15 24.6478 15.158 25.0294 15.4393 25.3107C15.7206 25.592 16.1022 25.75 16.5 25.75C16.8978 25.75 17.2794 25.592 17.5607 25.3107C17.842 25.0294 18 24.6478 18 24.25C18 23.8522 17.842 23.4706 17.5607 23.1893C17.2794 22.908 16.8978 22.75 16.5 22.75C16.1022 22.75 15.7206 22.908 15.4393 23.1893C15.158 23.4706 15 23.8522 15 24.25Z" stroke="url(#paint1_radial_65_1533)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M21.375 22.75H16.5V12.25H15" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M21.375 22.75H16.5V12.25H15" stroke="url(#paint2_radial_65_1533)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M16.5 13.75L27 14.5L26.355 19.0128M24.375 19.75H16.5M24 24.25H28.5M26.25 22V26.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M16.5 13.75L27 14.5L26.355 19.0128M24.375 19.75H16.5M24 24.25H28.5M26.25 22V26.5" stroke="url(#paint3_radial_65_1533)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M36.176 26L40.368 14.08H42.704L46.896 26H44.88L43.968 23.328H39.12L38.192 26H36.176ZM39.664 21.648H43.392L41.28 15.408H41.808L39.664 21.648ZM51.8216 26.192C50.9896 26.192 50.243 25.9947 49.5816 25.6C48.931 25.1947 48.4136 24.6507 48.0296 23.968C47.6563 23.2853 47.4696 22.5173 47.4696 21.664C47.4696 20.8107 47.6616 20.0427 48.0456 19.36C48.4296 18.6773 48.947 18.1387 49.5976 17.744C50.2483 17.3493 50.9843 17.152 51.8056 17.152C52.499 17.152 53.1123 17.2907 53.6456 17.568C54.179 17.8453 54.6003 18.2293 54.9096 18.72L54.6376 19.136V13.888H56.4296V26H54.7176V24.24L54.9256 24.576C54.627 25.0987 54.2003 25.4987 53.6456 25.776C53.091 26.0533 52.483 26.192 51.8216 26.192ZM51.9976 24.512C52.499 24.512 52.947 24.3893 53.3416 24.144C53.747 23.8987 54.0616 23.5627 54.2856 23.136C54.5203 22.6987 54.6376 22.208 54.6376 21.664C54.6376 21.12 54.5203 20.6347 54.2856 20.208C54.0616 19.7813 53.747 19.4453 53.3416 19.2C52.947 18.9547 52.499 18.832 51.9976 18.832C51.4963 18.832 51.043 18.9547 50.6376 19.2C50.2323 19.4453 49.9176 19.7813 49.6936 20.208C49.4696 20.6347 49.3576 21.12 49.3576 21.664C49.3576 22.208 49.4696 22.6987 49.6936 23.136C49.9176 23.5627 50.227 23.8987 50.6216 24.144C51.027 24.3893 51.4856 24.512 51.9976 24.512ZM62.5404 26.192C61.7084 26.192 60.9617 25.9947 60.3004 25.6C59.6497 25.1947 59.1324 24.6507 58.7484 23.968C58.375 23.2853 58.1884 22.5173 58.1884 21.664C58.1884 20.8107 58.3804 20.0427 58.7644 19.36C59.1484 18.6773 59.6657 18.1387 60.3164 17.744C60.967 17.3493 61.703 17.152 62.5244 17.152C63.2177 17.152 63.831 17.2907 64.3644 17.568C64.8977 17.8453 65.319 18.2293 65.6284 18.72L65.3564 19.136V13.888H67.1484V26H65.4364V24.24L65.6444 24.576C65.3457 25.0987 64.919 25.4987 64.3644 25.776C63.8097 26.0533 63.2017 26.192 62.5404 26.192ZM62.7164 24.512C63.2177 24.512 63.6657 24.3893 64.0604 24.144C64.4657 23.8987 64.7804 23.5627 65.0044 23.136C65.239 22.6987 65.3564 22.208 65.3564 21.664C65.3564 21.12 65.239 20.6347 65.0044 20.208C64.7804 19.7813 64.4657 19.4453 64.0604 19.2C63.6657 18.9547 63.2177 18.832 62.7164 18.832C62.215 18.832 61.7617 18.9547 61.3564 19.2C60.951 19.4453 60.6364 19.7813 60.4124 20.208C60.1884 20.6347 60.0764 21.12 60.0764 21.664C60.0764 22.208 60.1884 22.6987 60.4124 23.136C60.6364 23.5627 60.9457 23.8987 61.3404 24.144C61.7457 24.3893 62.2044 24.512 62.7164 24.512ZM74.344 26V15.76H71.176V14.08H79.336V15.76H76.216V26H74.344ZM83.6226 26.192C82.7906 26.192 82.028 25.9947 81.3346 25.6C80.652 25.2053 80.108 24.6667 79.7026 23.984C79.2973 23.3013 79.0946 22.528 79.0946 21.664C79.0946 20.7893 79.2973 20.016 79.7026 19.344C80.108 18.6613 80.652 18.128 81.3346 17.744C82.0173 17.3493 82.78 17.152 83.6226 17.152C84.476 17.152 85.2386 17.3493 85.9106 17.744C86.5933 18.128 87.132 18.6613 87.5266 19.344C87.932 20.016 88.1346 20.7893 88.1346 21.664C88.1346 22.5387 87.932 23.3173 87.5266 24C87.1213 24.6827 86.5773 25.2213 85.8946 25.616C85.212 26 84.4546 26.192 83.6226 26.192ZM83.6226 24.512C84.1346 24.512 84.588 24.3893 84.9826 24.144C85.3773 23.8987 85.6866 23.5627 85.9106 23.136C86.1453 22.6987 86.2626 22.208 86.2626 21.664C86.2626 21.12 86.1453 20.6347 85.9106 20.208C85.6866 19.7813 85.3773 19.4453 84.9826 19.2C84.588 18.9547 84.1346 18.832 83.6226 18.832C83.1213 18.832 82.668 18.9547 82.2626 19.2C81.868 19.4453 81.5533 19.7813 81.3186 20.208C81.0946 20.6347 80.9826 21.12 80.9826 21.664C80.9826 22.208 81.0946 22.6987 81.3186 23.136C81.5533 23.5627 81.868 23.8987 82.2626 24.144C82.668 24.3893 83.1213 24.512 83.6226 24.512ZM98.4246 26.192C97.582 26.192 96.798 26.0373 96.0726 25.728C95.358 25.4187 94.734 24.992 94.2006 24.448C93.678 23.8933 93.2673 23.2427 92.9686 22.496C92.67 21.7493 92.5206 20.928 92.5206 20.032C92.5206 19.1467 92.6646 18.3307 92.9526 17.584C93.2513 16.8267 93.6673 16.176 94.2006 15.632C94.734 15.0773 95.358 14.6507 96.0726 14.352C96.7873 14.0427 97.5713 13.888 98.4246 13.888C99.2673 13.888 100.019 14.032 100.681 14.32C101.353 14.608 101.918 14.9867 102.377 15.456C102.835 15.9147 103.166 16.416 103.369 16.96L101.673 17.76C101.417 17.12 101.006 16.6027 100.441 16.208C99.886 15.8027 99.214 15.6 98.4246 15.6C97.6353 15.6 96.9366 15.7867 96.3286 16.16C95.7206 16.5333 95.246 17.0507 94.9046 17.712C94.574 18.3733 94.4086 19.1467 94.4086 20.032C94.4086 20.9173 94.574 21.696 94.9046 22.368C95.246 23.0293 95.7206 23.5467 96.3286 23.92C96.9366 24.2827 97.6353 24.464 98.4246 24.464C99.214 24.464 99.886 24.2667 100.441 23.872C101.006 23.4773 101.417 22.96 101.673 22.32L103.369 23.12C103.166 23.6533 102.835 24.1547 102.377 24.624C101.918 25.0933 101.353 25.472 100.681 25.76C100.019 26.048 99.2673 26.192 98.4246 26.192ZM107.57 26.192C106.983 26.192 106.466 26.0907 106.018 25.888C105.581 25.6747 105.239 25.3867 104.994 25.024C104.749 24.6507 104.626 24.2133 104.626 23.712C104.626 23.2427 104.727 22.8213 104.93 22.448C105.143 22.0747 105.469 21.76 105.906 21.504C106.343 21.248 106.893 21.0667 107.554 20.96L110.562 20.464V21.888L107.906 22.352C107.426 22.4373 107.074 22.592 106.85 22.816C106.626 23.0293 106.514 23.3067 106.514 23.648C106.514 23.9787 106.637 24.2507 106.882 24.464C107.138 24.6667 107.463 24.768 107.858 24.768C108.349 24.768 108.775 24.6613 109.138 24.448C109.511 24.2347 109.799 23.952 110.002 23.6C110.205 23.2373 110.306 22.8373 110.306 22.4V20.176C110.306 19.7493 110.146 19.4027 109.826 19.136C109.517 18.8587 109.101 18.72 108.578 18.72C108.098 18.72 107.677 18.848 107.314 19.104C106.962 19.3493 106.701 19.6693 106.53 20.064L105.026 19.312C105.186 18.8853 105.447 18.512 105.81 18.192C106.173 17.8613 106.594 17.6053 107.074 17.424C107.565 17.2427 108.082 17.152 108.626 17.152C109.309 17.152 109.911 17.28 110.434 17.536C110.967 17.792 111.378 18.1493 111.666 18.608C111.965 19.056 112.114 19.5787 112.114 20.176V26H110.386V24.432L110.754 24.48C110.551 24.832 110.29 25.136 109.97 25.392C109.661 25.648 109.303 25.8453 108.898 25.984C108.503 26.1227 108.061 26.192 107.57 26.192ZM114.228 26V17.344H115.956V19.088L115.796 18.832C115.988 18.2667 116.297 17.8613 116.724 17.616C117.151 17.36 117.663 17.232 118.26 17.232H118.788V18.88H118.036C117.439 18.88 116.953 19.0667 116.58 19.44C116.217 19.8027 116.036 20.3253 116.036 21.008V26H114.228ZM123.925 26.096C123.018 26.096 122.314 25.84 121.813 25.328C121.312 24.816 121.061 24.096 121.061 23.168V18.976H119.541V17.344H119.781C120.186 17.344 120.501 17.2267 120.725 16.992C120.949 16.7573 121.061 16.4373 121.061 16.032V15.36H122.869V17.344H124.837V18.976H122.869V23.088C122.869 23.3867 122.917 23.6427 123.013 23.856C123.109 24.0587 123.264 24.2187 123.477 24.336C123.69 24.4427 123.968 24.496 124.309 24.496C124.394 24.496 124.49 24.4907 124.597 24.48C124.704 24.4693 124.805 24.4587 124.901 24.448V26C124.752 26.0213 124.586 26.0427 124.405 26.064C124.224 26.0853 124.064 26.096 123.925 26.096Z" fill="url(#paint4_radial_65_1533)"/>
</g>
<defs>
<filter id="filter0_i_65_1533" x="0" y="0" width="138" height="38" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset/>
<feGaussianBlur stdDeviation="2"/>
<feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
<feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.15 0"/>
<feBlend mode="normal" in2="shape" result="effect1_innerShadow_65_1533"/>
</filter>
<radialGradient id="paint0_radial_65_1533" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(72.9655 93.9143) rotate(-104.568) scale(163.3 284.125)">
<stop stop-color="#3A951B"/>
<stop offset="1" stop-color="#1CDAF4"/>
</radialGradient>
<radialGradient id="paint1_radial_65_1533" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(16.5862 30.1643) rotate(-94.0932) scale(12.5096 6.36551)">
<stop stop-color="#3A951B"/>
<stop offset="1" stop-color="#1CDAF4"/>
</radialGradient>
<radialGradient id="paint2_radial_65_1533" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(18.3707 38.2) rotate(-92.4878) scale(43.713 13.5485)">
<stop stop-color="#3A951B"/>
<stop offset="1" stop-color="#1CDAF4"/>
</radialGradient>
<radialGradient id="paint3_radial_65_1533" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(22.8448 45.2607) rotate(-93.8532) scale(53.1502 25.4695)">
<stop stop-color="#3A951B"/>
<stop offset="1" stop-color="#1CDAF4"/>
</radialGradient>
<radialGradient id="paint4_radial_65_1533" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(83.5862 62.3714) rotate(-106.317) scale(95.3433 183.742)">
<stop stop-color="#3A951B"/>
<stop offset="1" stop-color="#1CDAF4"/>
</radialGradient>
</defs>
</svg>
  )}
// --- MAIN PAGE COMPONENT ---
const LeadMarketplacePage = () => {
    const [activeTab, setActiveTab] = useState('Buyer');
    const [view, setView] = useState('grid');
    const [leads, setLeads] = useState(initiallySelectedLeads);

    const selectedCount = leads.filter(lead => lead.selected).length;

    const handleToggleSelect = (leadId) => {
        setLeads(currentLeads =>
            currentLeads.map(lead =>
                lead.id === leadId ? { ...lead, selected: !lead.selected } : lead
            )
        );
    };

    const handleDeselectAll = () => {
        setLeads(currentLeads =>
            currentLeads.map(lead => ({ ...lead, selected: false }))
        );
    };

    return (
        <div className=" min-h-screen">
            <div className="p-8">
                {/* Tabs */}
                <div className="flex items-center space-x-8 mb-5">
                    <button
                        onClick={() => setActiveTab('Buyer')}
                        className={`text-base font-semibold pb-2 transition-colors duration-200 ${
                            activeTab === 'Buyer'
                                ? 'text-emerald-500 border-b-2 border-emerald-500'
                                : 'text-slate-600 hover:text-slate-800'
                        }`}
                    >
                        Buyer
                    </button>
                    <button
                        onClick={() => setActiveTab('Seller')}
                        className={`text-base font-semibold pb-2 transition-colors duration-200 ${
                            activeTab === 'Seller'
                                ? 'text-emerald-500 border-b-2 border-emerald-500'
                                : 'text-slate-600 hover:text-slate-800'
                        }`}
                    >
                        Seller
                    </button>
                </div>

                <div className="grid grid-cols-12 gap-8 items-start">
                    {/* Main Content Area */}
                    <main className="col-span-12 lg:col-span-8 xl:col-span-9">
                        {/* Page Header */}
                        <div className="flex items-center justify-between mb-5">
                              <div className="flex items-center gap-3">
                                                                <ShoppingBagIcon className="w-8 h-8" />

                                    <h1 className="text-[32px] font-semibold text-slate-800 leading-none tracking-normal">My Leads</h1>
                                </div>

                            {/* View Toggles */}
                            <div className="flex items-center space-x-1">
                                <button
                                    onClick={() => setView('list')}
                                    className={`p-2.5 rounded-full transition-colors duration-200 ${
                                        view === 'list' ? 'bg-emerald-100 text-emerald-600' : 'text-slate-400 hover:bg-slate-100'
                                    }`}
                                >
                                    <ListIcon className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setView('grid')}
                                    className={`p-2.5 rounded-full transition-colors duration-200 ${
                                        view === 'grid' ? 'bg-emerald-100 text-emerald-600' : 'text-slate-400 hover:bg-slate-100'
                                    }`}
                                >
                                    <GridIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                        
                        <FilterBar />

                        {/* --- CONDITIONAL VIEW: Grid or List --- */}
                        {view === 'grid' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {leads.map(lead => (
                                    <LeadCard 
                                        key={lead.id} 
                                        lead={lead} 
                                        onToggleSelect={handleToggleSelect} 
                                    />
                                ))}
                            </div>
                        ) : (
                            <LeadsListView leads={leads} onToggleSelect={handleToggleSelect} />
                        )}

                        {/* Bottom selection bar */}
 {/* Bottom selection bar */}
    {selectedCount > 0 && (
    <div className="sticky bottom-6 inset-x-6 z-10 flex justify-between items-center px-5 py-2.5 bg-white rounded-full shadow-2xl">
      <p className="pl-4 font-semibold text-neutral-600 whitespace-nowrap">
        {selectedCount} {selectedCount === 1 ? 'Lead' : 'Leads'} Selected
      </p>
      <div className="flex items-center gap-3">
        <DeselectAllButton />
        <AddtoCartButton />
      </div>
    </div>
    )}
                    </main>

                    {/* Right Sidebar Area */}
                    <aside className="col-span-12 lg:col-span-4 xl:col-span-3">
                        <RightSidebar />
                    </aside>
                </div>
            </div>
        </div>
    );
};
export default LeadMarketplacePage;