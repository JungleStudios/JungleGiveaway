module.exports = function parseDuration(duration) {
  const regex = /(\d+d)?(\d+h)?(\d+m)?(\d+s)?/;
  const matches = regex.exec(duration);
  let totalSeconds = 0;

  if (matches[1]) totalSeconds += parseInt(matches[1]) * 86400; // days
  if (matches[2]) totalSeconds += parseInt(matches[2]) * 3600;  // hours
  if (matches[3]) totalSeconds += parseInt(matches[3]) * 60;    // minutes
  if (matches[4]) totalSeconds += parseInt(matches[4]);         // seconds

  return totalSeconds * 1000;
};
