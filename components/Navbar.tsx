import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { AccountCircle, Code, GitHub, Language, LinkedIn } from "@mui/icons-material";
import { Button, Divider, Stack, Typography } from "@mui/material";
import Image from "next/image";

export default function Navbar()
{
    return(
        <Stack direction="row" justifyContent="space-between" alignItems="center" px={3} height={80} sx={{borderBottom:'1px solid rgba(255,255,255,0.2)'}}>
            <Stack direction="row" alignItems="center" padding={2} position={'relative'} gap={1}>
                <Image src="/headpantryBanner.svg" alt="Logo" width={240} height={30}/>
                <Divider orientation="vertical" sx={{height:'30px', border:'1px solid rgba(255,255,255,0.2)'}}/>
                <Typography variant="h6" sx={{opacity:0.8}}>Made by <a href="https://akhiltrivedi.me" target="_blank"><strong>Akhil Trivedi</strong></a> for </Typography>
                <a href="https://headstarter.co" target="_blank"><Image src="/headstarterWhite.svg" alt="HeadStarter Logo" width={160} height={20} className="opacity-80"/></a>
            </Stack>
            <Stack direction="row" justifyContent="space-between" alignItems="center" padding={2} gap={2}>
                <a href="https://github.com/akhiltrivedix/headpantry" target="_blank"><Code sx={{'&:hover':{color:'primary.main'}}}/></a>
                <a href="https://akhiltrivedi.me" target="_blank"><Language sx={{'&:hover':{color:'primary.main'}}}/></a>
                <a href="https://linkedin.com/in/akhiltrivedix" target="_blank"><LinkedIn sx={{'&:hover':{color:'primary.main'}}}/></a>
                <a href="https://github.com/akhiltrivedix" target="_blank"><GitHub sx={{'&:hover':{color:'primary.main'}}}/></a>
                <SignedOut>
                    <SignInButton>
                        <Button variant="outlined" sx={{fontWeight:'bold', px:1.5}}><AccountCircle className="mr-1"/> Sign In</Button>
                    </SignInButton>
                </SignedOut>
                <SignedIn>
                    <UserButton />
                </SignedIn>
            </Stack>
            
        </Stack>
    )
}