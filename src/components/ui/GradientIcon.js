// src/components/ui/GradientIcon.js

'use client';
import React from 'react';

// Central repository for SVG paths
const icons = {
  newLeads: (
    <>
      <line x1="12" y1="19" x2="12" y2="5"></line>
      <polyline points="5 12 12 5 19 12"></polyline>
    </>
  ),
  purchasedLeads: (
    <>
      <circle cx="9" cy="21" r="1"></circle>
      <circle cx="20" cy="21" r="1"></circle>
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
    </>
  ),
  contactedLeads: (
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
  ),
};

const GradientIcon = ({ name }) => {
  const uniqueId = `icon-grad-${name}`;
  const iconPaths = icons[name];

  // This transform is taken directly from the original SVG to replicate its exact appearance.
  // Note: The original SVG had two slightly different transforms. We've chosen one to use consistently.
  const gradientTransform = "translate(22.4957 35.4552) rotate(-105.581) scale(39.6972 35.3611)";

  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <defs>
        <radialGradient
          id={uniqueId}
          gradientUnits="userSpaceOnUse" // Necessary for the transform to work as intended
          gradientTransform={gradientTransform}
          // cx, cy, and r attributes are removed as they are now controlled by gradientTransform
        >
          <stop stopColor="#BCF1A5" />
          <stop offset="1" stopColor="#285B19" />
        </radialGradient>
      </defs>
      <g stroke={`url(#${uniqueId})`} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {iconPaths}
      </g>
    </svg>
  );
};

export default GradientIcon;