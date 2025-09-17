const convertToMinutes = (time: string): number => {
  const [hourMinute, meridian] = time.split(' ');
  let [hours, minutes] = hourMinute.split(':').map(Number);

  if (meridian.toLowerCase() === 'pm' && hours !== 12) {
    hours += 12;
  }
  if (meridian.toLowerCase() === 'am' && hours === 12) {
    hours = 0;
  }

  return hours * 60 + minutes;
};

export default convertToMinutes;
