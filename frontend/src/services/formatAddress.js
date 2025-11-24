export const formatApproxAddress = (address) => {
  if (!address) return "";

  const match = address.match(/^(.*?)(\d+)$/);
  if (!match) return address;

  const street = match[1].trim();
  const number = parseInt(match[2], 10);

  let rounded;
  if (number >= 100) {
    rounded = Math.floor(number / 100) * 100; 
  } else if (number >= 10) {
    rounded = Math.floor(number / 10) * 10;
  } else {
    rounded = 10;
  }

  return `${street} ${rounded}`;
};
