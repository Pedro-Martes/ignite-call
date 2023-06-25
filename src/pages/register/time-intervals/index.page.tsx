/* eslint-disable react-hooks/rules-of-hooks */
import {
  Button,
  Checkbox,
  Heading,
  MultiStep,
  Text,
  TextInput,
} from '@ignite-ui/react'
import { FormError, Header, RegisterContainer } from '../style'
import {
  IntervalBox,
  IntervalContainer,
  IntervalDay,
  IntervalInputs,
  IntervalItem,
} from './styles'
import { ArrowRight } from 'phosphor-react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'
import { getWeekDays } from '@/utils/get-week-day'
import { zodResolver } from '@hookform/resolvers/zod'
import { converTimeInMinutes } from '@/utils/convert-time-in-minute'
import { myapi } from '../../../lib/axios'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'

const timeIntervalsFromSchema = z.object({
  intervals: z
    .array(
      z.object({
        weekDay: z.number().min(0).max(6),
        enabled: z.boolean(),
        startTime: z.string(),
        endTime: z.string(),
      }),
    )
    .length(7)
    .transform((intervals) => intervals.filter((interval) => interval.enabled))
    .refine((intervals) => intervals.length > 0, { message: 'Select one day' })
    .transform((intervals) =>
      intervals.map((interval) => {
        return {
          weekDay: interval.weekDay,
          startTimeInMinutes: converTimeInMinutes(interval.startTime),
          endTimeInMinutes: converTimeInMinutes(interval.endTime),
        }
      }),
    )
    .refine(
      (intervals) => {
        return intervals.every(
          (interval) =>
            interval.endTimeInMinutes - 60 >= interval.startTimeInMinutes,
        )
      },
      {
        message: 'Start or End  time is invalid',
      },
    ),
})

type timeIntervalsFormInput = z.input<typeof timeIntervalsFromSchema>
// eslint-disable-next-line no-unused-vars
type timeIntervalsFormOutput = z.output<typeof timeIntervalsFromSchema>

export default function timeIntervals() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    control,
    watch,
  } = useForm<timeIntervalsFormInput>({
    resolver: zodResolver(timeIntervalsFromSchema),
    defaultValues: {
      intervals: [
        { weekDay: 0, enabled: false, startTime: '08:00', endTime: '17:00' },
        { weekDay: 1, enabled: true, startTime: '08:00', endTime: '17:00' },
        { weekDay: 2, enabled: true, startTime: '08:00', endTime: '17:00' },
        { weekDay: 3, enabled: true, startTime: '08:00', endTime: '17:00' },
        { weekDay: 4, enabled: true, startTime: '08:00', endTime: '17:00' },
        { weekDay: 5, enabled: true, startTime: '08:00', endTime: '17:00' },
        { weekDay: 6, enabled: false, startTime: '08:00', endTime: '17:00' },
      ],
    },
  })

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const router = useRouter()

  const weekDays = getWeekDays()

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { fields } = useFieldArray({
    control,
    name: 'intervals',
  })

  const intervalsWatch = watch('intervals')

  async function handleSetTimeIntervals(data: any) {
    const { intervals } = data as timeIntervalsFormInput

    await myapi.post('/users/time-intervals', {
      intervals,
    })

    await router.push('/register/update-profile')
  }

  return (
    <>
      <NextSeo
        title="Cadastre seus horarios disponiveis | Ignite Call"
        noindex
      />

      <RegisterContainer>
        <Header>
          <Heading as="strong">Conecte sua agenda! </Heading>
          <Text>
            Conecte o seu calendário para verificar automaticamente as horas
            ocupadas e os novos eventos à medida em que são agendados.
          </Text>
          <MultiStep size={4} currentStep={3} />
        </Header>

        <IntervalBox
          as={'form'}
          onSubmit={handleSubmit(handleSetTimeIntervals)}
        >
          <IntervalContainer>
            {fields.map((field, index) => {
              return (
                <IntervalItem key={field.id}>
                  <IntervalDay>
                    <Controller
                      name={`intervals.${index}.enabled`}
                      control={control}
                      render={({ field }) => {
                        return (
                          <Checkbox
                            onCheckedChange={(checked) => {
                              field.onChange(checked === true)
                            }}
                            checked={field.value}
                          />
                        )
                      }}
                    />
                    <Text>{weekDays[field.weekDay]}</Text>
                  </IntervalDay>

                  <IntervalInputs>
                    <TextInput
                      size={'sm'}
                      type="time"
                      step={60}
                      disabled={intervalsWatch[index].enabled === false}
                      {...register(`intervals.${index}.startTime`)}
                    />
                    <TextInput
                      size={'sm'}
                      type="time"
                      step={60}
                      disabled={intervalsWatch[index].enabled === false}
                      {...register(`intervals.${index}.endTime`)}
                    />
                  </IntervalInputs>
                </IntervalItem>
              )
            })}
          </IntervalContainer>

          {errors.intervals && (
            <FormError size={'sm'}>{errors.intervals.message}</FormError>
          )}

          <Button type="submit" disabled={isSubmitting}>
            Próximo
            <ArrowRight />
          </Button>
        </IntervalBox>
      </RegisterContainer>
    </>
  )
}
