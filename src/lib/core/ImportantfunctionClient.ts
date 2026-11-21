


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