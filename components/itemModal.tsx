import theme from "@/theme"
import { Error, KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material"
import { alpha, Box, Button, Divider, FormControl, MenuItem, Modal, Select, TextField, Typography } from "@mui/material"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"

export default function ItemModal({modalOpen, setModalOpen, returnOutput, setItems, editConfig}:{modalOpen: boolean, setModalOpen: any, returnOutput: any, editConfig: any, setItems:any})
{
    const modalPropertiesRef = useRef(null);
    const [propertiesDivs, setPropertiesDivs] = useState([
        <PropertyPair TheKey={0} key={0}/>
    ]);

    const [propertiesPairsValues, setPropertiesPairsValues]= useState(editConfig.properties || [{
        property:'',
        value: ''
    }])

    const [sampleImages, setSampleImages] = useState([]);
    const [imagesLoaded, setImagesLoaded] = useState([false, false, false]);

    const [newItemName, setNewItemName] = useState('')
    const [delayedItemName, setDelayedItemName] = useState(editConfig.name || '')
    
    const [modalError, setModalError] = useState('Error while creating item.')
    const [showModalError, setShowModalError] = useState(false)
    
    const [newItemQuantity, setNewItemQuantity] = useState(0)
    const [newItemUnit, setNewItemUnit] = useState('Units');

    function modalPropertiesChange(){
        let lastPropertyPair = propertiesPairsValues[propertiesPairsValues.length-1];
        if(lastPropertyPair.property && lastPropertyPair.value){
            setPropertiesPairsValues((prev: any)=>[...prev, {property:'',value:''}]);
            setPropertiesDivs((prev)=>[...prev, (
                <PropertyPair TheKey={prev.length} key={prev.length}/>
            )])
        }
    }

    useEffect(()=>{
        modalPropertiesChange()},[propertiesPairsValues])

    async function handleItemNameChange(newName: string)
    {
        setNewItemName(newName)
        if(newItemName.length < 3) return;
        setTimeout(()=>{setDelayedItemName(newName)}, 1000);
    }

    useEffect(()=>{
        if(delayedItemName != newItemName) return;
        if(delayedItemName.length<3) return;
        setImagesLoaded([false, false, false]);
        fetch('/api/getstock?stockQuery='+delayedItemName).then(photosRes=>photosRes.json().then(photos=>{
            setSampleImages(photos.photos.photos.map((photo: { src: { original: any } })=>photo.src.original));
        }));
            
    },[delayedItemName])

    function showError(error: string)
    {
        setModalError(error);
        setShowModalError(true);
        setTimeout(()=>{setShowModalError(false)}, 3000);
    }
    function handleItemAdd()
    {
        if(!newItemName || newItemName.length<3){
            showError('Item name invalid or too short.');
            return;
        }
        if(newItemQuantity <= 0){
            showError('Item quantity should not be 0.');
            return;
        }
        setModalOpen(false);
        returnOutput({name:newItemName, quantity:{value: newItemQuantity, unit: newItemUnit}, properties:propertiesPairsValues, coverImages: sampleImages});
        setNewItemName('');
        setNewItemQuantity(0);
        setPropertiesPairsValues([{
            property:'',
            value: ''
        }]);
        setPropertiesDivs([<PropertyPair TheKey={0} key={0}/>]);
        setSampleImages([]);
        setImagesLoaded([false, false, false]);
    }
    

    function PropertyPair({TheKey}:{TheKey:any})
    {
        return(
            <Box display={'flex'} gap={1} key={TheKey}>
                                <TextField id="outlined-basic" label="Property" variant="outlined" inputProps={{style:{width:'5rem'}}} size="small" onChange={(e)=>{
                                    setPropertiesPairsValues((prev: any)=>{
                                        let updated = [...prev]
                                        updated[TheKey].property = e.target.value;
                                        return updated;
                                    })
                                }} key={0}/>
                                <TextField id="outlined-basic" label="Value" variant="outlined" inputProps={{style:{width:'5rem'}}} size="small" onChange={(e)=>{
                                    setPropertiesPairsValues((prev: any)=>{
                                        let updated = [...prev]
                                        updated[TheKey].value = e.target.value;
                                        return updated;
                                    })
                                }} key={1}/>
            </Box>
        )
    }

    useEffect(()=>{
        setNewItemName(editConfig.name || '')
        setNewItemQuantity(editConfig.quantity?.value || 0)
        setNewItemUnit(editConfig.quantity?.unit || 'Units')
        setPropertiesPairsValues(editConfig.properties || [{
            property:'',
            value: ''
        }])
        setSampleImages(editConfig.coverImages || [])

    },[editConfig])

    return(
        <Modal open={modalOpen} onClose={()=>{setModalOpen(false)}} aria-labelledby='itemModalTitle'>
                    <Box p={2} bgcolor={theme.palette.secondary.dark} border={'2px solid '+theme.palette.primary.main} borderRadius={4} width={'max-content'} top={'50%'} left={'50%'} position={'absolute'} sx={{transform:'translate(-50%,-50%)', '&:focus':{outline:'none'}}} display={'flex'} flexDirection={'column'}>
                        <Typography id='itemModalTitle' variant="h5" fontWeight={700} color={theme.palette.primary.main}>{editConfig.name?'Edit':'Add'} Item</Typography>
                    
                        <Box display={'flex'} mb={1}>
                            <TextField id="standard-basic" label="Item Name" defaultValue={newItemName} variant="standard" inputProps={{style:{fontSize:'1.5rem', fontWeight:700, padding:'1rem 0rem 0rem 0rem'}}} InputLabelProps={{style:{fontSize:'1.5rem', fontWeight:700,  padding:'0.5rem 0rem 0rem 0rem'}}} onChange={(e)=>{handleItemNameChange(e.target.value)}}/>
                        </Box>
                        <Typography variant="h6" color='rgba(255,255,255,0.7)' fontWeight={600} fontSize={'1.1rem'}>Item Quantity</Typography>
                        <Box display={'flex'} alignItems={'center'} gap={1}>
                                <Box display={'flex'} flexDirection={'column'} border={'2px solid rgba(255,255,255,0.2)'} borderRadius={4} overflow={'hidden'}>
                                    <Box sx={{cursor:'pointer', '&:hover':{color:theme.palette.primary.main, bgcolor: alpha(theme.palette.secondary.dark,0.6)}}} display={"flex"} justifyItems={'center'} alignItems={'center'} onClick={()=>{setNewItemQuantity((prev: number)=>prev+1)}}><KeyboardArrowUp fontSize="small"/></Box>
                                    <Divider orientation="horizontal" sx={{borderBottomWidth:2, borderColor: 'rgba(255,255,255,0.2)'}} flexItem/>
                                    <Box sx={{cursor:'pointer', '&:hover':{color:theme.palette.primary.main, bgcolor: alpha(theme.palette.secondary.dark,0.6)}}} display={"flex"} justifyItems={'center'} alignItems={'center'} onClick={()=>{setNewItemQuantity((prev: number)=>Math.max(0,prev-1))}}><KeyboardArrowDown fontSize="small"/></Box>
                                </Box>
                                <Box display={'flex'}>
                                    <TextField label='Quantity' value={newItemQuantity} size="small" onChange={(e)=>{setNewItemQuantity(parseFloat(e.target.value))}} sx={{opacity:0.8, marginLeft:1}} inputProps={{style:{width:'100px'}}}/>
                                </Box>
                                <Box display={'flex'} sx={{opacity:0.8}}>
                                    <FormControl sx={{m: 1, minWidth: 80, maxWidth:80, margin:0,marginLeft:1}}>
                                        <Select sx={{
                                            '.MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'rgba(228, 219, 233, 0.25)',
                                            },
                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'rgba(228, 219, 233, 0.25)',
                                            },
                                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'rgba(228, 219, 233, 0.5)',
                                            },
                                            '.MuiSvgIcon-root ': {
                                            fill: "transparent !important",
                                            },
                                            '&:hover .MuiSvgIcon-root ': {
                                            fill: "white !important",
                                            },
                                            '& .MuiSelect-select':{
                                                paddingLeft:1,
                                                paddingY:1
                                            }
                                        }} displayEmpty value={newItemUnit} inputProps={{ 'aria-label': 'Without label' }} onChange={(e)=>{setNewItemUnit(e.target.value)}}>
                                            <MenuItem value='Units'>Units</MenuItem>
                                            <MenuItem value='g'>g</MenuItem>
                                            <MenuItem value='mL'>mL</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>
                            </Box>
                        <Typography variant="h6" color='rgba(255,255,255,0.7)' fontWeight={600} fontSize={'1.1rem'}>Item Properties</Typography>
                        <Box display={'flex'} flexDirection={'column'} ref={modalPropertiesRef}>
                            <Box display={'flex'} flexDirection={'column'} gap={1}>
                                {propertiesDivs}
                            </Box>
                        </Box>
                        {sampleImages.length>0?(<Typography variant="h6" color='rgba(255,255,255,0.7)' fontWeight={600} fontSize={'1.1rem'}>Cover Image</Typography>):null}
                        {sampleImages.length>0?<Box display={'flex'} flexDirection={'column'} gap={1}>
                            <Box display={'flex'} width={1} sx={{aspectRatio:2}} bgcolor={theme.palette.primary.main} borderRadius={2} border={'2px solid rgba(255,255,255,0.2)'} position='relative' overflow={'hidden'} key={0}>
                                <Image src={sampleImages[0]} layout={'fill'} objectFit={'cover'} objectPosition="center" alt="Cover Image" onLoad={(e)=>{setImagesLoaded((prev)=>{
                                            let updated = [...prev];
                                            prev[0] = true;
                                            return updated;
                                        })}} className={imagesLoaded[0]?'imageLoaded':''}/>
                                <div className="imagePlaceholder w-full h-full absolute top-0 left-0 z-[1] pointer-events-none" ></div>
                            </Box>
                            {sampleImages.length>1?<Box display={'flex'} gap={1}>
                                {sampleImages.slice(1).map((image, index)=>(
                                    <Box display={'flex'} width={1} sx={{aspectRatio:2, cursor:'pointer'}} bgcolor={'rgba(255,255,255,0.5)'} borderRadius={2} border={'2px solid rgba(255,255,255,0.2)'} position='relative' overflow={'hidden'} key={index+1} >
                                        <Image src={image} layout={'fill'} objectFit={'cover'} objectPosition="center" alt="Cover Image" onLoad={(e)=>{setImagesLoaded((prev)=>{
                                            let updated = [...prev];
                                            prev[index+1] = true;
                                            return updated;
                                        })}} onClick={()=>setSampleImages((prev)=>{
                                            let updated = [...prev];
                                            updated[0] = updated[index+1];
                                            updated[index+1] = prev[0];
                                            return updated
                                        })} className={imagesLoaded[index+1]?'imageLoaded':''}/>
                                        <div className="imagePlaceholder w-full h-full absolute top-0 left-0 z-[1] pointer-events-none" ></div>
                                    </Box>
                                ))}
                            </Box>:null}
                        </Box>:null}
                        <Button variant="outlined" sx={{my:1, width:'100%'}} style={{marginTop:16}} onClick={()=>{handleItemAdd()}}>Add Item</Button>
                        
                        <Box maxHeight={showModalError?200:0} overflow={'hidden'}>
                            <Box display={'flex'} alignItems={'center'} gap={1} className='text-red-500 border-[1px] border-red-500 rounded-lg' py={0.5} px={1}>
                                <Error/>
                                <Typography variant="h6" fontWeight={400} fontSize={'1.1rem'} >{modalError}</Typography>
                            </Box>
                        </Box>
                    </Box>
            </Modal>
    )
}