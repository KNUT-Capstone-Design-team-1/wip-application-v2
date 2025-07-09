const formatBytes = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseInt((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const formatProgress = (count: number, total: number) => {
  const percentage = (count / total) * 100;
  return percentage.toFixed() + '%';
};

const leftPad = (value: number) => {
  if (value >= 10) {
    return value;
  }
  return `0${value}`;
};

const formatDateToString = (date: Date, delimiters = '-') => {
  return [
    date.getFullYear(),
    leftPad(date.getMonth() + 1),
    leftPad(date.getDate()),
  ].join(delimiters);
};

export { formatBytes, formatProgress, formatDateToString };
