export const isoToLocalDate = (iso) => new Date(iso).toLocaleDateString();
export const yyyy_mm_dd = (date) => date.toISOString().slice(0,10);
export const fromYmd = (s) => {
  const [y,m,d] = s.split('-').map(Number);
  return new Date(y, m-1, d);
};
