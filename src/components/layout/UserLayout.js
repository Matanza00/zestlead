'use client';
import React from 'react';
// Assuming you have a combined navigation bar component
// import CombinedNavbar from './CombinedNavbar'; 

const UserLayout = ({ children }) => {
    return (
        <div>
            {/* <CombinedNavbar /> */}
            <main>{children}</main>
        </div>
    );
};

export default UserLayout;
