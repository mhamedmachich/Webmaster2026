const paths = {
  compass: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M14.9 9.1 13.2 13l-4.1 1.9 1.7-4.1 4.1-1.7Z" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="5.5" />
      <path d="m15 15 4 4" />
    </>
  ),
  calendar: (
    <>
      <path d="M7 4v3M17 4v3M5 8h14" />
      <rect x="5" y="6" width="14" height="14" rx="2" />
      <path d="M8 12h3M13 12h3M8 16h3M13 16h3" />
    </>
  ),
  hands: (
    <>
      <path d="M8 12.5 5.8 10.3a2 2 0 0 0-2.8 2.8l4 4c.8.8 1.8 1.2 2.9 1.2H12" />
      <path d="M16 12.5 18.2 10.3a2 2 0 0 1 2.8 2.8l-4 4c-.8.8-1.8 1.2-2.9 1.2H12" />
      <path d="M12 5.5c1.4-1.8 4.5-1 4.5 1.8 0 2.2-2.5 3.8-4.5 5.4-2-1.6-4.5-3.2-4.5-5.4C7.5 4.5 10.6 3.7 12 5.5Z" />
    </>
  ),
  funding: (
    <>
      <rect x="5" y="6" width="14" height="12" rx="2" />
      <path d="M8 10h8M8 14h5" />
      <path d="M15.5 16.5c1.3-.2 2.5-.8 2.5-2s-1.2-1.8-2.5-2c-1.3-.2-2.5-.8-2.5-2s1.2-1.8 2.5-2" />
    </>
  ),
  education: (
    <>
      <path d="m3.5 9 8.5-4 8.5 4-8.5 4-8.5-4Z" />
      <path d="M7 11v4.5c2.9 1.7 7.1 1.7 10 0V11" />
      <path d="M20.5 9v5" />
    </>
  ),
  building: (
    <>
      <path d="M4 20h16" />
      <path d="M6 20V8l6-4 6 4v12" />
      <path d="M9 10h2M13 10h2M9 14h2M13 14h2" />
    </>
  ),
  guide: (
    <>
      <path d="M12 4a6 6 0 0 0-6 6v3a4 4 0 0 0 4 4h1v-5H7v-2a5 5 0 0 1 10 0v2h-4v5h1a4 4 0 0 0 4-4v-3a6 6 0 0 0-6-6Z" />
      <path d="M9 20h6" />
    </>
  ),
  alert: (
    <>
      <path d="M12 4 3.5 19h17L12 4Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </>
  ),
  food: (
    <>
      <path d="M7 4v16M10 4v7a3 3 0 0 1-6 0V4" />
      <path d="M17 4c-2 1.8-3 4.5-3 8h4v8" />
    </>
  ),
  book: (
    <>
      <path d="M5 5.5A2.5 2.5 0 0 1 7.5 3H20v16H7.5A2.5 2.5 0 0 0 5 21V5.5Z" />
      <path d="M5 5.5A2.5 2.5 0 0 0 2.5 3H2v16h.5A2.5 2.5 0 0 1 5 21" />
      <path d="M8 7h8M8 11h8" />
    </>
  ),
  car: (
    <>
      <path d="M6 16h12l-1.5-5h-9L6 16Z" />
      <path d="M8 16v2M16 16v2M7 11l1.5-4h7L17 11" />
      <circle cx="8" cy="18" r="1.5" />
      <circle cx="16" cy="18" r="1.5" />
    </>
  ),
  sports: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M4 12h16M12 4c2 2.3 3 5 3 8s-1 5.7-3 8M12 4c-2 2.3-3 5-3 8s1 5.7 3 8" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M4 12h16M12 4c2 2.3 3 5 3 8s-1 5.7-3 8M12 4c-2 2.3-3 5-3 8s1 5.7 3 8" />
    </>
  ),
  message: (
    <>
      <path d="M5 6h14v9H9l-4 4V6Z" />
      <path d="M8 10h8M8 13h5" />
    </>
  ),
  computer: (
    <>
      <rect x="4" y="5" width="16" height="11" rx="2" />
      <path d="M9 20h6M12 16v4" />
    </>
  ),
  grant: (
    <>
      <path d="M7 4h10v16H7z" />
      <path d="M9 8h6M9 11h6M9 14h3" />
      <path d="m14 17 1 1 2-2" />
    </>
  ),
  trophy: (
    <>
      <path d="M8 4h8v3a4 4 0 0 1-8 0V4Z" />
      <path d="M8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 11v5M9 20h6M10 16h4" />
    </>
  ),
  wrench: (
    <>
      <path d="M14 6a4 4 0 0 0 5 5L11 19a3 3 0 1 1-4-4l8-8Z" />
      <path d="M7 17h.01" />
    </>
  ),
  code: (
    <>
      <path d="m8 8-4 4 4 4M16 8l4 4-4 4M14 5l-4 14" />
    </>
  ),
  health: (
    <>
      <path d="M12 20s-7-4.3-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.7-7 10-7 10Z" />
      <path d="M9 12h6M12 9v6" />
    </>
  ),
  location: (
    <>
      <path d="M12 21s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10Z" />
      <circle cx="12" cy="11" r="2" />
    </>
  ),
  phone: (
    <>
      <path d="M8 5 6 7c.3 5.7 5.3 10.7 11 11l2-2-4-3-2 1c-1.6-.9-3-2.3-3.9-3.9l1-2L8 5Z" />
    </>
  ),
  link: (
    <>
      <path d="M10 13a4 4 0 0 0 6 0l2-2a4 4 0 0 0-6-6l-1 1" />
      <path d="M14 11a4 4 0 0 0-6 0l-2 2a4 4 0 0 0 6 6l1-1" />
    </>
  ),
  check: (
    <path d="m5 12 4 4 10-10" />
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M3.5 20a5.5 5.5 0 0 1 11 0M13.5 20a4.5 4.5 0 0 1 7 0" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  empty: (
    <>
      <circle cx="11" cy="11" r="6" />
      <path d="m16 16 4 4M7 11h8" />
    </>
  ),
};

export default function VisualIcon({ name = "compass", size = 24, color = "currentColor", strokeWidth = 1.8 }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name] || paths.compass}
    </svg>
  );
}

export function IconTile({ name, color, bg, size = 32, tileSize = 54 }) {
  return (
    <div style={{ width:tileSize, height:tileSize, borderRadius:14, background:bg || `${color}18`, color, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
      <VisualIcon name={name} size={size} color="currentColor" />
    </div>
  );
}
