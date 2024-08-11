import { addDays, format, isSameDay } from 'date-fns'
import { id } from 'date-fns/locale'

import { ISchedule } from '@/interfaces'

export const getDaysOfWeek = (startDate: Date) => {
  return Array.from({ length: 7 }, (_, i) => addDays(startDate, i))
}

export const formatDate = (date: Date) => {
  return format(date, 'EEEE, d MMMM', { locale: id }).replace(/minggu/i, 'Ahad')
}

export const getScheduleForDay = (
  day: Date,
  schedules: ISchedule.ISchedule[]
) => {
  return schedules.filter((schedule) => isSameDay(new Date(schedule.date), day))
}
