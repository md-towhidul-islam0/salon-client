

import { headers } from "next/headers";
import { auth } from "../auth";
import { authClient } from "../auth-client";
import { BookingFormData } from "@/app/services/[id]/BookingDialog";


export const getSessionByserver=async ()=>{
     const session = await auth.api.getSession({
            headers: await headers(),
        });
        return session
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


export const Eachservicesfunc=async(id:string |null)=>{
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!baseUrl) {
      throw new Error("Missing NEXT_PUBLIC_API_URL");
    }
    const session=await getSessionByserver();
    console.log("session",session?.session.token);
    const response = await fetch(`${baseUrl}/services/${id}`, {
      method: "GET",
      headers: {
        authorization: `Bearer ${session?.session.token}`,
        "Content-Type": "application/json",
      },
    });
  
    return response;
} 

export const Allbookingsfunc=async()=>{
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;      
    const res=await fetch(`${baseUrl}/appointments`, {
        method: "GET",
        headers: {  
          "Content-Type": "application/json",
        },
      });
      const data=await res.json();
      return data;
}

export const EachUserbyId=async(id:string |null)=>{
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;  
    const res=await fetch(`${baseUrl}/users/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data=await res.json();
      return data;
}


