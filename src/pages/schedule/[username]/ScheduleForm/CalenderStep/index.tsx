import { Calendar } from '@/components/Calendar'
import {
  Container,
  TimerPicker,
  TimerPickerHeader,
  TimerPickerItem,
  TimerPickerList,
} from './styles'
import { useState } from 'react'
import dayjs from 'dayjs'
import { myapi } from '@/lib/axios'
import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'

interface Availablility {
  possibleTimes: number[]
  availibleTime: number[]
}

interface CalendarStepProps {
  onSelectDateTime: (date: Date) => void
}

export function CalendarStep({ onSelectDateTime }: CalendarStepProps) {
  const [selectedDate, setselectedDate] = useState<Date | null>(null)

  const router = useRouter()
  const username = String(router.query.username)
  const hasSelectedDate = !!selectedDate

  const weekDay = selectedDate ? dayjs(selectedDate).format('dddd') : null
  const dateNumber = selectedDate
    ? dayjs(selectedDate).format('DD [de] MMMM')
    : null

  const selectDateWithoutTime = selectedDate
    ? dayjs(selectedDate).format('YYYY-MM-DD')
    : null

  const { data: availability } = useQuery<Availablility>(
    ['availability', selectDateWithoutTime],
    async () => {
      const response = await myapi.get(`users/${username}/availability`, {
        params: {
          date: dayjs(selectedDate).format('YYYY-MM-DD'),
        },
      })
      return response.data
    },
    { enabled: !!selectedDate },
  )
  function handleSelectTime(hour: number) {
    const dateWithTime = dayjs(selectedDate)
      .set('hour', hour)
      .startOf('hour')
      .toDate()

    onSelectDateTime(dateWithTime)
  }

  return (
    <Container isTimePickerOpen={hasSelectedDate}>
      <Calendar selectDate={selectedDate} onDeteSelected={setselectedDate} />

      {hasSelectedDate && (
        <TimerPicker>
          <TimerPickerHeader>
            {weekDay} <span>{dateNumber}</span>
          </TimerPickerHeader>

          <TimerPickerList>
            {availability?.possibleTimes.map((hour) => {
              return (
                <TimerPickerItem
                  key={hour}
                  onClick={() => handleSelectTime(hour)}
                  disabled={!availability.availibleTime.includes(hour)}
                >
                  {String(hour).padStart(2, '0')}:00h
                </TimerPickerItem>
              )
            })}
          </TimerPickerList>
        </TimerPicker>
      )}
    </Container>
  )
}

//
