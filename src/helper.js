import moment from 'moment';

export function readableTime(ts) {
  const _ts = Number.parseInt(ts, 10);
  return moment(_ts).format('YYYY-MM-DD HH:mm');
}

export default {
  readableTime,
};
