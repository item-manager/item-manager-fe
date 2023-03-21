import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

const formatUtc = (utcDate: string, format: string): string => {
  return dayjs.utc(utcDate).local().format(format)
}

export default {
  formatUtc,
}
