export function Logo({ size = 32, className = '' }: { size?: number; className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <defs>
          <linearGradient id="pathly-logo-grad" x1="4" y1="36" x2="36" y2="4" gradientUnits="userSpaceOnUse">
            <stop stopColor="#1c80f5" />
            <stop offset="1" stopColor="#59beff" />
          </linearGradient>
        </defs>
        {/* P-shaped path with milestone dots */}
        <path
          d="M10 34 L10 8 Q10 4 14 4 L24 4 Q32 4 32 12 Q32 20 24 20 L14 20"
          stroke="url(#pathly-logo-grad)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <circle cx="10" cy="34" r="3.5" fill="#1c80f5" />
        <circle cx="14" cy="20" r="3" fill="#59beff" />
        <circle cx="24" cy="4" r="3" fill="#f9960c" />
      </svg>
      <span className="text-lg font-extrabold tracking-tight text-[rgb(var(--text))]">
        Pathly
      </span>
    </div>
  );
}
