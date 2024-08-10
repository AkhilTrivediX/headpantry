'use client'

import { ArrowLeft, Assignment, Blender, Close, CookieRounded, LocalDining, Microwave, OutdoorGrill, PeopleAlt, PreviewRounded, Replay, Timer } from "@mui/icons-material";
import { Box, Button, Divider, Typography } from "@mui/material";
import { Cookie } from "next/font/google";
import { usePantryContext } from "./pantryContext";
import { use, useEffect, useRef, useState } from "react";
import { useTheme, Theme, alpha } from "@mui/material/styles";
import Image from "next/image";

export default function Recipes({showError, pantryId}:{showError:Function, pantryId: string})
{

    const pantryData = usePantryContext() as any;
    const theme: Theme = useTheme();
    const [recipes, setRecipes] = useState([]);
    const [mode, setMode] = useState(-1);
    const dishesLoadingRef = useRef<HTMLDivElement>();
    const [generatedRecipe, setGeneratedRecipe] = useState<Record<string, any>>({});
    const [toolImgs, setToolImgs] = useState<Record<string, any>>({});
    const [showRecipes, setShowRecipes] = useState(false);

    async function getrecipes()
    {
        const loadingRef = dishesLoadingRef.current;
        if(loadingRef) {
            loadingRef.style.width = '0%';
            loadingRef.style.opacity = '1';
        }
        let loadingTimeout = startLoadingVisual();
        console.log('Got here', pantryData.data[pantryId].items[0].quantity.value)
        if(!pantryData || !pantryData.data || !pantryData.data[pantryId].items){
            showError('Pantry is loading. Please Wait!');
            return;
        }
        if(Object.keys(pantryData.data[pantryId].items).length === 0){
            showError('Pantry is empty. Please add some items to it!');
            return;
        }
        const ingredients = pantryData.data[pantryId].items.map((item:any) => (item.name+' : '+item.quantity.value+' '+item.quantity.unit));
        const recipes = await fetch(`/api/getRecipe?requestType=getRecipes&ingredients=${ingredients}`);
        const dishes = (await recipes.json())
        console.log(dishes.dishes)
        setRecipes(dishes.dishes || []);
        clearTimeout(loadingTimeout);
        if(loadingRef) loadingRef.style.width = '100%';
        if(loadingRef) loadingRef.style.opacity = '0';
    }

    function startLoadingVisual()
    {
        return setTimeout(()=>{
            let loadingRef = dishesLoadingRef.current;
            if(loadingRef){
                console.log('Updating Width')
                let oldPer = parseFloat(loadingRef.style.width.split('%')[0]);
                loadingRef.style.width = (oldPer+(100-oldPer)/10).toString()+'%';
                if(oldPer<90) return startLoadingVisual();
            }
        }, 300);
    }

    useEffect(()=>{
        if(mode!=-1) {
            generateRecipe();
            getToolImgs();
        }
    },[mode])

    if(mode != -1)
    {
        console.log(recipes[mode])
        return (
            <Box display='flex' flexDirection={'column'} borderLeft={'1px solid rgba(255,255,255,0.2)'} width={0.4} height={1} padding={2} sx={{opacity:0.8, overflowY:'scroll'}} position={'relative'}>
                <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
                    <Typography variant='h4' sx={{fontWeight:'700', color:'white'}}>{(recipes[mode] as any).name}</Typography>
                    <Close fontSize="large" onClick={() => {setMode(-1)}} sx={{cursor:'pointer', padding:1, '&:hover':{backgroundColor:'rgba(255,255,255,0.2)'}, borderRadius:2}}/>
                </Box>
                <Box display={'flex'} gap={3}>
                    <Box display={'flex'} alignItems={'center'} gap={0.5}><Timer fontSize="small"/> {(recipes[mode] as any).prep_time}</Box>
                    <Box display={'flex'} alignItems={'center'} gap={0.5}><PeopleAlt fontSize="small"/> {(recipes[mode] as any).servings}</Box>
                </Box>
                <Divider sx={{marginY:1, borderColor:'rgba(255,255,255,0.5)'}}/>
                <Typography variant='h5' sx={{fontWeight:'700', color:'white'}}>Ingredients</Typography>
                <Box display={'flex'} flexWrap={'wrap'} gap={1}>
                    {(recipes[mode] as any).ingredients.map((ingredient:any, ingIndex: number) => {
                    let simItem = pantryData.data[pantryId].items.filter((item:any) => item.name === ingredient.name)[0];
                    return(
                        <Box display={'flex'} flexDirection={'column'} border={'1px solid rgba(255,255,255,0.2)'} borderRadius={2} py={1} px={2} key={ingIndex} position={'relative'} overflow={'hidden'}>
                            <Typography variant='h6' sx={{fontWeight:'700', color:'white', opacity:0.8}} zIndex={1}>{ingredient.name}</Typography>
                            {
                                simItem ? <Image className="opacity-50" src={simItem.coverImages[0]} alt={simItem.name} layout="fill" objectFit="cover" objectPosition="center"/> : <></>
                            }
                            {
                                simItem ? <Box display={'flex'} flexDirection={'column'} alignItems={'center'}>
                                <Box width={'6rem'} height={'0.8rem'} borderRadius={4} border={'2px solid rgba(255,255,255,0.2)'} mr={1.5} overflow={'hidden'} zIndex={1} sx={{backdropFilter:'blur(10px)'}}>
                                    <Box width={parseFloat(ingredient.quantity.split(' ')[0])/simItem.quantity.value} height={1} bgcolor={'rgba(255,255,255,0.6)'}/>
                                </Box>
                                <Typography fontSize={'medium'} color={'rgba(255,255,255,0.8)'}>{ingredient.quantity.split(' ')[0]}/{simItem.quantity.value} {ingredient.quantity.split(' ')[1]}</Typography>
                                </Box> : <Box display={'flex'} flexDirection={'column'} alignItems={'center'}>
                                <Typography fontSize={'medium'} color={'rgba(255,255,255,0.8)'}>{ingredient.quantity}</Typography>
                                </Box>
                            }
                        </Box>
                    )
                    })}
                </Box>
                <Divider sx={{marginY:1, borderColor:'rgba(255,255,255,0.5)'}}/>
                <Typography variant='h5' sx={{fontWeight:'700', color:'white'}}>Tools</Typography>
                <Box display={'flex'} flexWrap={'wrap'} gap={1}>
                    {(recipes[mode] as any).tools.map((tool:any, ingIndex: number) => (
                        <Box display={'flex'} flexDirection={'column'} border={'1px solid rgba(255,255,255,0.2)'} borderRadius={2} height={'5rem'} sx={{aspectRatio:'16/9'}} key={ingIndex} position={'relative'} overflow={'hidden'} justifyContent={'center'} alignItems={'center'}>
                            <Typography variant='h6' sx={{fontWeight:'700', color:'white', opacity:0.8}} zIndex={1}>{tool}</Typography>
                            {toolImgs[tool] ? <Image src={toolImgs[tool]} className="opacity-50" alt={tool} layout="fill" objectFit="cover" objectPosition="center"/> : <></>}
                        </Box>
                    ))}</Box>
                <Divider sx={{marginY:1, borderColor:'rgba(255,255,255,0.5)'}}/>
                <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'}><Typography variant='h5' sx={{fontWeight:'700', color:'white'}}>Procedure</Typography><Replay fontSize="large" sx={{padding:1, border:'1px solid transparent', borderRadius:2, cursor:'pointer', '&:hover':{backgroundColor:alpha(theme.palette.primary.main, 0.2), borderColor:theme.palette.primary.main}}} onClick={() => {generateRecipe(true)}}/></Box>
                {formatGeneration(generatedRecipe[(recipes[mode] as any).name] || '')}
            </Box>
        )
    }


    async function generateRecipe(force = false){
        if(generatedRecipe[mode] && !force) return;
        const res = await fetch(`/api/getRecipe?requestType=generateRecipe&ingredients=${(recipes[mode] as any).ingredients.map((ingredient:any) => (ingredient.name+' : '+ingredient.quantity))}&recipeName=${(recipes[mode] as any).name}&tools=${(recipes[mode] as any).tools.join(',')}&prep_time=${(recipes[mode] as any).prep_time}`);
        if(!res.body){
            console.log('No body in generation Response!');
            return;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let done = false;
        let generation = '';
        while(!done){
            const {value, done: doneReading} = await reader.read();
            done = doneReading;
            const chunkValue = decoder.decode(value);
            if(chunkValue){
                generation += chunkValue;
                let oldGR = {...generatedRecipe};
                oldGR[(recipes[mode] as any).name] = generation
                setGeneratedRecipe(oldGR);
            }
        }
        console.log('Complete Generation :', generation)
    }

    async function getToolImgs(){
        let oldTI = {...toolImgs};
        for(let i = 0; i < (recipes[mode] as any).tools.length; i++){
            if(!oldTI[(recipes[mode] as any).tools[i]]){
                oldTI[(recipes[mode] as any).tools[i]] = await fetch(`/api/getstock?stockQuery=${(recipes[mode] as any).tools[i]}&count=1`).then(photosRes=>photosRes.json().then(photos=>photos.photos.photos[0].src.original))
            }
        }
        console.log('Tool Imgs: ', oldTI);
        setToolImgs(oldTI);
    }

    function formatGeneration(generation: string)
    {
        let steps = 1;
        return generation.split('\n').map((line: string, index: number) => {
            if(line.startsWith('-')) return (
                <Box key={index} display={'flex'} alignItems={'center'}p={1} gap={1} border={'1px solid rgba(255,255,255,0.2)'} borderRadius={2} my={0.5} sx={{opacity:0.8,'&:hover':{color:'primary.main', borderColor:'primary.main'}, '&:hover .divider':{borderColor:'primary.main'}}}>
                    <Typography variant='h6' fontWeight='700' style={{aspectRatio:'1/1', textAlign:'center'}}>{steps++}</Typography>
                    <Divider orientation="vertical" className="divider" sx={{borderWidth:1}}/>
                    <Typography variant='body1' fontWeight={600}>{line.substring(2)}</Typography>
                </Box>
            )
            else if(line.startsWith('Note')){
                return (
                    <Box key={index} display={'flex'} alignItems={'center'}p={1} gap={1} border={'1px solid rgba(255,255,255,0.2)'} borderRadius={2} my={0.5} sx={{opacity:0.8,'&:hover':{color:'primary.main', borderColor:'primary.main'}, '&:hover .divider':{borderColor:'primary.main'}}}>
                    <Typography variant='h6' fontWeight='700' style={{aspectRatio:'1/1', textAlign:'center'}}>{line.split(':')[0]}</Typography>
                    <Divider className="divider" orientation="vertical" sx={{borderWidth:1}}/>
                    <Typography variant='body1' fontWeight={600}>{line.split(':')[1]}</Typography>
                    </Box>
                )
            }
            else{
                return <Typography key={index} variant='body1' sx={{opacity:0.8}}>{line}</Typography>
            }
        })
    }
    return (
        <Box display='flex' flexDirection={'column'} borderLeft={'1px solid rgba(255,255,255,0.2)'} width={showRecipes?0.4:0} height={1} position={'relative'}>
            <Box p={1} border={'1px solid rgba(255,255,255,0.2)'} borderRadius={4} sx={{cursor:'pointer',transform:'translateY(-50%) '+(showRecipes ? 'rotate(180deg)' : 'rotate(0deg)'),'&:hover':{color:'primary.main', borderColor:'primary.main'}}} position={'absolute'} top={'50%'} left={'-5rem'} onClick={() => setShowRecipes(!showRecipes)} display={'flex'} alignItems={'center'} justifyContent={'center'}><ArrowLeft fontSize="large" sx={{opacity:showRecipes?1:0}}/> <Assignment fontSize="small" sx={{position:'absolute', opacity:showRecipes?0:1}}/></Box>
            <Box display='flex' justifyContent={'end'} width={1} height={1} maxWidth={showRecipes?'1000px':'0px'} overflow={'hidden'}>
                <Box display='flex' flexDirection={'column'} borderLeft={'1px solid rgba(255,255,255,0.2)'} width={1} height={1} padding={2} position={'relative'}>
                <Typography variant='h4' sx={{fontWeight:'700', color:'white'}}>Recipes</Typography>
                <Box display={'flex'} justifyContent={'left'} width={'max-content'} alignSelf={'center'} position={'relative'}>
                    <Box ref={dishesLoadingRef} bgcolor={'primary.main'} position={'absolute'} width={0} height={1} sx={{opacity:0}} borderRadius={10} top={0} left={0}></Box>
                    <Button variant='outlined' size="medium" sx={{width:'max-content', alignSelf:'center', fontWeight:'700', display:'flex', alignItems:'center', margin:'2px', zIndex:1, backgroundColor: theme.palette.secondary.dark}} onClick={() => {getrecipes()}}><Blender fontSize='small' sx={{mr:1}}/>Get Updated Recipes</Button>
                </Box>
                <Box display={'flex'} flexDirection={'column'} py={2}>
                    {recipes.map((recipe:any, index: number) => (
                        <Box key={index} display={'flex'} flexDirection={'column'} px={2} py={1} border={'1px solid rgba(255,255,255,0.2)'} borderRadius={4} color={'rgba(255,255,255,0.8)'} sx={{'&:hover .increaseSizeOnHover':{maxHeight:(60+recipe.ingredients.length*30+recipe.tools.length*30)+'px'}, cursor:'pointer', '&:hover':{borderColor:theme.palette.primary.main, color:theme.palette.primary.main}}} position={'relative'} overflow={'hidden'} className={'animationParent'} my={0.5} onClick={() => {setMode(index)}}>
                        <Box display={'flex'} position={'absolute'} top={0} right={0} width={1} height={1} className='opacity-0 headGradientBG opacityAnimation'></Box>
                        <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'} zIndex={1}> 
                            <Typography variant='h6' fontWeight={700}>{recipe.name}</Typography>
                            <Box display={'flex'} alignItems={'center'}><Timer fontSize={'small'} /><Typography variant='h6' fontSize={'medium'}  fontWeight={500}>{recipe.prep_time}</Typography></Box>
                        </Box>
                        <Box display={'flex'} flexDirection={'column'} maxHeight={'0px'} className={'increaseSizeOnHover'} overflow={'hidden'} zIndex={1}>
                            <Divider sx={{borderColor: theme.palette.primary.main, marginBottom:'5px'}}/>
                            <Typography fontSize={'large'} fontWeight={700} color={'rgba(255,255,255,0.8)'}><LocalDining fontSize="small" style={{marginRight:'5px'}}/>Ingredients</Typography>
                            {recipe.ingredients.map((ingredient:any, ingIndex: number) => {
                                let simItem = pantryData.data[pantryId].items.filter((item:any) => item.name === ingredient.name)[0];
                                return(
                                <Box display={'flex'} key={ingIndex}>
                                <Typography fontSize={'medium'} color={'rgba(255,255,255,0.8)'} mr={4}>{ingredient.name}</Typography>
                                {simItem?(
                                    <Box display={'flex'} width={0.6} alignItems={'center'}>
                                    <Box width={'6rem'} height={'0.8rem'} borderRadius={4} border={'2px solid rgba(255,255,255,0.2)'} mr={1.5} overflow={'hidden'}>
                                        <Box width={parseFloat(ingredient.quantity.split(' ')[0])/simItem.quantity.value} height={1} bgcolor={'rgba(255,255,255,0.6)'}/>
                                    </Box>
                                    <Typography fontSize={'medium'} color={'rgba(255,255,255,0.8)'}>{ingredient.quantity.split(' ')[0]}/{simItem.quantity.value} {ingredient.quantity.split(' ')[1]}</Typography>
                                    </Box>
                                ):(
                                
                                    <Box display={'flex'} width={0.6} alignItems={'center'}>
                                    <Typography fontSize={'medium'} color={'rgba(255,255,255,0.8)'}>{ingredient.quantity}</Typography>
                                    </Box>
                                )}
                                </Box>
                            )})}
                            <Typography fontSize={'large'} fontWeight={700} color={'rgba(255,255,255,0.8)'}><Microwave fontSize="small" style={{marginRight:'5px'}}/>Tools</Typography>
                            {recipe.tools.map((tool:any, ingIndex: number) => (
                                <Box display={'flex'} key={ingIndex}>
                                    <Typography fontSize={'medium'} color={'rgba(255,255,255,0.8)'}>{tool}</Typography>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                    ))}
                </Box>
                </Box>
            </Box>
        </Box>
    )
}