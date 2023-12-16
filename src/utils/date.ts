export function parseEasyRsaDate(date: string): Date | null {
  date = date?.trim();
  if (!date) {
    return null;
  }

  const year = `20${date.substring(0, 2)}`;
  const month = date.substring(2, 4);
  const day = date.substring(4, 6);
  const hour = date.substring(6, 8);
  const minute = date.substring(8, 10);
  const second = date.substring(10, 12);
  const timeZone = date.substring(12, 13);
  return new Date(
    `${year}-${month}-${day}T${hour}:${minute}:${second}${timeZone}`
  );
}
