import { getUser } from '@/hooks/getUser'
import React from 'react'

const Dashboard = async () => {
    const session = await getUser({ 
        redirectTo: "/sign-in" 
    });

    return (
        <>
        <div>
            hi
        </div>
        </>
      )
    
}


export default Dashboard;