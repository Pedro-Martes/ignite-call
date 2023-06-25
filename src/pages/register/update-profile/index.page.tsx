import { Avatar, Button, Heading, MultiStep, Text, TextArea} from "@ignite-ui/react";
import { FormAnnotation, ProfileBox } from "./style";
import { ArrowRight } from "phosphor-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import {  Header, RegisterContainer } from "../style";
import { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import { unstable_getServerSession } from "next-auth";
import { buildNextAuthOptions } from "@/pages/api/auth/[...nextauth].api";
import { myapi } from "@/lib/axios";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";

const updateProfileSchema = z.object({
 bio: z.string(),
})

type UpdateProfileData = z.infer<typeof updateProfileSchema>

export default function UpdateProfile(){
    const {
        register,
         handleSubmit,
          formState: {isSubmitting}
        } = useForm<UpdateProfileData>({
        resolver: zodResolver(updateProfileSchema)
    })

    const session = useSession()
    const router = useRouter()

    async function handleUpdtaeProfile(data: UpdateProfileData) {
      await myapi.put('/users/profile',{
        bio: data.bio,
      })

      await router.push(`/schedule/${session.data?.user?.username}`)
    }

    return(

        <>
        
        <NextSeo 
                title='Atualiza seu perfil! | Ignite Call'
                noindex
                
            />

        <RegisterContainer>
            <Header>
                <Heading as="strong">Bem-vindo ao Ignite Call! </Heading>
                <Text>Precisamos de algumas informações para criar seu perfil! Ah, você pode editar essas informações depois.</Text>
                <MultiStep size={4} currentStep={4} />
            </Header>

            <ProfileBox as="form" onSubmit={handleSubmit(handleUpdtaeProfile)}>
                <label>
                    <Text>Foto do Perfil </Text>
                    <Avatar src={session.data?.user?.avatar_Url} alt= {session.data?.user?.name}  />
                </label>

                <label>
                    <Text size="sm">About you:</Text>
                    <TextArea {...register('bio')}/>

                    <FormAnnotation size="sm">
                    Escreva um puco sobre você
                    </FormAnnotation>
                </label>

                

                <Button type="submit" disabled={isSubmitting}>
                    Feito!<ArrowRight />
                </Button>
            </ProfileBox>
        </RegisterContainer>
        
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async({req, res}) =>{
    const session =await unstable_getServerSession(
        req,
        res,
        buildNextAuthOptions(req, res)
    )
    return{
        props: {
            session: {
                session
            }
        },
    }
}