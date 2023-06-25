import { CaretLeft, CaretRight } from 'phosphor-react'
import {
  CalendarAction,
  CalendarBody,
  CalendarContainer,
  CalendarDay,
  CalendarHeader,
  CalendarTitle,
} from './style'
import { getWeekDays } from '@/utils/get-week-day'
import { useMemo, useState } from 'react'
import dayjs from 'dayjs'
import { date } from 'zod'
import { useQuery } from '@tanstack/react-query'
import { myapi } from '@/lib/axios'
import { useRouter } from 'next/router'

interface CalendarWeek {
  week: number
  days: Array<{
    date: dayjs.Dayjs
    disabled: boolean
  }>
}

interface blockedDates {
  blockedWeekDays: number[]
  blockedDates: number[]
}

type CalendarWeeks = CalendarWeek[]

interface CalendarProps {
  selectDate: Date | null

  onDeteSelected: (date: Date) => void
}

export function Calendar({ selectDate, onDeteSelected }: CalendarProps) {
  const shortWeekDays = getWeekDays({ short: true })
  const [currentDate, setcurrentDate] = useState(() => {
    return dayjs().set('date', 1)
  })

  function handlePreviousMonth() {
    const previusMonth = currentDate.subtract(1, 'month')
    setcurrentDate(previusMonth)
  }

  function handleNextMonth() {
    const nextMonth = currentDate.add(1, 'month')
    setcurrentDate(nextMonth)
  }

  const currentMonth = currentDate.format('MMMM')
  const currentYear = currentDate.format('YYYY')

  const router = useRouter()
  const username = String(router.query.username)

  const { data: blockedDates } = useQuery<blockedDates>(
    ['blockedDates', currentDate.get('year'), currentDate.get('month')],
    async () => {
      const response = await myapi.get(`users/${username}/blocked-dates`, {
        params: {
          year: currentDate.get('year'),
          month: currentDate.get('month') + 1,
        },
      })
      return response.data
    },
  )

  const calendarWeeks = useMemo(() => {
    if (!blockedDates) {
      return []
    }

    const daysInMonthArray = Array.from({
      length: currentDate.daysInMonth(),
    }).map((_, i) => {
      return currentDate.set('date', i + 1)
    })

    const firstWeekDay = currentDate.get('day')

    const previousMonthFillArray = Array.from({
      length: firstWeekDay,
    })
      .map((_, i) => {
        return currentDate.subtract(i + 1, 'day')
      })
      .reverse()

    const lastDayInCurrentMonth = currentDate.set(
      'date',
      currentDate.daysInMonth(),
    )
    const lastWeekDay = lastDayInCurrentMonth.get('day')

    const nextMonthFillArray = Array.from({
      length: 7 - (lastWeekDay + 1),
    }).map((_, i) => {
      return lastDayInCurrentMonth.add(i + 1, 'day')
    })

    const calendarDays = [
      ...previousMonthFillArray.map((date) => {
        return { date, disabled: true }
      }),
      ...daysInMonthArray.map((date) => {
        return {
          date,
          disabled:
            date.endOf('day').isBefore(new Date()) ||
            blockedDates.blockedWeekDays.includes(date.get('day')) ||
            blockedDates.blockedDates.includes(date.get('date')),
        }
      }),
      ...nextMonthFillArray.map((date) => {
        return { date, disabled: true }
      }),
    ]

    const calendarWeeks = calendarDays.reduce<CalendarWeeks>(
      (weeks, _, i, original) => {
        const isNewWeek = i % 7 === 0

        if (isNewWeek) {
          weeks.push({
            week: i / 7 + 1,
            days: original.slice(i, i + 7),
          })
        }

        return weeks
      },
      [],
    )

    return calendarWeeks
  }, [currentDate, blockedDates])

  return (
    <CalendarContainer>
      <CalendarHeader>
        <CalendarTitle>
          {currentMonth} <span>{currentYear}</span>
        </CalendarTitle>

        <CalendarAction>
          <button onClick={handlePreviousMonth} title="Previous Month">
            <CaretLeft />
          </button>

          <button onClick={handleNextMonth} title="Next Month">
            <CaretRight />
          </button>
        </CalendarAction>
      </CalendarHeader>

      <CalendarBody>
        <thead>
          <tr>
            {shortWeekDays.map((shortWeek) => (
              <th key={shortWeek}>{shortWeek}.</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {calendarWeeks.map(({ week, days }) => {
            return (
              <tr key={week}>
                {days.map(({ date, disabled }) => {
                  return (
                    <td key={date.toString()}>
                      <CalendarDay
                        onClick={() => onDeteSelected(date.toDate())}
                        disabled={disabled}
                      >
                        {date.get('date')}
                      </CalendarDay>
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </CalendarBody>
    </CalendarContainer>
  )
}
