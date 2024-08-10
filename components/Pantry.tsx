'use client'

import { useTheme, Theme } from "@mui/material/styles";
import { Add, ArrowLeft, CloudDone, CloudSync, Delete, Edit, Error, KeyboardArrowDown, KeyboardArrowUp, Search, ShoppingBag, ShoppingBasket } from "@mui/icons-material";
import { Alert, alpha, Box, Button, colors, Divider, FormControl, MenuItem, Modal, Select, TextField, Typography } from "@mui/material";
import PantryCard from "./PantryCard";
import ItemCard from "./ItemCard";
import { Key, useEffect, useRef, useState } from "react";
import Image from "next/image";
import ItemModal from "./itemModal";
import { usePantryContext } from "./pantryContext";
import Recipes from "./recipes";

export default function Pantry({pantryId, backToList}: {pantryId: string, backToList:any}){

    const [modalOpen, setModalOpen] = useState(false)
    const theme: Theme = useTheme();
    const pantryData = usePantryContext() as any;
    const [items, setItems]:any = useState([])
    const [pantryName, setPantryName] = useState('')
    const [pantryDescription, setPantryDescription] = useState('')
    const [unsavedChanges, setUnsavedChanges] = useState(false)
    const [changesMade, setChangesMade] = useState({})
    const [pantryError, setPantryError] = useState('')
    const [searchInput, setSearchInput] = useState('')

    const [modalConfig, setModalConfig]:any = useState({callback:(output: any)=>{
        setItems((prev: any)=>[...prev, output]);
}})

    useEffect(()=>{
        setPantryName(pantryData.data[pantryId]?.name || '')
        setPantryDescription(pantryData.data[pantryId]?.description || '')
        setItems(pantryData.data[pantryId]?.items || [])
    },[pantryData])

    function showModal(config?:any)
    {
        if(!config) config = {callback:(output: any)=>{
            setItems((prev: any)=>[...prev, output]);
        }}
        setModalConfig(config)
        setModalOpen(true)
    }
    useEffect(()=>{
        setChangesMade({
            
            name:pantryName,
            description:pantryDescription,
            items: items,
        })
    },[pantryName, pantryDescription,items])

    useEffect(()=>{
        if(JSON.stringify(changesMade) !== JSON.stringify(pantryData.data[pantryId]?{
            name: pantryData.data[pantryId].name,
            description: pantryData.data[pantryId].description,
            items: pantryData.data[pantryId].items
        }:{})){
            setUnsavedChanges(true)
        }
        else{
            setUnsavedChanges(false)
        }
    },[changesMade])

    function handleSaving(){
        if(!unsavedChanges) return
        if(pantryName === ''){
            showError('Pantry name cannot be empty')
            return;
        }
        if(pantryDescription === ''){
            showError('Pantry description cannot be empty')
            return;
        }
        if(items.length === 0){
            showError('Pantry cannot be empty')
            return;
        }

        let newPantryObject = {...pantryData};
        newPantryObject.data = {...newPantryObject.data}
        newPantryObject.data[pantryId] = {
            name:pantryName,
            description:pantryDescription,
            items: items
        }

        updatePantryDb(newPantryObject.data)
        pantryData.update(newPantryObject)
        setUnsavedChanges(false)
    }

    async function updatePantryDb(pantryObject: any)
    {
        const response = await fetch('/api/database?requestType=setPantry&user='+pantryData.userEmail, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(pantryObject),
        })
    }

    function showError(error: string)
    {
        let errorDiv = document.getElementById('pantryErrorDiv')
        setPantryError(error)
        errorDiv!.style.bottom = '10px';
        setTimeout(()=>{setPantryError(''); errorDiv!.style.bottom = '-100px'}, 3000)

    }


    return(
        <Box display={'flex'} width={1} height={1} overflow={'hidden'} position={'relative'}>
            <Box display="flex" flexDirection={"column"} p={4} overflow={'hidden'} position={'relative'} width={'100%'} height={'100%'}>
            <Box display={'flex'} alignItems={'center'} sx={{textDecoration:'underline',cursor:'pointer',opacity:0.6, '&:hover':{color: theme.palette.primary.main}}} onClick={backToList} mb={1}>
                <ArrowLeft/>
                <Typography>Back to Pantry List</Typography>
            </Box>
            <Box px={2} py={1} position={'absolute'} style={{bottom:'-100px', left:'50%', transform:'translateX(-50%)'}} display={'flex'} alignItems={'center'} border={'2px solid red'} borderRadius={4} color={'red'} id='pantryErrorDiv'>
                <Error sx={{marginRight: theme.spacing(1)}}/>
                <Typography variant="h6" fontWeight={700}>{pantryError}</Typography>
            </Box>
            <Box display={'flex'} alignItems={'center'}>
                {unsavedChanges?
                <Box display={'flex'} sx={{opacity:0.6}} mr={2} color={theme.palette.primary.main}>
                <CloudSync style={{marginRight: theme.spacing(1)}}/>
                <Typography variant="h6">Unsaved Changes</Typography>
                </Box>
                :<Box display={'flex'} sx={{opacity:0.3}} mr={2}>
                    <CloudDone style={{marginRight: theme.spacing(1)}}/>
                    <Typography variant="h6">No Unsaved changes</Typography>
                </Box>}
                <Button variant="outlined" disabled={!unsavedChanges} sx={{marginY:0, width:'max-content'}} onClick={()=>{handleSaving()}}>Save Changes</Button>
            </Box>
            <Box display={'flex'} alignItems={'start'} flexDirection={'column'} gap={2} className='lg:flex-row lg:items-end'>
                <Box display={'flex'}>
                    <TextField id="standard-basic" label="Pantry Name" value={pantryName} variant="standard" inputProps={{style:{fontSize:'3rem', fontWeight:700, padding:'2rem 0rem 0rem 0rem'}}} InputLabelProps={{style:{fontSize:'3rem', fontWeight:700, padding:'1rem 0rem 0rem 0rem'}}} onChange={(e)=>{setPantryName(e.target.value)}}/>
                </Box>
                <Box display={'flex'}>
                    <TextField id="standard-basic" label="Pantry Description" value={pantryDescription} variant="standard" inputProps={{style:{fontSize:'1.5rem', fontWeight:700, padding:'1rem 0rem 0rem 0rem'}}} InputLabelProps={{style:{fontSize:'1.5rem', fontWeight:700,  padding:'0.5rem 0rem 0rem 0rem'}}} onChange={(e)=>{setPantryDescription(e.target.value)}}/>
                </Box>
            </Box>
            <Box display={'flex'} alignItems={'end'} gap={1}>
                    <Search/>
                    <TextField id="standard-basic" label="Search Items" value={searchInput} variant="standard" inputProps={{style:{fontSize:'1.2rem', fontWeight:700, padding:'1rem 0rem 0rem 0rem', width:'200px'}}} InputLabelProps={{style:{fontSize:'1.2rem', fontWeight:700,  padding:'0.5rem 0rem 0rem 0rem'}}} onChange={(e)=>{setSearchInput(e.target.value)}}/>
            </Box>
            <Box py={2} display={'flex'} flexWrap={"wrap"} gap={2} justifyContent={{xs:"center", md:"flex-start"}} alignItems={"center"}>
                {items.map((item: { name: string; quantity: any; properties: any; coverImages: string[]; }, index: Key | null | undefined)=>
                    {return (item.name.toLowerCase().includes(searchInput.toLowerCase())?<ItemCard name={item.name} quantity={item.quantity} properties={item.properties} coverImage={item.coverImages[0]} setQuantity={
                        (quantity: any, unit: any)=>{
                            setItems((prev: any)=>{let updated = [...prev]; updated[index as number].quantity = {value: quantity, unit: unit}; return updated;})
                        }
                    } callEditModal={()=>{showModal({
                        name: item.name,
                        quantity: item.quantity,
                        properties: item.properties,
                        coverImages: item.coverImages,
                        callback: (output:any)=>{
                            setItems((prev: any)=>{let updated = [...prev]; updated[index as number] = output; return updated;})
                        }
                    })}}/>:null)}
                )}
                <Box width={300} height={170} display='flex' justifyContent={'center'} alignItems={'center'} borderRadius={4} sx={{border:'2px solid rgba(255,255,255,0.2)', borderStyle:'dashed',cursor:'pointer', '&:hover':{borderColor:theme.palette.primary.main}, '&:hover .boxChild':{color:theme.palette.primary.main, opacity: 1}}} flexDirection={'column'} gap={1}>
                    <Box display={'flex'} alignItems={'center'} gap={1} border={'2px solid rgba(255,255,255,0.2)'} borderRadius={4} p={1} sx={{opacity:0.8, '&:hover':{borderColor:theme.palette.primary.main}}} onClick={()=>{showModal()}}>
                        <Box className='boxChild'><Add sx={{opacity:0.8}}/></Box>
                        <Typography className="boxChild" variant="h5" fontWeight={700} sx={{opacity:0.8}}>Add Item</Typography>
                    </Box>
                </Box>
            </Box>
            <ItemModal modalOpen={modalOpen} setModalOpen={setModalOpen} setItems={setItems} editConfig={{
                name: modalConfig.name,
                quantity: modalConfig.quantity,
                properties: modalConfig.properties,
                coverImages: modalConfig.coverImages,
            }} returnOutput={modalConfig.callback}/>
        </Box>
        <Recipes showError={showError} pantryId={pantryId}/>
        </Box>
    )
}
