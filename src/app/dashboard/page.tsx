import { getUser } from '@/hooks/getUser'
import React from 'react'
import { SignOut } from '../_components/signOut';

const Dashboard = async () => {
    const session = await getUser({ 
        redirectTo: "/sign-in" 
    });

    return (
        <div>
            <h1>Dashboard for {session?.name}</h1>
            <SignOut />
        </div>
    )
}


export default Dashboard;