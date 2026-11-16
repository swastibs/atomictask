const TIME_UNITS = [
  ["year", 365 * 24 * 60 * 60],
  ["month", 30 * 24 * 60 * 60],
  ["day", 24 * 60 * 60],
  ["hour", 60 * 60],
  ["minute", 60],
  ["second", 1],
];

const formatUptime = (uptimeInSeconds) => {
  let remainingSeconds = Math.floor(uptimeInSeconds);

  const parts = TIME_UNITS.flatMap(([unit, secondsPerUnit]) => {
    const count = Math.floor(remainingSeconds / secondsPerUnit);
    remainingSeconds %= secondsPerUnit;

    if (count === 0) {
      return [];
    }

    return [`${count} ${unit}${count === 1 ? "" : "s"}`];
  });

  return parts.length > 0 ? parts.join(", ") : "less than a second";
};

export default formatUptime;
