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

export const deleteItem=(itemId:string,endpoint:string)=>{
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!baseUrl) {
      throw new Error("Missing NEXT_PUBLIC_API_URL");
    }

    return fetch(`${baseUrl}/${endpoint}/${itemId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
}


export const getAllservices=async(query:string |null)=>{
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!baseUrl) {
      throw new Error("Missing NEXT_PUBLIC_API_URL");
    }
    const response = await fetch(`${baseUrl}/services?${query}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  
    return response;
} 