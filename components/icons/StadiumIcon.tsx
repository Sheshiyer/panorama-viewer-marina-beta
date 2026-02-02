interface StadiumIconProps {
  className?: string;
}

export function StadiumIcon({ className }: StadiumIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <ellipse cx="12" cy="12" rx="9" ry="6" />
      <line x1="3" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="21" y2="12" />
      <path d="M12 6v12" />
      <path d="M7.5 8v8" />
      <path d="M16.5 8v8" />
    </svg>
  );
}
