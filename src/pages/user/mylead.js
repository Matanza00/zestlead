'use client';
import React, { useState } from 'react';

// --- SVG ICONS (Embedded for simplicity) ---



const CardChevronDownIcon = (props) => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

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
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M16 6V5C16 3.34315 14.6569 2 13 2H11C9.34315 2 8 3.34315 8 5V6H4V19C4 20.6569 5.34315 22 7 22H17C18.6569 22 20 20.6569 20 19V6H16ZM10 6V5C10 4.44772 10.4477 4 11 4H13C13.5523 4 14 4.44772 14 5V6H10Z" fill="#34D399"/>
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


// --- UPDATED LEAD CARD COMPONENT (Replaces the old LeadCard and ContactCard) ---
// Add this new SVG component


const LeadCard = ({ lead, onToggleSelect }) => {
    // Stop event propagation for interactive elements inside the card
    const handleActionClick = (e) => {
        e.stopPropagation();
    };

    return (
        <div
            onClick={() => onToggleSelect(lead.id)}
            className="w-full bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 cursor-pointer transition-all duration-300 hover:shadow-xl"
        >
            <img
                src={lead.mapImageUrl}
                alt={`Map location for ${lead.name}`}
                className="w-full h-32 object-cover"
            />
            <div className="p-5">
                {/* Card Header */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-900">{lead.name}</h2>
                    <button
                        onClick={handleActionClick}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-100 text-cyan-700 rounded-full text-xs font-semibold transition hover:bg-cyan-200"
                    >
                        {lead.status}
                        <CardChevronDownIcon className="w-4 h-4" />
                    </button>
                </div>

                {/* Wrapper for all info fields */}
                <div>
                    {/* Info Grid with 4 columns and 13px row gap */}
                    <div className="grid grid-cols-4 gap-x-4 gap-y-[13px]">
                        <div>
                            <p className="text-sm font-bold text-gray-800">Phone</p>
                            <p className="text-sm text-gray-500 mt-1">{lead.phone}</p>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-800">Type</p>
                            <p className="text-sm text-gray-500 mt-1">{lead.type}</p>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-800">Area</p>
                            <p className="text-sm text-gray-500 mt-1">{lead.area}</p>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-800">Value</p>
                            <p className="text-sm text-gray-500 mt-1">{lead.value}</p>
                        </div>
                    </div>

                    {/* Address with 13px top margin to maintain consistent spacing */}
                    <div className="mt-[13px]">
                        <p className="text-sm font-bold text-gray-800">Address</p>
                        <p className="text-sm text-gray-500 mt-1">{lead.address}</p>
                    </div>
                </div>

                {/* Card Footer Actions with 20px top margin */}
                <div className="flex justify-between items-center mt-5">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={(e) => { e.stopPropagation(); onToggleSelect(lead.id); }}>
                        {lead.selected ? <CheckmarkIcon /> : <EmptyCheckboxIcon />}
                        <label className={`text-sm font-semibold cursor-pointer ${lead.selected ? 'text-green-600' : 'text-gray-500'}`}>
                            Select
                        </label>
                    </div>
                    {/* New SVG Button */}
                    <button
                        onClick={handleActionClick}
                        className="transition-transform duration-200 hover:scale-105"
                    >
                        <CallNowButtonSVG />
                    </button>
                </div>
            </div>
        </div>
    );
};
 // --- COMPONENT UPDATED WITH NEW TEXT STYLING ---
const ContactCard = ({ contact }) => (
    <div className="max-w-sm w-full bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        
        {/* Map Image */}
        <img 
            src={contact.mapImageUrl} 
            alt={`Map location for ${contact.name}`}
            className="w-full h-auto object-cover" 
        />

        {/* Content Area */}
        <div className="p-5">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">{contact.name}</h2>
                <button className="flex items-center gap-1.5 px-3.5 py-2 bg-cyan-100 text-cyan-800 rounded-full text-sm font-semibold transition hover:bg-cyan-200">
                    Contacted
                    {/* <CardChevronDownIcon className="w-4 h-4" /> */}
                </button>
            </div>

            {/* Info Grid - Styling updated from LeadCard */}
            <div className="grid grid-cols-3 gap-x-4 gap-y-5 mb-5">
                <div>
                    <p className="text-sm font-bold text-gray-800">Phone</p>
                    <p className="text-sm text-gray-500 mt-1">{contact.phone}</p>
                </div>
                <div>
                    <p className="text-sm font-bold text-gray-800">Type</p>
                    <p className="text-sm text-gray-500 mt-1">{contact.type}</p>
                </div>
                <div>
                    <p className="text-sm font-bold text-gray-800">Area</p>
                    <p className="text-sm text-gray-500 mt-1">{contact.area}</p>
                </div>
                <div>
                    <p className="text-sm font-bold text-gray-800">Value</p>
                    <p className="text-sm text-gray-500 mt-1">{contact.value}</p>
                </div>
            </div>

            {/* Address - Styling updated from LeadCard */}
            <div className="mb-6">
                <p className="text-sm font-bold text-gray-800">Address</p>
                <p className="text-sm text-gray-500 mt-1">{contact.address}</p>
            </div>

            {/* Actions Footer - Styling updated from LeadCard */}
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <input 
                        id={`select-${contact.id}`}
                        type="checkbox" 
                        defaultChecked
                        className="h-5 w-5 rounded border-gray-400 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <label htmlFor={`select-${contact.id}`} className="font-semibold text-gray-500 text-sm cursor-pointer">
                        Select
                    </label>
                </div>
                <button className="transition hover:opacity-90">
                    {/* <CallNowButtonSVG /> */}
                </button>
            </div>
        </div>
    </div>
);

// --- UPDATED MOCK DATA ---
const mockLeads = [
    {
      id: 1,
      name: 'Bob Smith',
      phone: '+1 (415) 555 1234',
      address: '456-Oak Avenue, Springfield, California, 90210',
      area: 'California',
      type: 'House',
      value: '$60K-120K',
      status: 'Contacted',
      mapImageUrl: 'https://i.imgur.com/2t6p2u1.png',
      selected: true,
    },
    {
      id: 2,
      name: 'Catherine Lee',
      phone: '+1 (202) 555 5678',
      address: '789 Pine Street, Washington, D.C., 20001',
      area: 'Columbia',
      type: 'Condo',
      value: '$70K-140K',
      status: 'Not Contacted',
      mapImageUrl: 'https://i.imgur.com/2t6p2u1.png',
      selected: true,
    },
    {
      id: 3,
      name: 'David Brown',
      phone: '+1 (305) 555 2345',
      address: '321 Maple Drive, Miami, Florida, 33101',
      area: 'Florida',
      type: 'Townhouse',
      value: '$90K-180K',
      status: 'Closed',
      mapImageUrl: 'https://i.imgur.com/2t6p2u1.png',
      selected: false,
    },
    {
      id: 4,
      name: 'Emily White',
      phone: '+1 (503) 555 6789',
      address: '654 Cedar Lane, Portland, Oregon, 97201',
      area: 'Oregon',
      type: 'Apartment',
      value: '$50K-100K',
      status: 'Contacted',
      mapImageUrl: 'https://i.imgur.com/2t6p2u1.png',
      selected: false,
    },
    {
      id: 5,
      name: 'Frank Green',
      phone: '+1 (720) 555 3456',
      address: '987 Birch Road, Denver, Colorado, 80201',
      area: 'Colorado',
      type: 'House',
      value: '$110K-200K',
      status: 'Not Contacted',
      mapImageUrl: 'https://i.imgur.com/2t6p2u1.png',
      selected: false,
    },
     {
      id: 6,
      name: 'Grace Taylor',
      phone: '+1 (408) 555 7891',
      address: '135 Walnut Street, San Jose, California, 95101',
      area: 'California',
      type: 'Condo',
      value: '$85K-170K',
      status: 'Closed',
      mapImageUrl: 'https://i.imgur.com/2t6p2u1.png',
      selected: false,
    },
    {
      id: 7,
      name: 'Henry Martinez',
      phone: '+1 (214) 555 1235',
      address: '246 Chestnut Way, Dallas, Texas, 75201',
      area: 'Texas',
      type: 'Townhouse',
      value: '$95K-190K',
      status: 'Contacted',
      mapImageUrl: 'https://i.imgur.com/2t6p2u1.png',
      selected: false,
    },
];

const initiallySelectedLeads = mockLeads; 


// --- LIST VIEW COMPONENTS (UPDATED) ---

const CallNowButtonSVG = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="116" height="38" viewBox="0 0 116 38" fill="none" {...props}>
        <g filter="url(#filter0_i_69_3106)">
            <rect x="0.5" y="0.5" width="115" height="37" rx="18.5" stroke="url(#paint0_radial_69_3106)"/>
            <path d="M23.25 15.25C23.6478 15.25 24.0294 15.408 24.3107 15.6893C24.592 15.9706 24.75 16.3522 24.75 16.75M23.25 12.25C24.4435 12.25 25.5881 12.7241 26.432 13.568C27.2759 14.4119 27.75 15.5565 27.75 16.75M15.75 13H18.75L20.25 16.75L18.375 17.875C19.1782 19.5036 20.4964 20.8218 22.125 21.625L23.25 19.75L27 21.25V24.25C27 24.6478 26.842 25.0294 26.5607 25.3107C26.2794 25.592 25.8978 25.75 25.5 25.75C22.5744 25.5722 19.8151 24.3299 17.7426 22.2574C15.6701 20.1849 14.4278 17.4256 14.25 14.5C14.25 14.1022 14.408 13.7206 14.6893 13.4393C14.9706 13.158 15.3522 13 15.75 13Z" stroke="url(#paint1_radial_69_3106)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M42.784 26.192C41.9413 26.192 41.1573 26.0373 40.432 25.728C39.7173 25.4187 39.0933 24.992 38.56 24.448C38.0373 23.8933 37.6267 23.2427 37.328 22.496C37.0293 21.7493 36.88 20.928 36.88 20.032C36.88 19.1467 37.024 18.3307 37.312 17.584C37.6107 16.8267 38.0267 16.176 38.56 15.632C39.0933 15.0773 39.7173 14.6507 40.432 14.352C41.1467 14.0427 41.9307 13.888 42.784 13.888C43.6267 13.888 44.3787 14.032 45.04 14.32C45.712 14.608 46.2773 14.9867 46.736 15.456C47.1947 15.9147 47.5253 16.416 47.728 16.96L46.032 17.76C45.776 17.12 45.3653 16.6027 44.8 16.208C44.2453 15.8027 43.5733 15.6 42.784 15.6C41.9947 15.6 41.296 15.7867 40.688 16.16C40.08 16.5333 39.6053 17.0507 39.264 17.712C38.9333 18.3733 38.768 19.1467 38.768 20.032C38.768 20.9173 38.9333 21.696 39.264 22.368C39.6053 23.0293 40.08 23.5467 40.688 23.92C41.296 24.2827 41.9947 24.464 42.784 24.464C43.5733 24.464 44.2453 24.2667 44.8 23.872C45.3653 23.4773 45.776 22.96 46.032 22.32L47.728 23.12C47.5253 23.6533 47.1947 24.1547 46.736 24.624C46.2773 25.0933 45.712 25.472 45.04 25.76C44.3787 26.048 43.6267 26.192 42.784 26.192ZM51.9293 26.192C51.3426 26.192 50.8253 26.0907 50.3773 25.888C49.9399 25.6747 49.5986 25.3867 49.3533 25.024C49.1079 24.6507 48.9853 24.2133 48.9853 23.712C48.9853 23.2427 49.0866 22.8213 49.2893 22.448C49.5026 22.0747 49.8279 21.76 50.2653 21.504C50.7026 21.248 51.2519 21.0667 51.9133 20.96L54.9213 20.464V21.888L52.2653 22.352C51.7853 22.4373 51.4333 22.592 51.2093 22.816C50.9853 23.0293 50.8733 23.3067 50.8733 23.648C50.8733 23.9787 50.9959 24.2507 51.2413 24.464C51.4973 24.6667 51.8226 24.768 52.2173 24.768C52.7079 24.768 53.1346 24.6613 53.4973 24.448C53.8706 24.2347 54.1586 23.952 54.3613 23.6C54.5639 23.2373 54.6653 22.8373 54.6653 22.4V20.176C54.6653 19.7493 54.5053 19.4027 54.1853 19.136C53.8759 18.8587 53.4599 18.72 52.9373 18.72C52.4573 18.72 52.0359 18.848 51.6733 19.104C51.3213 19.3493 51.0599 19.6693 50.8893 20.064L49.3853 19.312C49.5453 18.8853 49.8066 18.512 50.1693 18.192C50.5319 17.8613 50.9533 17.6053 51.4333 17.424C51.9239 17.2427 52.4413 17.152 52.9852 17.152C53.6679 17.152 54.2706 17.28 54.7933 17.536C55.3266 17.792 55.7373 18.1493 56.0253 18.608C56.3239 19.056 56.4733 19.5787 56.4733 20.176V26H54.7453V24.432L55.1133 24.48C54.9106 24.832 54.6493 25.136 54.3293 25.392C54.0199 25.648 53.6626 25.8453 53.2573 25.984C52.8626 26.1227 52.4199 26.192 51.9293 26.192ZM58.5872 26V13.888H60.3953V26H58.5872ZM62.5091 26V13.888H64.3171V26H62.5091ZM69.4039 26V14.08H70.9239L77.6119 23.312L76.8919 23.424V14.08H78.7639V26H77.2439L70.6039 16.704L71.2919 16.576V26H69.4039ZM85.232 26.192C84.4 26.192 83.6373 25.9947 82.944 25.6C82.2613 25.2053 81.7173 24.6667 81.312 23.984C80.9067 23.3013 80.704 22.528 80.704 21.664C80.704 20.7893 80.9067 20.016 81.312 19.344C81.7173 18.6613 82.2613 18.128 82.944 17.744C83.6267 17.3493 84.3893 17.152 85.232 17.152C86.0853 17.152 86.848 17.3493 87.52 17.744C88.2027 18.128 88.7413 18.6613 89.136 19.344C89.5413 20.016 89.744 20.7893 89.744 21.664C89.744 22.5387 89.5413 23.3173 89.136 24C88.7307 24.6827 88.1867 25.2213 87.504 25.616C86.8213 26 86.064 26.192 85.232 26.192ZM85.232 24.512C85.744 24.512 86.1973 24.3893 86.592 24.144C86.9867 23.8987 87.296 23.5627 87.52 23.136C87.7547 22.6987 87.872 22.208 87.872 21.664C87.872 21.12 87.7547 20.6347 87.52 20.208C87.296 19.7813 86.9867 19.4453 86.592 19.2C86.1973 18.9547 85.744 18.832 85.232 18.832C84.7307 18.832 84.2773 18.9547 83.872 19.2C83.4773 19.4453 83.1627 19.7813 82.928 20.208C82.704 20.6347 82.592 21.12 82.592 21.664C82.592 22.208 82.704 22.6987 82.928 23.136C83.1627 23.5627 83.4773 23.8987 83.872 24.144C84.2773 24.3893 84.7307 24.512 85.232 24.512ZM93.4489 26L90.4729 17.344H92.3929L94.6649 24.24H93.9929L96.3129 17.344H97.9609L100.265 24.24H99.5929L101.881 17.344H103.801L100.809 26H99.1769L96.8409 18.944H97.4329L95.0969 26H93.4489Z" fill="url(#paint2_radial_69_3106)"/>
        </g>
        <defs>
            <filter id="filter0_i_69_3106" x="0" y="0" width="116" height="38" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                <feOffset/>
                <feGaussianBlur stdDeviation="2"/>
                <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.15 0"/>
                <feBlend mode="normal" in2="shape" result="effect1_innerShadow_69_3106"/>
            </filter>
            <radialGradient id="paint0_radial_69_3106" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(61.3333 93.9143) rotate(-102.323) scale(161.778 241.077)">
                <stop stop-color="#3A951B"/>
                <stop offset="1" stop-color="#1CDAF4"/>
            </radialGradient>
            <radialGradient id="paint1_radial_69_3106" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(21.3879 45.6143) rotate(-94.0932) scale(56.2931 28.6448)">
                <stop stop-color="#3A951B"/>
                <stop offset="1" stop-color="#1CDAF4"/>
            </radialGradient>
            <radialGradient id="paint2_radial_69_3106" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(71.954 62.3714) rotate(-102.472) scale(93.7145 141.24)">
                <stop stop-color="#3A951B"/>
                <stop offset="1" stop-color="#1CDAF4"/>
            </radialGradient>
        </defs>
    </svg>
);

const LeadListItem = ({ lead, onToggleSelect }) => (
    <tr
        onClick={() => onToggleSelect(lead.id)}
        className="border-b border-gray-200/50 hover:bg-gray-50/50 transition-colors cursor-pointer"
    >
        <td className="p-4 pl-4 align-middle">
            {lead.selected ? <CheckmarkIcon /> : <EmptyCheckboxIcon />}
        </td>
        <td className="p-2 align-middle font-medium text-sm text-gray-800 whitespace-nowrap">{lead.name}</td>
        <td className="p-2 align-middle text-sm text-gray-600 whitespace-nowrap">{lead.phone}</td>
        <td className="p-2 align-middle text-sm text-gray-600 truncate max-w-xs">{lead.address}</td>
        <td className="p-2 align-middle text-sm text-gray-600 whitespace-nowrap">{lead.area}</td>
        <td className="p-2 align-middle text-sm text-gray-600 whitespace-nowrap">{lead.type}</td>
        <td className="p-2 align-middle text-sm text-gray-600 whitespace-nowrap font-semibold">{lead.value}</td>
        <td className="p-2 align-middle text-sm text-gray-600 whitespace-nowrap">{lead.status}</td>
        <td className="p-2 pr-4 text-right align-middle">
             <button
                onClick={(e) => {
                    e.stopPropagation();
                    console.log(`Call Now clicked for lead: ${lead.id}`);
                }}
                className="transition-transform duration-200 hover:scale-105"
            >
                <CallNowButtonSVG />
            </button>
        </td>
    </tr>
);


const LeadsListView = ({ leads, onToggleSelect }) => (
    <div className="rounded-lg border bg-white shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
            <thead>
                <tr className="border-b border-gray-200/50 bg-gray-50/50">
                    <th className="p-4 pl-4 text-left"><span className="sr-only">Select</span></th>
                    <th className="p-2 text-left font-semibold text-gray-600 text-xs uppercase tracking-wider">Name</th>
                    <th className="p-2 text-left font-semibold text-gray-600 text-xs uppercase tracking-wider">Phone</th>
                    <th className="p-2 text-left font-semibold text-gray-600 text-xs uppercase tracking-wider">Address</th>
                    <th className="p-2 text-left font-semibold text-gray-600 text-xs uppercase tracking-wider">Area</th>
                    <th className="p-2 text-left font-semibold text-gray-600 text-xs uppercase tracking-wider">Type</th>
                    <th className="p-2 text-left font-semibold text-gray-600 text-xs uppercase tracking-wider">Property Price</th>
                    <th className="p-2 text-left font-semibold text-gray-600 text-xs uppercase tracking-wider">Status</th>
                    <th className="p-4 pr-4 text-right"><span className="sr-only">Action</span></th>
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

// A small component just for the icon
const MarkAsClosedIcon = () => (
<svg xmlns="http://www.w3.org/2000/svg" width="12" height="16" viewBox="0 0 12 16" fill="none">
<path d="M3.75 2.75H2.25C1.85218 2.75 1.47064 2.90804 1.18934 3.18934C0.908035 3.47064 0.75 3.85218 0.75 4.25V13.25C0.75 13.6478 0.908035 14.0294 1.18934 14.3107C1.47064 14.592 1.85218 14.75 2.25 14.75H9.75C10.1478 14.75 10.5294 14.592 10.8107 14.3107C11.092 14.0294 11.25 13.6478 11.25 13.25V4.25C11.25 3.85218 11.092 3.47064 10.8107 3.18934C10.5294 2.90804 10.1478 2.75 9.75 2.75H8.25" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M3.75 9.5H3.7575M3.75 11.75H3.7575M6 11L6.75 11.75L9 9.5M3.75 2.75C3.75 2.35218 3.90804 1.97064 4.18934 1.68934C4.47064 1.40804 4.85218 1.25 5.25 1.25H6.75C7.14782 1.25 7.52936 1.40804 7.81066 1.68934C8.09196 1.97064 8.25 2.35218 8.25 2.75C8.25 3.14782 8.09196 3.52936 7.81066 3.81066C7.52936 4.09196 7.14782 4.25 6.75 4.25H5.25C4.85218 4.25 4.47064 4.09196 4.18934 3.81066C3.90804 3.52936 3.75 3.14782 3.75 2.75Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
);
const MarkAsClosedButton = ({ onClick }) => {
  const buttonStyle = {
    background: 'radial-gradient(187.72% 415.92% at 52.87% 247.14%, #3A951B 0%, #1CDAF4 100%)',
    border: '1px solid #FFFFFF26',
    boxShadow: '0px 0px 4px 0px #FFFFFF26 inset',
  };

  return (
    <button
      onClick={onClick}
      style={buttonStyle}
      className="flex items-center gap-2 rounded-full px-5 py-2 text-base font-semibold text-white"
    >
      <MarkAsClosedIcon />
      <span>Mark as Closed</span>
    </button>
  );
};
// A small component just for the icon
const MarkAsContactedIcon = () => (


<svg xmlns="http://www.w3.org/2000/svg" width="194" height="38" viewBox="0 0 194 38" fill="none">

<g filter="url(#filter0_i_69_2231)">

<rect x="0.5" y="0.5" width="193" height="37" rx="18.5" stroke="url(#paint0_radial_69_2231)"/>

<path d="M23.25 15.25C23.6478 15.25 24.0294 15.408 24.3107 15.6893C24.592 15.9706 24.75 16.3522 24.75 16.75M23.25 12.25C24.4435 12.25 25.5881 12.7241 26.432 13.568C27.2759 14.4119 27.75 15.5565 27.75 16.75M15.75 13H18.75L20.25 16.75L18.375 17.875C19.1782 19.5036 20.4964 20.8218 22.125 21.625L23.25 19.75L27 21.25V24.25C27 24.6478 26.842 25.0294 26.5607 25.3107C26.2794 25.592 25.8978 25.75 25.5 25.75C22.5744 25.5722 19.8151 24.3299 17.7426 22.2574C15.6701 20.1849 14.4278 17.4256 14.25 14.5C14.25 14.1022 14.408 13.7206 14.6893 13.4393C14.9706 13.158 15.3522 13 15.75 13Z" stroke="url(#paint1_radial_69_2231)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>

<path d="M37.232 26V14.08H38.992L43.472 20.288H42.592L46.992 14.08H48.752V26H46.88V16.304L47.584 16.496L43.088 22.64H42.896L38.496 16.496L39.12 16.304V26H37.232ZM53.6324 26.192C53.0457 26.192 52.5284 26.0907 52.0804 25.888C51.643 25.6747 51.3017 25.3867 51.0564 25.024C50.811 24.6507 50.6884 24.2133 50.6884 23.712C50.6884 23.2427 50.7897 22.8213 50.9924 22.448C51.2057 22.0747 51.531 21.76 51.9684 21.504C52.4057 21.248 52.955 21.0667 53.6164 20.96L56.6244 20.464V21.888L53.9684 22.352C53.4884 22.4373 53.1364 22.592 52.9124 22.816C52.6884 23.0293 52.5764 23.3067 52.5764 23.648C52.5764 23.9787 52.699 24.2507 52.9444 24.464C53.2004 24.6667 53.5257 24.768 53.9204 24.768C54.411 24.768 54.8377 24.6613 55.2004 24.448C55.5737 24.2347 55.8617 23.952 56.0644 23.6C56.267 23.2373 56.3684 22.8373 56.3684 22.4V20.176C56.3684 19.7493 56.2084 19.4027 55.8884 19.136C55.579 18.8587 55.163 18.72 54.6404 18.72C54.1604 18.72 53.739 18.848 53.3764 19.104C53.0244 19.3493 52.763 19.6693 52.5924 20.064L51.0884 19.312C51.2484 18.8853 51.5097 18.512 51.8724 18.192C52.235 17.8613 52.6564 17.6053 53.1364 17.424C53.627 17.2427 54.1444 17.152 54.6884 17.152C55.371 17.152 55.9737 17.28 56.4964 17.536C57.0297 17.792 57.4404 18.1493 57.7284 18.608C58.027 19.056 58.1764 19.5787 58.1764 20.176V26H56.4484V24.432L56.8164 24.48C56.6137 24.832 56.3524 25.136 56.0324 25.392C55.723 25.648 55.3657 25.8453 54.9604 25.984C54.5657 26.1227 54.123 26.192 53.6324 26.192ZM60.2904 26V17.344H62.0184V19.088L61.8584 18.832C62.0504 18.2667 62.3597 17.8613 62.7864 17.616C63.213 17.36 63.725 17.232 64.3224 17.232H64.8504V18.88H64.0984C63.501 18.88 63.0157 19.0667 62.6424 19.44C62.2797 19.8027 62.0984 20.3253 62.0984 21.008V26H60.2904ZM66.0872 26V13.888H67.8953V22L67.1913 21.824L71.5273 17.344H73.7833L70.5193 20.816L73.9273 26H71.8473L68.8073 21.408L69.8793 21.264L67.3193 23.984L67.8953 22.784V26H66.0872ZM80.5543 26.192C79.9676 26.192 79.4503 26.0907 79.0023 25.888C78.5649 25.6747 78.2236 25.3867 77.9783 25.024C77.7329 24.6507 77.6103 24.2133 77.6103 23.712C77.6103 23.2427 77.7116 22.8213 77.9143 22.448C78.1276 22.0747 78.4529 21.76 78.8903 21.504C79.3276 21.248 79.8769 21.0667 80.5383 20.96L83.5463 20.464V21.888L80.8903 22.352C80.4103 22.4373 80.0583 22.592 79.8343 22.816C79.6103 23.0293 79.4983 23.3067 79.4983 23.648C79.4983 23.9787 79.6209 24.2507 79.8663 24.464C80.1223 24.6667 80.4476 24.768 80.8423 24.768C81.3329 24.768 81.7596 24.6613 82.1223 24.448C82.4956 24.2347 82.7836 23.952 82.9863 23.6C83.1889 23.2373 83.2903 22.8373 83.2903 22.4V20.176C83.2903 19.7493 83.1303 19.4027 82.8103 19.136C82.5009 18.8587 82.0849 18.72 81.5623 18.72C81.0823 18.72 80.6609 18.848 80.2983 19.104C79.9463 19.3493 79.6849 19.6693 79.5143 20.064L78.0103 19.312C78.1703 18.8853 78.4316 18.512 78.7943 18.192C79.1569 17.8613 79.5783 17.6053 80.0583 17.424C80.5489 17.2427 81.0663 17.152 81.6102 17.152C82.2929 17.152 82.8956 17.28 83.4183 17.536C83.9516 17.792 84.3623 18.1493 84.6503 18.608C84.9489 19.056 85.0983 19.5787 85.0983 20.176V26H83.3703V24.432L83.7383 24.48C83.5356 24.832 83.2743 25.136 82.9543 25.392C82.6449 25.648 82.2876 25.8453 81.8823 25.984C81.4876 26.1227 81.0449 26.192 80.5543 26.192ZM90.4123 26.192C89.5269 26.192 88.7483 25.9733 88.0763 25.536C87.4149 25.0987 86.9509 24.512 86.6842 23.776L88.0763 23.12C88.3109 23.6107 88.6309 24 89.0363 24.288C89.4523 24.576 89.9109 24.72 90.4123 24.72C90.8389 24.72 91.1856 24.624 91.4523 24.432C91.7189 24.24 91.8523 23.9787 91.8523 23.648C91.8523 23.4347 91.7936 23.264 91.6763 23.136C91.5589 22.9973 91.4096 22.8853 91.2283 22.8C91.0576 22.7147 90.8816 22.6507 90.7003 22.608L89.3403 22.224C88.5936 22.0107 88.0336 21.6907 87.6603 21.264C87.2976 20.8267 87.1163 20.32 87.1163 19.744C87.1163 19.2213 87.2496 18.768 87.5163 18.384C87.7829 17.9893 88.1509 17.6853 88.6203 17.472C89.0896 17.2587 89.6176 17.152 90.2043 17.152C90.9936 17.152 91.6976 17.3493 92.3163 17.744C92.9349 18.128 93.3723 18.6667 93.6283 19.36L92.2363 20.016C92.0656 19.6 91.7936 19.2693 91.4203 19.024C91.0576 18.7787 90.6469 18.656 90.1883 18.656C89.7936 18.656 89.4789 18.752 89.2443 18.944C89.0096 19.1253 88.8923 19.3653 88.8923 19.664C88.8923 19.8667 88.9456 20.0373 89.0523 20.176C89.1589 20.304 89.2976 20.4107 89.4683 20.496C89.6389 20.5707 89.8149 20.6347 89.9963 20.688L91.4043 21.104C92.1189 21.3067 92.6683 21.6267 93.0523 22.064C93.4363 22.4907 93.6283 23.0027 93.6283 23.6C93.6283 24.112 93.4896 24.5653 93.2123 24.96C92.9456 25.344 92.5723 25.648 92.0923 25.872C91.6123 26.0853 91.0523 26.192 90.4123 26.192ZM103.925 26.192C103.082 26.192 102.298 26.0373 101.573 25.728C100.858 25.4187 100.234 24.992 99.7006 24.448C99.178 23.8933 98.7673 23.2427 98.4686 22.496C98.17 21.7493 98.0206 20.928 98.0206 20.032C98.0206 19.1467 98.1646 18.3307 98.4526 17.584C98.7513 16.8267 99.1673 16.176 99.7006 15.632C100.234 15.0773 100.858 14.6507 101.573 14.352C102.287 14.0427 103.071 13.888 103.925 13.888C104.767 13.888 105.519 14.032 106.181 14.32C106.853 14.608 107.418 14.9867 107.877 15.456C108.335 15.9147 108.666 16.416 108.869 16.96L107.173 17.76C106.917 17.12 106.506 16.6027 105.941 16.208C105.386 15.8027 104.714 15.6 103.925 15.6C103.135 15.6 102.437 15.7867 101.829 16.16C101.221 16.5333 100.746 17.0507 100.405 17.712C100.074 18.3733 99.9086 19.1467 99.9086 20.032C99.9086 20.9173 100.074 21.696 100.405 22.368C100.746 23.0293 101.221 23.5467 101.829 23.92C102.437 24.2827 103.135 24.464 103.925 24.464C104.714 24.464 105.386 24.2667 105.941 23.872C106.506 23.4773 106.917 22.96 107.173 22.32L108.869 23.12C108.666 23.6533 108.335 24.1547 107.877 24.624C107.418 25.0933 106.853 25.472 106.181 25.76C105.519 26.048 104.767 26.192 103.925 26.192ZM114.654 26.192C113.822 26.192 113.059 25.9947 112.366 25.6C111.683 25.2053 111.139 24.6667 110.734 23.984C110.329 23.3013 110.126 22.528 110.126 21.664C110.126 20.7893 110.329 20.016 110.734 19.344C111.139 18.6613 111.683 18.128 112.366 17.744C113.049 17.3493 113.811 17.152 114.654 17.152C115.507 17.152 116.27 17.3493 116.942 17.744C117.625 18.128 118.163 18.6613 118.558 19.344C118.963 20.016 119.166 20.7893 119.166 21.664C119.166 22.5387 118.963 23.3173 118.558 24C118.153 24.6827 117.609 25.2213 116.926 25.616C116.243 26 115.486 26.192 114.654 26.192ZM114.654 24.512C115.166 24.512 115.619 24.3893 116.014 24.144C116.409 23.8987 116.718 23.5627 116.942 23.136C117.177 22.6987 117.294 22.208 117.294 21.664C117.294 21.12 117.177 20.6347 116.942 20.208C116.718 19.7813 116.409 19.4453 116.014 19.2C115.619 18.9547 115.166 18.832 114.654 18.832C114.153 18.832 113.699 18.9547 113.294 19.2C112.899 19.4453 112.585 19.7813 112.35 20.208C112.126 20.6347 112.014 21.12 112.014 21.664C112.014 22.208 112.126 22.6987 112.35 23.136C112.585 23.5627 112.899 23.8987 113.294 24.144C113.699 24.3893 114.153 24.512 114.654 24.512ZM120.931 26V17.344H122.659V19.04L122.451 18.816C122.664 18.272 123.006 17.8613 123.475 17.584C123.944 17.296 124.488 17.152 125.107 17.152C125.747 17.152 126.312 17.2907 126.803 17.568C127.294 17.8453 127.678 18.2293 127.955 18.72C128.232 19.2107 128.371 19.776 128.371 20.416V26H126.579V20.896C126.579 20.4587 126.499 20.0907 126.339 19.792C126.179 19.4827 125.95 19.248 125.651 19.088C125.363 18.9173 125.032 18.832 124.659 18.832C124.286 18.832 123.95 18.9173 123.651 19.088C123.363 19.248 123.139 19.4827 122.979 19.792C122.819 20.1013 122.739 20.4693 122.739 20.896V26H120.931ZM134.05 26.096C133.143 26.096 132.439 25.84 131.938 25.328C131.437 24.816 131.186 24.096 131.186 23.168V18.976H129.666V17.344H129.906C130.311 17.344 130.626 17.2267 130.85 16.992C131.074 16.7573 131.186 16.4373 131.186 16.032V15.36H132.994V17.344H134.962V18.976H132.994V23.088C132.994 23.3867 133.042 23.6427 133.138 23.856C133.234 24.0587 133.389 24.2187 133.602 24.336C133.815 24.4427 134.093 24.496 134.434 24.496C134.519 24.496 134.615 24.4907 134.722 24.48C134.829 24.4693 134.93 24.4587 135.026 24.448V26C134.877 26.0213 134.711 26.0427 134.53 26.064C134.349 26.0853 134.189 26.096 134.05 26.096ZM139.304 26.192C138.718 26.192 138.2 26.0907 137.752 25.888C137.315 25.6747 136.974 25.3867 136.728 25.024C136.483 24.6507 136.36 24.2133 136.36 23.712C136.36 23.2427 136.462 22.8213 136.664 22.448C136.878 22.0747 137.203 21.76 137.64 21.504C138.078 21.248 138.627 21.0667 139.288 20.96L142.296 20.464V21.888L139.64 22.352C139.16 22.4373 138.808 22.592 138.584 22.816C138.36 23.0293 138.248 23.3067 138.248 23.648C138.248 23.9787 138.371 24.2507 138.616 24.464C138.872 24.6667 139.198 24.768 139.592 24.768C140.083 24.768 140.51 24.6613 140.872 24.448C141.246 24.2347 141.534 23.952 141.736 23.6C141.939 23.2373 142.04 22.8373 142.04 22.4V20.176C142.04 19.7493 141.88 19.4027 141.56 19.136C141.251 18.8587 140.835 18.72 140.312 18.72C139.832 18.72 139.411 18.848 139.048 19.104C138.696 19.3493 138.435 19.6693 138.264 20.064L136.76 19.312C136.92 18.8853 137.182 18.512 137.544 18.192C137.907 17.8613 138.328 17.6053 138.808 17.424C139.299 17.2427 139.816 17.152 140.36 17.152C141.043 17.152 141.646 17.28 142.168 17.536C142.702 17.792 143.112 18.1493 143.4 18.608C143.699 19.056 143.848 19.5787 143.848 20.176V26H142.12V24.432L142.488 24.48C142.286 24.832 142.024 25.136 141.704 25.392C141.395 25.648 141.038 25.8453 140.632 25.984C140.238 26.1227 139.795 26.192 139.304 26.192ZM150.074 26.192C149.21 26.192 148.442 25.9947 147.77 25.6C147.109 25.1947 146.581 24.6507 146.186 23.968C145.802 23.2853 145.61 22.512 145.61 21.648C145.61 20.7947 145.802 20.0267 146.186 19.344C146.57 18.6613 147.098 18.128 147.77 17.744C148.442 17.3493 149.21 17.152 150.074 17.152C150.661 17.152 151.21 17.2587 151.722 17.472C152.234 17.6747 152.677 17.9573 153.05 18.32C153.434 18.6827 153.717 19.104 153.898 19.584L152.314 20.32C152.133 19.872 151.84 19.5147 151.434 19.248C151.04 18.9707 150.586 18.832 150.074 18.832C149.584 18.832 149.141 18.9547 148.746 19.2C148.362 19.4347 148.058 19.7707 147.834 20.208C147.61 20.6347 147.498 21.12 147.498 21.664C147.498 22.208 147.61 22.6987 147.834 23.136C148.058 23.5627 148.362 23.8987 148.746 24.144C149.141 24.3893 149.584 24.512 150.074 24.512C150.597 24.512 151.05 24.3787 151.434 24.112C151.829 23.8347 152.122 23.4667 152.314 23.008L153.898 23.76C153.728 24.2187 153.45 24.6347 153.066 25.008C152.693 25.3707 152.25 25.6587 151.738 25.872C151.226 26.0853 150.672 26.192 150.074 26.192ZM159.409 26.096C158.503 26.096 157.799 25.84 157.297 25.328C156.796 24.816 156.545 24.096 156.545 23.168V18.976H155.025V17.344H155.265C155.671 17.344 155.985 17.2267 156.209 16.992C156.433 16.7573 156.545 16.4373 156.545 16.032V15.36H158.353V17.344H160.321V18.976H158.353V23.088C158.353 23.3867 158.401 23.6427 158.497 23.856C158.593 24.0587 158.748 24.2187 158.961 24.336C159.175 24.4427 159.452 24.496 159.793 24.496C159.879 24.496 159.975 24.4907 160.081 24.48C160.188 24.4693 160.289 24.4587 160.385 24.448V26C160.236 26.0213 160.071 26.0427 159.889 26.064C159.708 26.0853 159.548 26.096 159.409 26.096ZM166.058 26.192C165.194 26.192 164.426 25.9947 163.754 25.6C163.092 25.1947 162.575 24.6507 162.202 23.968C161.828 23.2747 161.642 22.5013 161.642 21.648C161.642 20.7733 161.828 20 162.202 19.328C162.586 18.656 163.098 18.128 163.738 17.744C164.378 17.3493 165.103 17.152 165.914 17.152C166.564 17.152 167.146 17.264 167.658 17.488C168.17 17.712 168.602 18.0213 168.954 18.416C169.306 18.8 169.572 19.2427 169.753 19.744C169.946 20.2453 170.042 20.7787 170.042 21.344C170.042 21.4827 170.036 21.6267 170.026 21.776C170.015 21.9253 169.994 22.064 169.962 22.192H163.066V20.752H168.938L168.074 21.408C168.18 20.8853 168.143 20.4213 167.962 20.016C167.791 19.6 167.524 19.2747 167.162 19.04C166.81 18.7947 166.394 18.672 165.914 18.672C165.434 18.672 165.007 18.7947 164.634 19.04C164.26 19.2747 163.972 19.616 163.77 20.064C163.567 20.5013 163.487 21.0347 163.53 21.664C163.476 22.2507 163.556 22.7627 163.77 23.2C163.994 23.6373 164.303 23.9787 164.698 24.224C165.103 24.4693 165.562 24.592 166.074 24.592C166.596 24.592 167.039 24.4747 167.402 24.24C167.775 24.0053 168.068 23.7013 168.282 23.328L169.753 24.048C169.583 24.4533 169.316 24.8213 168.954 25.152C168.602 25.472 168.175 25.728 167.674 25.92C167.183 26.1013 166.644 26.192 166.058 26.192ZM175.806 26.192C174.974 26.192 174.227 25.9947 173.566 25.6C172.915 25.1947 172.398 24.6507 172.014 23.968C171.641 23.2853 171.454 22.5173 171.454 21.664C171.454 20.8107 171.646 20.0427 172.03 19.36C172.414 18.6773 172.931 18.1387 173.582 17.744C174.233 17.3493 174.969 17.152 175.79 17.152C176.483 17.152 177.097 17.2907 177.63 17.568C178.163 17.8453 178.585 18.2293 178.894 18.72L178.622 19.136V13.888H180.414V26H178.702V24.24L178.91 24.576C178.611 25.0987 178.185 25.4987 177.63 25.776C177.075 26.0533 176.467 26.192 175.806 26.192ZM175.982 24.512C176.483 24.512 176.931 24.3893 177.326 24.144C177.731 23.8987 178.046 23.5627 178.27 23.136C178.505 22.6987 178.622 22.208 178.622 21.664C178.622 21.12 178.505 20.6347 178.27 20.208C178.046 19.7813 177.731 19.4453 177.326 19.2C176.931 18.9547 176.483 18.832 175.982 18.832C175.481 18.832 175.027 18.9547 174.622 19.2C174.217 19.4453 173.902 19.7813 173.678 20.208C173.454 20.6347 173.342 21.12 173.342 21.664C173.342 22.208 173.454 22.6987 173.678 23.136C173.902 23.5627 174.211 23.8987 174.606 24.144C175.011 24.3893 175.47 24.512 175.982 24.512Z" fill="url(#paint2_radial_69_2231)"/>

</g>

<defs>

<filter id="filter0_i_69_2231" x="0" y="0" width="194" height="38" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">

<feFlood flood-opacity="0" result="BackgroundImageFix"/>

<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>

<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>

<feOffset/>

<feGaussianBlur stdDeviation="2"/>

<feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>

<feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.15 0"/>

<feBlend mode="normal" in2="shape" result="effect1_innerShadow_69_2231"/>

</filter>

<radialGradient id="paint0_radial_69_2231" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(102.575 93.9143) rotate(-110.069) scale(168.268 387.63)">

<stop stop-color="#3A951B"/>

<stop offset="1" stop-color="#1CDAF4"/>

</radialGradient>

<radialGradient id="paint1_radial_69_2231" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(21.3879 45.6143) rotate(-94.0932) scale(56.2931 28.6448)">

<stop stop-color="#3A951B"/>

<stop offset="1" stop-color="#1CDAF4"/>

</radialGradient>

<radialGradient id="paint2_radial_69_2231" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(113.195 62.3714) rotate(-115.403) scale(101.297 280.55)">

<stop stop-color="#3A951B"/>

<stop offset="1" stop-color="#1CDAF4"/>

</radialGradient>

</defs>

</svg>


);
const MarkAsContactedButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 rounded-full text-base font-semibold border border-transparent"
    >


<MarkAsContactedIcon />
    </button>
  );
};

const PageTitleIcon = () => (


<svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 34 34" fill="none">
<path d="M19.125 26.9167H7.08333C6.33189 26.9167 5.61122 26.6182 5.07986 26.0868C4.54851 25.5555 4.25 24.8348 4.25 24.0833V8.50001C4.25 7.74856 4.54851 7.02789 5.07986 6.49654C5.61122 5.96518 6.33189 5.66667 7.08333 5.66667H12.75L17 9.91667H26.9167C27.6681 9.91667 28.3888 10.2152 28.9201 10.7465C29.4515 11.2779 29.75 11.9986 29.75 12.75V14.875M29.75 21.25H26.2083C25.6447 21.25 25.1042 21.4739 24.7057 21.8724C24.3072 22.2709 24.0833 22.8114 24.0833 23.375C24.0833 23.9386 24.3072 24.4791 24.7057 24.8776C25.1042 25.2761 25.6447 25.5 26.2083 25.5H27.625C28.1886 25.5 28.7291 25.7239 29.1276 26.1224C29.5261 26.5209 29.75 27.0614 29.75 27.625C29.75 28.1886 29.5261 28.7291 29.1276 29.1276C28.7291 29.5261 28.1886 29.75 27.625 29.75H24.0833M26.9167 29.75V31.1667M26.9167 19.8333V21.25" stroke="#285B19" stroke-width="2.83333" stroke-linecap="round" stroke-linejoin="round"/>
</svg>


);

    // --- MAIN PAGE COMPONENT ---
    const LeadMarketplacePage = () => {
        const [activeTab, setActiveTab] = useState('Buyer');
        const [view, setView] = useState('list'); // Default to list view
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
                        <main className="col-span-12">
                            {/* Page Header with updated styling */}
                            <div className="flex items-center justify-between mb-5">
                                <div className="flex items-center gap-3">
                                    <PageTitleIcon />
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
    {selectedCount > 0 && (
    <div className="sticky bottom-6 inset-x-6 z-10 flex justify-between items-center p-3 bg-white rounded-full shadow-2xl">
      <p className="pl-4 font-semibold text-neutral-600 whitespace-nowrap">
        {selectedCount} {selectedCount === 1 ? 'Lead' : 'Leads'} Selected
      </p>
      <div className="flex items-center gap-3">
        <DeselectAllButton />
        <MarkAsContactedButton />
        <MarkAsClosedButton />
      </div>
    </div>
    )}
                        </main>

                    </div>
                </div>
            </div>
        );
    };
    export default LeadMarketplacePage;