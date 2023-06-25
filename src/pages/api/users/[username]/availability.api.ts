import { prisma } from '@/lib/prisma'
import dayjs from 'dayjs'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method != 'GET') {
    return res.status(405).end
  }

  const username = String(req.query.username)
  const { date } = req.query

  if (!date) {
    return res.status(400).json({ message: 'Invalid date' })
  }

  const user = await prisma.user.findUnique({
    where: { username },
  })

  if (!user) {
    return res.status(400).json({ message: 'Invallid user' })
  }

  const referenceDate = dayjs(String(date))
  const isPastDate = referenceDate.endOf('day').isBefore(new Date())

  if (isPastDate) {
    return res.json({ possibleTimes: [], availibleTime: [] })
  }

  const userAvalability = await prisma.userTimeInterval.findFirst({
    where: {
      user_Id: user.id,
      week_days: referenceDate.get('day'),
    },
  })

  if (!userAvalability) {
    return res.json({ possibleTimes: [], availibleTime: [] })
  }

  const { time_end_in_minutes, time_start_in_minutes } = userAvalability

  const stratHours = time_start_in_minutes / 60
  const endHours = time_end_in_minutes / 60

  const possibleTimes = Array.from({ length: endHours - stratHours }).map(
    (_, i) => {
      return stratHours + i
    },
  )

  const blockedTimes = await prisma.scheduling.findMany({
    select: {
      date: true,
    },
    where: {
      user_id: user.id,
      date: {
        gte: referenceDate.set('hour', stratHours).toDate(),
        lte: referenceDate.set('hour', endHours).toDate(),
      },
    },
  })

  const availibleTime = possibleTimes.filter((time) => {
    const isTimeBlocked = blockedTimes.some(
      (blockedTimes) => blockedTimes.date.getHours() == time,
    )

    const isTimeInPast = referenceDate.set('hour', time).isBefore(new Date())

    return !isTimeBlocked && !isTimeInPast
  })

  return res.json({ possibleTimes, availibleTime })
}
