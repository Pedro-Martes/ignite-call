import { Button, Heading, MultiStep, Text, TextInput } from "@ignite-ui/react";
import {  Header, RegisterContainer } from "../style";
import { AuthError, ConnectBox, ConnectItem } from "./styles";
import { ArrowRight, Link, LinkSimple, LinkSimpleBreak } from "phosphor-react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";



export default function Register(){
  
const session = useSession();
const router = useRouter();

const hasAuthError = !!router.query.error
const hasSingedIn = session.status == 'authenticated'


async function handleConnectCalendar() {
  await signIn('google')
}

async function handleNavigateToNextStep(){
  await router.push('/register/time-intervals')
}

   
    return(
      <>
       <NextSeo 
                title='Conecte a sua agenda do Google | Ignite Call'
                noindex 
            />
      
        <RegisterContainer>
            <Header>
                <Heading as="strong">Conecte sua agenda! </Heading>
                <Text>Conecte o seu calendário para verificar automaticamente as horas ocupadas e os novos eventos à medida em que são agendados.</Text>
                <MultiStep size={4} currentStep={2} />
            </Header>

          <ConnectBox>
            <ConnectItem>
                <Text>Google Calendar</Text>
              
              {
                hasSingedIn ? (
                  <Button variant={"primary"} size={'sm'} disabled>
                    Connected
                    <LinkSimple />
                  </Button>
                ) : (
                  
                <Button variant={"secondary"} size={'sm'} onClick={() => signIn('google')}>
                Connect 
                <LinkSimpleBreak />
                </Button>
                )
              }


            </ConnectItem>
            {hasAuthError && (
              <AuthError>
                Please grant permission to access your Google Calendar
              </AuthError>
            )}
              <Button onClick={handleNavigateToNextStep}  disabled={!hasSingedIn}>

              Próximo
              <ArrowRight />

            </Button>
            
          </ConnectBox>

       
        </RegisterContainer>
        </>
    )
}