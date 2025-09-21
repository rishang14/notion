import { auth } from '@/auth'
import { getUserSubscriptionStatus,getFolders } from '@/lib/queries/db.queries'
import { redirect } from 'next/navigation';
import React from 'react'

const Sidebar = async({workspaceid}:{workspaceid:string}) => { 
    const session= await auth();   
    if(!session){
        redirect("/login")
    }
    const {data:subscriptionData,error:subscriptionerror}= await getUserSubscriptionStatus(session?.user.id); 

    const {data:folderData,error:folderError}= await getFolders(workspaceid);
  return (
    <div>Sidebar</div>
  )
}

export default Sidebar