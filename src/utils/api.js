export const getServerUrl = () => {
  return (
    import.meta.env.VITE_PRODUCTION_SERVER_URL || import.meta.env.VITE_SERVER_IP
  );
};

export const getApiUrl = () => {
  return (
    import.meta.env.VITE_PRODUCTION_API_URL || import.meta.env.VITE_API_URL
  );
};

export const convertToBengaliNumber = (number) => {
  const bengaliNumerals = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return number
    .toString()
    .split("")
    .map((digit) => {
      if (digit === ".") {
        return ".";
      }
      return bengaliNumerals[parseInt(digit)];
    })
    .join("");
};
