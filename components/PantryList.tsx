'use client'

import { useTheme, Theme } from "@mui/material/styles";
import { Add, Delete, Edit, HourglassBottom, ShoppingBag, ShoppingBasket } from "@mui/icons-material";
import { alpha, Box, Button, Typography } from "@mui/material";
import PantryCard from "./PantryCard";
import { usePantryContext } from "./pantryContext";
import { useEffect, useState } from "react";
import Pantry from "./Pantry";

export default function PantryList(){

    const pantryData = usePantryContext() as any;
    const [editingPantryId, setEditingPantryId] = useState<string>('');
    const [deletingPantryId, setDeletingPantryId] = useState<string>('');


    const theme: Theme = useTheme();

    async function deletePantry(pantryId: string){
        let pantryObject = {...pantryData};
        pantryObject.data = {...pantryObject.data};
        delete pantryObject.data[pantryId];
        const response = await fetch('/api/database?requestType=setPantry&user='+pantryData.userEmail, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(pantryObject.data),
        })
        pantryData.update(pantryObject);
    }

    if(editingPantryId!='') return <Pantry pantryId={editingPantryId} backToList={()=>{setEditingPantryId('')}}/>
    
    return(
        <Box display="flex" flexDirection={"column"} padding={4} >
            <Typography variant="h3" fontWeight={700}>Your Pantries</Typography>
            <Box py={2} display={'flex'} flexWrap={"wrap"} gap={2} justifyContent={{xs:"center", md:"flex-start"}} alignItems={"center"}>
                {Object.keys(pantryData.data||{}).map((pantryId, index) => (
                        <PantryCard icon={<ShoppingBasket fontSize="large"/>} name={pantryData.data[pantryId].name} description={pantryData.data[pantryId].description} key={index} editThisPantry={()=>{setEditingPantryId(pantryId)}} deleteThisPantry={()=>{setDeletingPantryId(pantryId)}}/>
                ))
                }
                {pantryData.userEmail?<Box width={300} height={170} display='flex' justifyContent={'center'} alignItems={'center'} borderRadius={4} sx={{border:'2px solid rgba(255,255,255,0.2)', borderStyle:'dashed',cursor:'pointer', '&:hover':{borderColor:theme.palette.primary.main}, '&:hover .boxChild':{color:theme.palette.primary.main, opacity: 1}}} flexDirection={'column'} gap={1} onClick={() => setEditingPantryId(new Date().getTime().toString())}>
                    <Box className='boxChild'><Add sx={{opacity:0.8}}/></Box>
                    <Typography className="boxChild" variant="h5" fontWeight={700} sx={{opacity:0.8}}>Add Pantry</Typography>
                </Box>:<Box width={300} height={170} display='flex' justifyContent={'center'} alignItems={'center'} borderRadius={4} sx={{border:'2px solid rgba(255,255,255,0.2)', borderStyle:'dashed'}} flexDirection={'column'} gap={1}>
                    <HourglassBottom fontSize="large" sx={{opacity:0.8}} className="animate-spin ease-linear"/>
                </Box>}
            </Box>
            <Box position={'absolute'} bgcolor={'rgba(0,0,0,0.5)'} top={0} left={0} width={1} height={1} zIndex={1} display={'flex'} alignItems={'center'} justifyContent={'center'} sx={deletingPantryId!='' ? {opacity:1} : {opacity:0, pointerEvents:'none'}}>
                <Box>
                    <Typography variant="h5" fontWeight={700} color="white">Are you sure you want to delete the pantry <strong>{(pantryData.data && pantryData.data[deletingPantryId])?pantryData.data[deletingPantryId].name:''}</strong>?</Typography>
                    <Box display={'flex'} justifyContent={'center'} gap={4}>
                        <Button variant="outlined" color="error" size="large" sx={{mt:2, bgcolor:'rgba(255,0,0,0.2)', borderColor:'red', '&:hover':{bgcolor:'rgba(255,0,0,0.9)', borderColor:'red'}}} onClick={()=>{
                            deletePantry(deletingPantryId);
                            setDeletingPantryId('');
                        }}>Delete</Button>
                        <Button variant="outlined" size="large" sx={{mt:2, bgcolor:'rgba(255,255,255,0.2)', borderColor:'gray', color:'white'}} onClick={()=>{setDeletingPantryId('')}}>Cancel</Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}