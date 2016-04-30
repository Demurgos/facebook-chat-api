import {padZeros} from "../helpers";

const NUM_TO_MONTH = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];
const NUM_TO_DAY = [
  'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'
];

export function formatDate(date: Date): string {
  const dayNum = date.getUTCDate();
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const seconds = date.getUTCSeconds();

  const dayNumString = padZeros(dayNum);
  const hoursString = padZeros(hours);
  const minutesString = padZeros(minutes);
  const secondsString = padZeros(seconds);

  return NUM_TO_DAY[date.getUTCDay()] + ', ' +
    dayNumString + ' ' + NUM_TO_MONTH[date.getUTCMonth()] + ' ' + date.getUTCFullYear() + ' ' +
    hoursString + ':' + minutesString + ':' + secondsString + ' GMT';
}

export default formatDate;
