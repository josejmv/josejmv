import tz from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import dayjs from 'dayjs'

dayjs.extend(utc)
dayjs.extend(tz)
