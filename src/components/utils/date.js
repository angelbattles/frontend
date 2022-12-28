export const getHumanReadableDate = (stringDate) => {
  if (!stringDate) {
    return '';
  }

  var timestamp = new Date(parseInt(stringDate, 10) * 1000);
  var date =
    timestamp.getFullYear() +
    '-' +
    (timestamp.getMonth() + 1) +
    '-' +
    timestamp.getDate();
  var time =
    timestamp.getHours() +
    ':' +
    timestamp.getMinutes() +
    ':' +
    timestamp.getSeconds();
  return date + ' ' + time;
};

export const getNextConditionChangeDate = (stringDate) => {
  if (!stringDate) {
    return '';
  }

  var timestamp = new Date(parseInt(stringDate, 10) * 1000);
  timestamp.setDate(timestamp.getDate() + 1);
  var date =
    timestamp.getFullYear() +
    '-' +
    (timestamp.getMonth() + 1) +
    '-' +
    timestamp.getDate();
  var time =
    timestamp.getHours() +
    ':' +
    timestamp.getMinutes() +
    ':' +
    timestamp.getSeconds();
  return date + ' ' + time;
};
