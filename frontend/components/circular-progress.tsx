import type * as React from "react"
import { cn } from "@/lib/utils"

interface CircularProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number // Percentage from 0 to 100
  size?: number
  strokeWidth?: number
  trackColor?: string
  progressColor?: string
  textColor?: string
}

export function CircularProgress({
  value,
  size = 100,
  strokeWidth = 8,
  trackColor = "hsl(var(--derma-blue-100))",
  progressColor = "hsl(var(--derma-blue-500))",
  textColor = "hsl(var(--derma-blue-800))",
  className,
  ...props
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference

  return (
    <div
      className={cn("relative flex items-center justify-center", className)}
      style={{ width: size, height: size }}
      {...props}
    >
      <svg className="absolute" width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          className="transition-colors duration-300"
          stroke={trackColor}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          className="transition-all duration-500 ease-out"
          stroke={progressColor}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <span className="relative z-10 text-xl font-bold" style={{ color: textColor }}>
        {value}%
      </span>
    </div>
  )
}
