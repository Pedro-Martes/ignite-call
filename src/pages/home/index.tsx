import { Heading, Text } from '@ignite-ui/react'
import { Hero, HomeContainer, Preview } from './style'
import previeImage from '../../assets/imgaes/calnedar.png'
import Image from 'next/image'
import { ClaimUsernameForm } from './components/claimUsernameForm'
import { NextSeo } from 'next-seo'

export default function Home() {
  return (
    <>
      <NextSeo
        title="Descomplique sua agenda | Ignite Call"
        description=" Conecte seu calendário e permita que as pessoas marquem agendamentos no seu tempo livre."
      />
      <HomeContainer>
        <Hero>
          <Heading size="4xl">Agendamento descomplicado</Heading>

          <Text size="lg">
            Conecte seu calendário e permita que as pessoas marquem agendamentos
            no seu tempo livre.
          </Text>

          <ClaimUsernameForm />
        </Hero>

        <Preview>
          <Image
            src={previeImage}
            alt="Calendar Preview"
            height={400}
            quality={100}
            priority
          />
        </Preview>
      </HomeContainer>
    </>
  )
}
