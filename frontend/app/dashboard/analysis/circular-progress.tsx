const CircularProgress = ({ value, size = 80 }: { value: number; size?: number }) => {
  const strokeWidth = 14; // increased from 8 to 14
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = circumference - (value / 100) * circumference;

  let strokeColor = "#14b8a6"; // default to teal

  if (value >= 90) strokeColor = "#22c55e"; // green
  else if (value >= 70) strokeColor = "#0e7490"; // derma blue
  else if (value >= 50) strokeColor = "#e11d48"; // red

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="absolute top-0 left-0" width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e0e0e0"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={progress}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-bold text-xl text-derma-blue-800">{value}%</span>
      </div>
    </div>
  );
};
