import theme from "@/theme";
import { Delete, Edit, ShoppingBag, ShoppingBasket } from "@mui/icons-material";
import { alpha, Box, Typography } from "@mui/material";

export default function PantryCard({icon, name, description, editThisPantry, deleteThisPantry}:{icon?:JSX.Element, name:string, description:string, editThisPantry:any, deleteThisPantry:any}){
    return(
        <div className="MuiBox-root animationParent relative">
                    <div className='border-[2px] absolute h-full w-full top-0 left-0 rounded-[14px] opacity-0 fadeInAnimation shiftAnimation' style={{borderColor:theme.palette.primary.main}}></div>
                    <Box border={'2px solid rgba(255,255,255,0.2)'} sx={{
                        zIndex:1,
                    }} padding={2} borderRadius={4} height={170} width={300} position={'relative'}>
                        <Box display={'flex'} gap={2} alignItems={'center'}>
                            <Box p={1} border={'2px solid rgba(255,255,255,0)'} borderRadius={4} sx={{opacity:0.8}}>{icon ||<ShoppingBag fontSize="large"/>}</Box>
                            <div className="flex items-center gap-2 opacity-0 fadeInAnimation">
                                <Box p={1} border={'2px solid rgba(255,255,255,0)'} borderRadius={4} sx={{opacity:0.8, '&:hover':{borderColor:alpha(theme.palette.primary.main,0.8), cursor:'pointer', color:theme.palette.primary.main, backgroundColor: alpha(theme.palette.secondary.dark,0.6)}}} onClick={editThisPantry}><Edit fontSize="medium"/></Box>
                                <Box p={1} border={'2px solid rgba(255,255,255,0)'} borderRadius={4} sx={{opacity:0.8, '&:hover':{borderColor:'rgba(255,0,0,0.8)', cursor:'pointer', color:'red', backgroundColor: alpha(theme.palette.secondary.dark,0.6)}}} onClick={deleteThisPantry}><Delete fontSize="medium"/></Box>
                            </div>
                        </Box>
                        <Typography variant="h4" fontWeight={700} sx={{opacity:0.8}}>{name}</Typography>
                        <Box overflow={'hidden'} textOverflow={'ellipsis'}><Typography variant="h6" fontWeight={500} textOverflow={'ellipsis'} noWrap sx={{opacity:0.8}}>{description}</Typography></Box>
                    </Box>
                    <div className="absolute h-full w-full top-0 left-0 rounded-[14px] border-2 border-transparent" style={{backgroundColor:theme.palette.secondary.dark}}></div>
                    <div className="absolute h-full w-full top-0 left-0 rounded-[14px] border-2 fadeInAnimation headGradientBG opacity-0" style={{ borderColor:theme.palette.primary.main}}></div>
                </div>
    )
}