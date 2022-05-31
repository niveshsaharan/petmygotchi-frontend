export default function getChannelingCutoffTimeInUTC(add = 0) {
  let now = new Date().getTime();

  if (add) {
    now += 24 * 60 * 60 * 1000 * add;
  }

  now = new Date(now);

  return Date.parse(
    now.getUTCFullYear() +
      "-" +
      (now.getUTCMonth() < 9 ? "0" : "") +
      (now.getUTCMonth() + 1) +
      "-" +
      (now.getUTCDate() < 9 ? "0" : "") +
      now.getUTCDate() +
      "T00:00:00.000Z",
  );
}
