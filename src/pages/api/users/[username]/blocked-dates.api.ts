/* eslint-disable import/no-duplicates */
import { prisma } from '@/lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).end
  }

  const username = String(req.query.username)
  const { year, month } = req.query

  if (!year || !month) {
    return res.status(400).json({ message: 'Invalid year or month' })
  }

  const user = await prisma.user.findUnique({
    where: { username },
  })

  if (!user) {
    return res.status(400).json({ message: 'Invallid user' })
  }

  const availableWeekDays = await prisma.userTimeInterval.findMany({
    select: {
      week_days: true,
    },
    where: {
      user_Id: user.id,
    },
  })

  const blockedWeekDays = [0, 1, 2, 3, 4, 5, 6].filter((weekDay) => {
    return !availableWeekDays.some(
      (availableWeekDays) => availableWeekDays.week_days === weekDay,
    )
  })

  //

  const yearMonth = `${year}-${String(month).padStart(2, '0')}`

  const blockedDatesRaw: Array<{ date: number }> = await prisma.$queryRaw`

    SELECT  EXTRACT(DAY FROM S.DATE) AS date,
            COUNT(S.date) as amount,
            ((UTI.time_end_in_minutes - UTI.time_start_in_minutes) / 60) as size

    FROM schedulings S
    LEFT JOIN user_time_intervals UTI ON UTI.week_days = WEEKDAY(DATE_ADD(S.date, INTERVAL 1 DAY)) 
    WHERE S.user_id = ${user.id} AND DATE_FORMAT(S.date, "%Y-%m") = ${yearMonth}
    GROUP BY EXTRACT(DAY FROM S.DATE),  size
    HAVING amount >= size
  `

  const blockedDates = blockedDatesRaw.map((item) => item.date)

  return res.json({ blockedWeekDays, blockedDates })
}
