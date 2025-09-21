import { auth } from '@/auth'
import { getUserSubscriptionStatus,getFolders, getPersonalWorkSpace, getCollboratorWorkspace, getsharedWorksace } from '@/lib/queries/db.queries'
import { setEngine } from 'crypto';
import { redirect } from 'next/navigation';
import React from 'react'

const Sidebar = async({workspaceid}:{workspaceid:string}) => { 
    const session= await auth();   
    if(!session){
        redirect("/login")
    }
    const {data:subscriptionData,error:subscriptionerror}= await getUserSubscriptionStatus(session?.user.id); 

    const {data:folderData,error:folderError}= await getFolders(workspaceid); 

    if(subscriptionerror || folderError ){
        redirect("/dashboard")
    }   

    const presonalWokspace= await getPersonalWorkSpace(session?.user.id as string); 
    const collaboratorWorkspace= await getCollboratorWorkspace(session?.user.id as string) 
    const sharedWorkSpace= await getsharedWorksace(session?.user.id as string)
  return (
    <div>Sidebar</div>
  )
}

export default Sidebar