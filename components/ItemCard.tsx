import theme from "@/theme";
import { BorderColor, Delete, Edit, KeyboardArrowDown, KeyboardArrowUp, Opacity, Photo, ShoppingBag, ShoppingBasket } from "@mui/icons-material";
import { alpha, Box, Divider, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import Image from "next/image";

export default function ItemCard({name, quantity, properties, coverImage, setQuantity, callEditModal, deleteThisItem }:{name:string, quantity:{value:number, unit:string}, properties:any, coverImage:string, setQuantity:any, callEditModal:any, deleteThisItem:any}){
    return(
        <div className="MuiBox-root animationParent relative rounded-[14px] overflow-hidden">
                    <div className='border-[2px] absolute h-full w-full top-0 left-0 rounded-[14px] opacity-0 fadeInAnimation shiftAnimation ' style={{borderColor:theme.palette.primary.main}}></div>
                    <Image src={coverImage} alt={name} layout='fill' objectFit="cover" objectPosition="center" className="z-[1] grayscale colorAnimation opacity-30"/>
                    <Box border={'2px solid rgba(255,255,255,0.2)'} sx={{
                        zIndex:1,
                    }} padding={2} borderRadius={4} height={170} width={300} position={'relative'} overflow={'hidden'}>
                        
                        <Typography variant="h4" fontWeight={700} sx={{opacity:0.8}}>{name}</Typography>
                        <Box display={'flex'} gap={2} alignItems={'center'}>
                            <Box display={'flex'} alignItems={'center'}>
                                <Box display={'flex'} flexDirection={'column'} border={'2px solid rgba(255,255,255,0.2)'} borderRadius={4} overflow={'hidden'}>
                                    <Box sx={{cursor:'pointer', '&:hover':{color:theme.palette.primary.main, bgcolor: alpha(theme.palette.secondary.dark,0.6)}}} display={"flex"} justifyItems={'center'} alignItems={'center'} onClick={() => setQuantity(quantity.value+1, quantity.unit)}><KeyboardArrowUp fontSize="small"/></Box>
                                    <Divider orientation="horizontal" sx={{borderBottomWidth:2, borderColor: 'rgba(255,255,255,0.2)'}} flexItem/>
                                    <Box sx={{cursor:'pointer', '&:hover':{color:theme.palette.primary.main, bgcolor: alpha(theme.palette.secondary.dark,0.6)}}} display={"flex"} justifyItems={'center'} alignItems={'center'} onClick={() => setQuantity(Math.max(0, quantity.value-1), quantity.unit)}><KeyboardArrowDown fontSize="small"/></Box>
                                </Box>
                                <Box display={'flex'}>
                                    <TextField value={quantity.value} size="small" onChange={(e)=>{setQuantity(parseFloat(e.target.value), quantity.unit)}} sx={{opacity:0.8, marginLeft:1}} inputProps={{style:{width:'30px'}}}/>
                                </Box>
                                <Box display={'flex'} sx={{opacity:0.8}}>
                                    <FormControl sx={{m: 1, minWidth: 80, maxWidth:80, margin:0, '&:hover':{marginLeft:1}}}>
                                        <Select sx={{
                                            '.MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'rgba(228, 219, 233, 0)',
                                            },
                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'rgba(228, 219, 233, 0)',
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
                                        }} displayEmpty defaultValue={quantity.unit} inputProps={{ 'aria-label': 'Without label' }} onChange={(e) => setQuantity(quantity.value, e.target.value)}>
                                            <MenuItem value='Units'>Units</MenuItem>
                                            <MenuItem value='g'>g</MenuItem>
                                            <MenuItem value='mL'>mL</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>
                            </Box>
                            <div className="flex items-center justify-around gap-2 opacity-0 fadeInAnimation">
                                <Box p={1} border={'2px solid rgba(255,255,255,0)'} borderRadius={4} sx={{opacity:0.8, '&:hover':{borderColor:alpha(theme.palette.primary.main,0.8), cursor:'pointer', color:theme.palette.primary.main, backgroundColor: alpha(theme.palette.secondary.dark,0.6)}}} onClick={callEditModal}><Edit fontSize="small"/></Box>
                                <Box p={1} border={'2px solid rgba(255,255,255,0)'} borderRadius={4} sx={{opacity:0.8, '&:hover':{borderColor:'rgba(255,0,0,0.8)', cursor:'pointer', color:'red', backgroundColor: alpha(theme.palette.secondary.dark,0.6)}}}><Delete fontSize="small" onClick={deleteThisItem}/></Box>
                            </div>
                        </Box>
                        {properties.length>0?<Box mt={0.5} display={'flex'} gap={1}>
                            {properties.map((property:any, index:number) => (
                                (property.property.length>0 && property.value.length>0)?<Box display={'flex'} border={'2px solid rgba(255,255,255,0.2)'} borderRadius={4} px={1} py={0.5} width={'max-content'} alignContent={'center'} justifyContent={'center'} sx={{opacity:0.8, '&:hover':{borderColor:alpha(theme.palette.primary.main,0.8), cursor:'pointer', color:theme.palette.primary.main, backgroundColor: alpha(theme.palette.secondary.dark,0.6), opacity:1}}} key={index}>
                                <Typography sx={{opacity:0.8}} fontWeight={300}>{property.property}</Typography>
                                <Divider orientation="vertical" sx={{borderBottomWidth:2, borderColor: 'rgba(255,255,255,0.2)',mx:1}} flexItem/>
                                <Typography sx={{opacity:0.8}} fontWeight={800}>{property.value}</Typography>
                                </Box>:null
                            ))}
                        </Box>:null}
                    </Box>
                    <div className="absolute h-full w-full top-0 left-0 rounded-[14px] border-2 border-transparent" style={{backgroundColor:theme.palette.secondary.dark}}></div>
                    <div className="absolute h-full w-full top-0 left-0 rounded-[14px] border-2 fadeInAnimation opacity-0" style={{ borderColor:theme.palette.primary.main}}></div>
                </div>
    )
}