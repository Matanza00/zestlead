import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';

// Data that closely matches the visual representation in the image.
const chartData = [
  { name: 'Week 1', value: 38 },
  { name: 'Week 2', value: 36 },
  { name: 'Week 3', value: 18 },
  { name: 'Week 4', value: 37 },
];

// A custom shape for the bar to create rounded tops, matching the image perfectly.
const RoundedBar = (props) => {
  const { fill, x, y, width, height } = props;
  const radius = 6; // The radius for the top corners

  // This path creates a rectangle with the top-left and top-right corners rounded.
  return (
    <path
      d={`M${x},${y + height} L${x},${y + radius} Q${x},${y} ${x + radius},${y} L${x + width - radius},${y} Q${x + width},${y} ${x + width},${y + radius} L${x + width},${y + height} Z`}
      fill={fill}
    />
  );
};


// The main chart component.
const App = () => (
  <div className="bg-gray-100 flex items-center justify-center font-sans">
    <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white text-card-foreground shadow-sm p-6">
      {/* Card Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {/* Custom SVG Icon to match the image */}
          <div className="w-8 h-8 flex items-center justify-center bg-emerald-50 rounded-full">
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="22" viewBox="0 0 24 22" fill="none">
<path d="M20.75 11.6673L12 20.3333L3.25 11.6673C2.67286 11.1057 2.21825 10.4307 1.91481 9.68473C1.61136 8.93879 1.46566 8.1381 1.48686 7.33308C1.50807 6.52806 1.69573 5.73615 2.03802 5.00722C2.38031 4.27829 2.86983 3.62812 3.47574 3.09767C4.08165 2.56722 4.79083 2.16796 5.55862 1.92505C6.32641 1.68214 7.13618 1.60084 7.93693 1.68626C8.73769 1.77168 9.51209 2.02198 10.2114 2.42138C10.9106 2.82079 11.5196 3.36066 12 4.00699C12.4825 3.36535 13.0922 2.8302 13.791 2.43503C14.4897 2.03986 15.2626 1.79318 16.0611 1.71043C16.8596 1.62768 17.6666 1.71064 18.4316 1.95412C19.1965 2.19759 19.903 2.59634 20.5068 3.12542C21.1106 3.65449 21.5987 4.30249 21.9405 5.02887C22.2823 5.75524 22.4705 6.54436 22.4934 7.34682C22.5162 8.14928 22.3731 8.94782 22.0732 9.69245C21.7732 10.4371 21.3227 11.1118 20.75 11.6743" stroke="#4EBC26" stroke-width="2.33333" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M20.75 11.6673L12 20.3333L3.25 11.6673C2.67286 11.1057 2.21825 10.4307 1.91481 9.68473C1.61136 8.93879 1.46566 8.1381 1.48686 7.33308C1.50807 6.52806 1.69573 5.73615 2.03802 5.00722C2.38031 4.27829 2.86983 3.62812 3.47574 3.09767C4.08165 2.56722 4.79083 2.16796 5.55862 1.92505C6.32641 1.68214 7.13618 1.60084 7.93693 1.68626C8.73769 1.77168 9.51209 2.02198 10.2114 2.42138C10.9106 2.82079 11.5196 3.36066 12 4.00699C12.4825 3.36535 13.0922 2.8302 13.791 2.43503C14.4897 2.03986 15.2626 1.79318 16.0611 1.71043C16.8596 1.62768 17.6666 1.71064 18.4316 1.95412C19.1965 2.19759 19.903 2.59634 20.5068 3.12542C21.1106 3.65449 21.5987 4.30249 21.9405 5.02887C22.2823 5.75524 22.4705 6.54436 22.4934 7.34682C22.5162 8.14928 22.3731 8.94782 22.0732 9.69245C21.7732 10.4371 21.3227 11.1118 20.75 11.6743" stroke="url(#paint0_radial_59_929)" stroke-width="2.33333" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M12 4L8.15817 7.84183C7.93945 8.06062 7.81658 8.35731 7.81658 8.66667C7.81658 8.97602 7.93945 9.27272 8.15817 9.4915L8.79167 10.125C9.59667 10.93 10.9033 10.93 11.7083 10.125L12.875 8.95833C13.2196 8.61334 13.6288 8.33965 14.0792 8.15291C14.5296 7.96618 15.0124 7.87006 15.5 7.87006C15.9876 7.87006 16.4704 7.96618 16.9208 8.15291C17.3712 8.33965 17.7804 8.61334 18.125 8.95833L20.75 11.5833M12.5833 15.0833L14.9167 17.4167M15.5 12.1667L17.8333 14.5" stroke="#4EBC26" stroke-width="2.33333" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M12 4L8.15817 7.84183C7.93945 8.06062 7.81658 8.35731 7.81658 8.66667C7.81658 8.97602 7.93945 9.27272 8.15817 9.4915L8.79167 10.125C9.59667 10.93 10.9033 10.93 11.7083 10.125L12.875 8.95833C13.2196 8.61334 13.6288 8.33965 14.0792 8.15291C14.5296 7.96618 15.0124 7.87006 15.5 7.87006C15.9876 7.87006 16.4704 7.96618 16.9208 8.15291C17.3712 8.33965 17.7804 8.61334 18.125 8.95833L20.75 11.5833M12.5833 15.0833L14.9167 17.4167M15.5 12.1667L17.8333 14.5" stroke="url(#paint1_radial_59_929)" stroke-width="2.33333" stroke-linecap="round" stroke-linejoin="round"/>
<defs>
<radialGradient id="paint0_radial_59_929" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(22.4957 35.4552) rotate(-105.581) scale(39.6972 35.3611)">
<stop stop-color="#BCF1A5"/>
<stop offset="1" stop-color="#285B19"/>
</radialGradient>
<radialGradient id="paint1_radial_59_929" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(20.75 28.2778) rotate(-103.441) scale(28.2377 21.9783)">
<stop stop-color="#BCF1A5"/>
<stop offset="1" stop-color="#285B19"/>
</radialGradient>
</defs>
</svg>
          </div>
          <h3 className="font-semibold text-lg text-gray-800">Deals Closed</h3>
        </div>
        {/* Filter Button */}
        <div className="flex items-center text-sm">
          <button className="flex items-center gap-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 text-emerald-700 font-medium transition-colors">
            1M
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
        </div>
      </div>
      
      {/* Chart Container */}
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={chartData} 
            margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
            barCategoryGap="35%" // Increased gap to make bars thinner
          >
            <defs>
              {/* Gradient definition for the bars */}
              <linearGradient id="dealsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity={0.9}/>
                <stop offset="100%" stopColor="#5EEAD4" stopOpacity={0.8}/>
              </linearGradient>
            </defs>
            
            {/* Grid lines, horizontal only, matching the image */}
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            
            {/* X-Axis configuration */}
            <XAxis 
              dataKey="name" 
              stroke="#9ca3af" 
              fontSize={12} 
              tickLine={false} 
              axisLine={{ stroke: '#e5e7eb' }}
              dy={10} // Offset text down
            />
            
            {/* Y-Axis configuration */}
            <YAxis 
              stroke="#9ca3af" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
              domain={[0, 50]} 
              ticks={[0, 10, 50]}
            />
            
            {/* Bar definition using the custom rounded shape */}
            <Bar 
              dataKey="value" 
              fill="url(#dealsGradient)" 
              shape={<RoundedBar />} 
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
);

export default App;
