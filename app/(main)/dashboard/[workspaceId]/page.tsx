import React from 'react'

const WorkSpace = async({params}:{params: Promise<{workspaceId : string }>}) =>{ 
    const {workspaceId}= await params; 
  return (
    <div>WorkSpace</div>
  )
}

export default WorkSpace