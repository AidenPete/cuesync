export type AdminNavIconName =
  | "dashboard"
  | "products"
  | "orders"
  | "delivery"
  | "customers"
  | "preorders";

type IconProps = {
  name: AdminNavIconName;
  className?: string;
};

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function IconPaths({ name }: { name: AdminNavIconName }) {
  switch (name) {
    case "dashboard":
      return (
        <>
          <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" {...stroke} />
          <rect x="13.5" y="3.5" width="7" height="4.5" rx="1.5" {...stroke} />
          <rect x="13.5" y="10.5" width="7" height="10" rx="1.5" {...stroke} />
          <rect x="3.5" y="13" width="7" height="7.5" rx="1.5" {...stroke} />
        </>
      );
    case "products":
      return (
        <>
          <path d="M4 8 12 4l8 4-8 4-8-4Z" {...stroke} />
          <path d="M4 12l8 4 8-4" {...stroke} />
          <path d="M4 16l8 4 8-4" {...stroke} />
        </>
      );
    case "orders":
      return (
        <>
          <path d="M7 4h10l2 4v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" {...stroke} />
          <path d="M7 8h12" {...stroke} />
          <path d="M9 13h8" {...stroke} />
          <path d="M9 17h5" {...stroke} />
        </>
      );
    case "delivery":
      return (
        <>
          <path d="M3 7h11v9H3z" {...stroke} />
          <path d="M14 10h3l3 3v3h-6z" {...stroke} />
          <circle cx="7.5" cy="18" r="1.75" {...stroke} />
          <circle cx="17.5" cy="18" r="1.75" {...stroke} />
        </>
      );
    case "customers":
      return (
        <>
          <circle cx="10" cy="8.5" r="3" {...stroke} />
          <path d="M4.5 19c.8-3 3.2-5 5.5-5s4.7 2 5.5 5" {...stroke} />
          <path d="M16.5 8.8a2.2 2.2 0 1 0 0-.01" {...stroke} />
          <path d="M18.5 19c-.5-2-1.8-3.2-3.5-3.5" {...stroke} />
        </>
      );
    case "preorders":
      return (
        <>
          <path d="M5 6.5h14l-1.4 10.5a2 2 0 0 1-2 1.7H8.4a2 2 0 0 1-2-1.7L5 6.5Z" {...stroke} />
          <path d="M9 11h6" {...stroke} />
          <path d="M10 14.5h4" {...stroke} />
        </>
      );
  }
}

export function AdminNavIcon({ name, className = "h-5 w-5" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
    >
      <IconPaths name={name} />
    </svg>
  );
}

export function AdminLogo({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <circle cx="12" cy="12" r="8.5" {...stroke} />
      <circle cx="12" cy="12" r="2.25" fill="currentColor" stroke="none" />
      <path d="M12 3.5v3M12 17.5v3M3.5 12h3M17.5 12h3" {...stroke} />
    </svg>
  );
}
