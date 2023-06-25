import { Button, TextInput, Text } from '@ignite-ui/react'
import { Form, FormAnnotation } from './style'
import { ArrowRight } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/router'

const claimUsernameFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'Please enter at least 3 characters' })
    .regex(/^([a-z\\-]+)$/i, { message: "Please, don't use numbers" })
    .transform((username) => username.toLowerCase()),
})
type claimUsernameFormData = z.infer<typeof claimUsernameFormSchema>

export function ClaimUsernameForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<claimUsernameFormData>({
    resolver: zodResolver(claimUsernameFormSchema),
  })

  const router = useRouter()

  async function handleClaimUsername(data: claimUsernameFormData) {
    const { username } = data

    await router.push(`/register?username=${username}`)
  }

  return (
    <Form as="form" onSubmit={handleSubmit(handleClaimUsername)}>
      <TextInput
        size={'sm'}
        prefix="ignite.com/"
        placeholder="Your username"
        {...register('username')}
      />

      <Button disabled={isSubmitting}>
        Reservar Usuario
        <ArrowRight />
      </Button>
      <FormAnnotation>
        <Text size={'sm'}>
          {errors.username
            ? errors.username.message
            : 'Please enter your username'}
        </Text>
      </FormAnnotation>
    </Form>
  )
}
