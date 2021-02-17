const countConcat = (count: number) => {
	if (count < 999) return count
	else if (count < 49999) return Math.floor(count/1000) + 'k+'
	else if (count < 299999) return Math.floor(count/10000)*10 + 'k+'
	else if (count < 999999) return Math.floor(count/50000)*50 + 'k+'
	else {
		return Math.floor(count/100000)/10 + 'm+'
	}
}

const timeSince = (date: any) => {

  const seconds = Math.abs(new Date as any - date);

  let interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + " years";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes";
  }
  return Math.floor(seconds) + " seconds";
}

export {countConcat, timeSince}