import { headers } from "next/headers";
import { auth } from "../auth";
import { authClient } from "../auth-client";


export const getSessionByserver=async ()=>{
     const session = await auth.api.getSession({
            headers: await headers(),
        });
        return session
}

export const getSessionByclient=async()=>{
       const { 
        data: session, 
        isPending, //loading state
        error, //error object
        refetch //refetch the session
    } = authClient.useSession() 
    return [session,isPending];
}