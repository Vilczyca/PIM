export const formatDate = (iso: string) => {
  const [year, month, day] = iso.split("-");
  return `${day}-${month}-${year}`;
};
