interface WavesIconProps {
  className?: string;
}

export function WavesIcon({ className }: WavesIconProps) {
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
      <path d="M2 12c2-2 4-2 6 0s4 2 6 0 4-2 6 0 4 2 6 0" />
      <path d="M2 17c2-2 4-2 6 0s4 2 6 0 4-2 6 0 4 2 6 0" />
      <path d="M2 7c2-2 4-2 6 0s4 2 6 0 4-2 6 0 4 2 6 0" />
    </svg>
  );
}
