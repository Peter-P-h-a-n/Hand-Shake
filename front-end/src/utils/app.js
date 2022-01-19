const isEmpty = (obj) => {
  if (!obj) return true;
  return Object.keys(obj).length === 0 && obj.constructor === Object;
};

const hashShortener = (hashStr) => {
  if (!hashStr) return '';
  const len = hashStr.length;
  if (len <= 20) {
    return hashStr;
  }

  return `${hashStr.substring(0, 10)}...${hashStr.substring(len - 4)}`;
};

const roundNumber = (num, digit = 2) => {
  if (!num) return 0;
  return +(Math.round(num + `e+${digit}`) + `e-${digit}`);
};

export { isEmpty, hashShortener, roundNumber };
