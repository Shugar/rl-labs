export function Arrow({ down = false }: { down?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className={down ? "arrow arrow-down" : "arrow"}
      viewBox="0 0 20 20"
      fill="none"
    >
      <path d="M4 10h11M10.5 4.5 16 10l-5.5 5.5" />
    </svg>
  );
}
