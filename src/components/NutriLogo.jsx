export default function NutriLogo({ className = 'w-10 h-10' }) {
  return (
    <img
      src="/nutrivisi-logo-mark.svg"
      alt=""
      aria-hidden="true"
      draggable="false"
      className={`${className} object-contain select-none`}
    />
  );
}
