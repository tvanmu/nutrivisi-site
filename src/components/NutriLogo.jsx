export default function NutriLogo({ className = 'w-10 h-10', cutoutColor = '#012330' }) {
  return (
    <svg
      viewBox="0 0 100 80"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="25" y1="30" x2="12" y2="18" />
      <line x1="50" y1="25" x2="50" y2="8" />
      <line x1="75" y1="30" x2="88" y2="18" />
      <path d="M 5 55 Q 50 20 95 55 Q 50 90 5 55 Z" />
      <circle cx="50" cy="55" r="22" fill="currentColor" stroke="none" />
      <path d="M 40 55 L 48 64 L 62 45" stroke={cutoutColor} strokeWidth="6" fill="none" />
    </svg>
  );
}
