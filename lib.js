
// https://stackoverflow.com/a/64085123/1248177
const formatTime = (seconds) => {
  let date = new Date(null);
  date.setSeconds(seconds);
  return date.toISOString().substr(11, 8);
};

const parseTime = (time) => {
  const [hours, minutes, seconds] = time.split(":").map((x) => parseInt(x));
  return hours * 3600 + minutes * 60 + seconds;
};