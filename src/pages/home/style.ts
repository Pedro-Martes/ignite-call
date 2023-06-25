import { styled, Heading, Text } from "@ignite-ui/react";

export const HomeContainer = styled('div', {
    marginLeft:'auto',
    maxWidth: 'calc(100vw - (100vw - 1160px) /2)',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    gap:'$20',
    overflow: 'hidden'


})

export const Hero = styled('div',{
    maxWidth: 480,
    padding: '0 $10',

    [`> ${Heading}`]: {

        '@media(max-width: 600px)' : {
           fontsize: '6xl'
    
        },
        
    },
    [`> ${Text}`]: {
        marginTop: '$2',
        color: '$gray200',
        fontSize: '$xl',
    },


})

export const Preview = styled('div',{
    overflow: 'hidden',
    padding: '$8',

    '@media(max-width: 600px)' : {
        display: 'none',

    },
})