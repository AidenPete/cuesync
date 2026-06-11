export type ShopNavIconName =
  | "home"
  | "shop"
  | "cart"
  | "orders"
  | "account"
  | "qr"
  | "menu"
  | "help";

type IconProps = {
  name: ShopNavIconName;
  className?: string;
};

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function IconPaths({ name }: { name: ShopNavIconName }) {
  switch (name) {
    case "home":
      return (
        <>
          <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1z" {...stroke} />
        </>
      );
    case "shop":
      return (
        <>
          <path d="M4 8 12 4l8 4-8 4-8-4Z" {...stroke} />
          <path d="M4 12l8 4 8-4" {...stroke} />
          <path d="M4 16l8 4 8-4" {...stroke} />
        </>
      );
    case "cart":
      return (
        <>
          <path d="M6 6h15l-1.5 9H7.5L6 6Z" {...stroke} />
          <path d="M6 6 5 3H3" {...stroke} />
          <circle cx="9.5" cy="19.5" r="1.5" {...stroke} />
          <circle cx="17.5" cy="19.5" r="1.5" {...stroke} />
        </>
      );
    case "orders":
      return (
        <>
          <path d="M7 4h10l2 4v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" {...stroke} />
          <path d="M7 8h12" {...stroke} />
          <path d="M9 13h8" {...stroke} />
        </>
      );
    case "account":
      return (
        <>
          <circle cx="12" cy="8.5" r="3.25" {...stroke} />
          <path d="M5 20c1-3.5 3.5-5.5 7-5.5s6 2 7 5.5" {...stroke} />
        </>
      );
    case "qr":
      return (
        <>
          <rect x="4" y="4" width="6" height="6" rx="1" {...stroke} />
          <rect x="14" y="4" width="6" height="6" rx="1" {...stroke} />
          <rect x="4" y="14" width="6" height="6" rx="1" {...stroke} />
          <path d="M14 14h2v2h-2zM18 14h2v2h-2zM14 18h2v2h-2zM18 18h2v2h-2z" {...stroke} />
        </>
      );
    case "menu":
      return (
        <>
          <circle cx="7" cy="7" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="12" cy="7" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="17" cy="7" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="7" cy="12" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="17" cy="12" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="7" cy="17" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="12" cy="17" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="17" cy="17" r="1.5" fill="currentColor" stroke="none" />
        </>
      );
    case "help":
      return (
        <>
          <circle cx="12" cy="12" r="8.5" {...stroke} />
          <path d="M9.5 9.5a2.75 2.75 0 0 1 5 1.5c0 2-2.75 2.25-2.75 4" {...stroke} />
          <circle cx="12" cy="17" r="0.75" fill="currentColor" stroke="none" />
        </>
      );
  }
}

export function ShopNavIcon({ name, className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={`shrink-0 ${className}`}>
      <IconPaths name={name} />
    </svg>
  );
}

export function ShopLogo({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <circle cx="12" cy="12" r="8.5" {...stroke} />
      <circle cx="12" cy="12" r="2.25" fill="currentColor" stroke="none" />
      <path d="M12 3.5v3M12 17.5v3M3.5 12h3M17.5 12h3" {...stroke} />
    </svg>
  );
}
