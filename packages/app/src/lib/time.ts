import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'

dayjs.extend(localizedFormat)

export function formatTime(time: string) {
  return dayjs(time).format('LL')
}
