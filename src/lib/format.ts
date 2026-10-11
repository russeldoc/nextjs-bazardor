const BN = "০১২৩৪৫৬৭৮৯";

/** 1850 -> ১,৮৫০ (group first, then convert, because \d only matches ASCII digits) */
export function toBn(value: number | string) {
  const [int, dec] = String(value).split(".");
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return (dec !== undefined ? `${grouped}.${dec}` : grouped).replace(/\d/g, (d) => BN[Number(d)]);
}

/** 2.14 -> ২.১ ; 0 -> ০.০ */
export function pct(n: number) {
  return toBn(Math.abs(n).toFixed(1));
}

/** Direction of a change after rounding to one decimal (what the badge shows). */
export function direction(change: number): "up" | "down" | "flat" {
  const r = Math.round(change * 10) / 10;
  return r > 0 ? "up" : r < 0 ? "down" : "flat";
}
