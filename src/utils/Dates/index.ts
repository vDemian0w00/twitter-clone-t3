import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

export const formatDate = (date: Date) => {
  return dayjs(date).format('YYYY-MM-DD')
}

export const formatRelativeTime = (date: Date) => {
  return dayjs(date).fromNow()
}
