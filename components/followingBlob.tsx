'use client'

import { Box } from "@mui/material"

import { useTheme, Theme, alpha } from "@mui/material/styles";
import { useEffect, useState } from "react";

export default function FollowingBlob()
{
    const theme: Theme = useTheme();
    const [mousePosition, setMousePosition] = useState({x:0, y:0})
    const [blobPosition, setBlobPosition] = useState({x:0, y:0})

    //Create mouse event to make blob follow Mouse
    useEffect(()=>{
        const followBlob = document.getElementById('followBlob')!

        document.addEventListener('mousemove', (e)=>{
            setMousePosition({x:e.clientX-followBlob.offsetWidth/2, y:e.clientY-followBlob.offsetHeight/1.5})
            // console.log(e.clientX, followBlob.getBoundingClientRect().width, followBlob.offsetWidth, followBlob.offsetLeft)
            // followBlob.style.left = e.clientX - followBlob.offsetWidth/2 + 'px'
            // followBlob.style.top = e.clientY - followBlob.offsetHeight/1.5 + 'px'
        })
        return ()=>{
            document.removeEventListener('mousemove', (e)=>{
                setMousePosition({x:e.clientX, y:e.clientY})
            })
        }
    },[])
    
    useEffect(()=>{
        moveBlob();
    }, [mousePosition.x, mousePosition.y])

    async function moveBlob()
    {
        await new Promise((resolve)=>setTimeout(resolve, 200))
        setBlobPosition({x:mousePosition.x, y:mousePosition.y})
        //console.log('Moved Blobs')
    }
    return(
        <>
        <Box id='followBlob' position={'absolute'} width={'40rem'} sx={{aspectRatio:'1/1', background:'radial-gradient(circle, '+'#3d56f0'+' 0%, transparent 70%);', opacity:0.4, transition:'none'}} bgcolor={'green'} borderRadius={'50%'} top={blobPosition.y+'px'} left={blobPosition.x+'px'}></Box>
        <Box id='mouseShadow' position={'absolute'} width={'2px'} height={'2px'} top={mousePosition.y+'px'} left={mousePosition.x+'px'} sx={{transition:'none'}}></Box>
        </>
    )
}