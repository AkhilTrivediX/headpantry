import FollowingBlob from '@/components/followingBlob';
import Pantry from '@/components/Pantry';
import PantryContextProvider from '@/components/pantryContext';
import PantryList from '@/components/PantryList';
import { SignedIn, SignedOut } from '@clerk/nextjs';
import { auth, currentUser } from '@clerk/nextjs/server';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { green } from '@mui/material/colors';


export default function Home() {  

  return (
    <Box display="flex" width={1} height={1} position={'relative'} overflow={'hidden'}>
      <FollowingBlob/>
      <SignedIn>
        <PantryContextProvider>
          <PantryList/>
        </PantryContextProvider>
      </SignedIn>
      <SignedOut>
          <Box display={'flex'} justifyContent={'center'} alignItems={'center'} width={1} height={1}>
            <Typography variant="h2">Please sign in to use the app</Typography>
          </Box>
      </SignedOut>
    </Box>
  );
}
