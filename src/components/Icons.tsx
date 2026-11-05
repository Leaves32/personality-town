export function Icon({
  name,
  size = 20,
}: {
  name:
    | "arrow"
    | "leaf"
    | "map"
    | "pause"
    | "back"
    | "check"
    | "close"
    | "spark"
    | "book";
  size?: number;
}) {
  const paths = {
    arrow: "M4 12h15m-6-6 6 6-6 6",
    leaf: "M20 4C8 3 3 8 5 15c5 7 14 0 15-11ZM5 20 16 9",
    map: "m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Zm6-3v15m6-12v15",
    pause: "M8 5v14M16 5v14",
    back: "M20 12H5m6-6-6 6 6 6",
    check: "m5 12 4 4L19 6",
    close: "m6 6 12 12M6 18 18 6",
    spark: "m12 3 2 7 7 2-7 2-2 7-2-7-7-2 7-2 2-7Z",
    book: "M12 5C9 2 4 3 3 4v15c3-2 6-1 9 1m0-15c3-3 8-2 9-1v15c-3-2-6-1-9 1V5Z",
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
    >
      <path d={paths[name]} />
    </svg>
  );
}
