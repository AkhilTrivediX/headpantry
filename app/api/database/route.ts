import { initializeApp } from "firebase/app";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";



const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "headpantry.firebaseapp.com",
  projectId: "headpantry",
  storageBucket: "headpantry.appspot.com",
  messagingSenderId: "695628981220",
  appId: "1:695628981220:web:fe555464de152b2c221df1",
  measurementId: "G-3R9KSVJBV5"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function GET(request: Request){
    const {searchParams} = new URL(request.url);
    
    const requestType = searchParams.get('requestType')!;

    const user = searchParams.get('user')!;
    
    if(!user){
        return Response.json({error: 'Unauthorized'}, {status: 403})
    }

    //const emailAddress = user.emailAddresses[0].emailAddress;

    switch(requestType){
        case 'getPantries':
            const docRef = doc(db, "pantries", user);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                return Response.json({...docSnap.data()})
            }
            else{
                await setDoc(docRef, {});
                return Response.json({})
            }
        case 'pantryItems':
            let pantryName = searchParams.get('pantryName')!;
            if(!pantryName) return Response.json({error: 'Pantry name needed!'})
            const docRef2 = doc(db, user, pantryName);
            const docSnap2 = await getDoc(docRef2);
            if (docSnap2.exists()) {
                return Response.json({...docSnap2.data()})
            }
            else{
                return Response.json({error: 'Pantry not found'})
            }
        default:
            return Response.json({error: 'Invalid request type'})
    }

}

export async function POST(request: Request){
    const {searchParams} = new URL(request.url);
    const requestType = searchParams.get('requestType')!;
    const user = searchParams.get('user')!;
    const data = await request.json();
    if(!user){
        return Response.json({error: 'Unauthorized'}, {status: 403})
    }
    switch(requestType){
        case 'setPantry':
            const docRef = doc(db, "pantries", user);
            await setDoc(docRef, data);
            return Response.json({})
        default:
            return Response.json({error: 'Invalid request type'})
    }
}