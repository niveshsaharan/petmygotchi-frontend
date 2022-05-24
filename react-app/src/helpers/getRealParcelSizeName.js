export default function getRealParcelSizeName(size) {
  const sizes = {
    0: "humble",
    1: "reasonable",
    2: "spacious vertical",
    3: "spacious horizontal",
    4: "partner",
  };
  return sizes[size];
}
