'use client'
import { useUser } from "@clerk/nextjs";
import { createContext, useState, useContext, useEffect } from "react";

const PantryContext = createContext({});

export default function PantryContextProvider({children}: {children: React.ReactNode}) {

    const [pantry, setPantry] = useState({});
    
    const {isLoaded, isSignedIn, user} = useUser();

    useEffect(()=>{
        getPantries();
    },[isLoaded, isSignedIn,user])
    async function getPantries(){ 
    if(!isLoaded || !isSignedIn || !user) return;
    let res = await fetch(process.env.NEXT_PUBLIC_BASE_URL+`/api/database?requestType=getPantries&user=${user.emailAddresses[0].emailAddress}`);
    let data = await res.json();
    setPantry({update:setPantry, data:data, userEmail: user.emailAddresses[0].emailAddress});
    }
    return (<PantryContext.Provider value={pantry}>{children}</PantryContext.Provider>)
}

export const usePantryContext = () => useContext(PantryContext);