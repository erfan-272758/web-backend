exports.timeConvertor = (time_string = "") => {
  const tsRegex = /([\d.]+)([a-zA-Z])/;
  const map = new Map([
    ["d", 24 * 60 * 60 * 10 ** 3],
    ["h", 60 * 60 * 10 ** 3],
    ["m", 60 * 10 ** 3],
    ["s", 10 ** 3],
  ]);
  return time_string
    .split(" ")
    .map((ts) => {
      const [, amount, unit] = tsRegex.exec(ts);
      return +amount * map.get(unit) || 0;
    })
    .reduce((prev, curr) => curr + prev, 0);
};
