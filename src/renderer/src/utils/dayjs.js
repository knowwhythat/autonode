import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh'

dayjs.extend(relativeTime)
dayjs.locale('zh')

export default dayjs
