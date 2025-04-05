import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { getUser } from '@/hooks/getUser'
import { AlertCircle, ArrowBigLeft, Mail } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { redirect } from 'next/navigation'

const Verify = async () => {
      const user = await getUser({ allowUnauthenticated: true });
      
      if (user) {
          redirect("/dashboard");
      }
  

  return (
    <div className='flex flex-col justify-center h-screen items-center'>
        <Card className='flex flex-col md:w-lg w-xs sm:w-md p-5'>
            <CardHeader>
              <div className=' mx-auto flex items-center bg-green-100 rounded-full p-2 justify-center size-20'>

                    <Mail className='size-12 text-green-300'></Mail>
              </div>
                <CardTitle className='flex gap-6 items-center justify-center'>
                    <h1 className='text-3xl font-bold'>Check your Inbox</h1 >
                </CardTitle>
                <CardDescription className='text-center text-xl'>
                  We have sent you a verification link
                </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='bg-amber-100 w-full p-3 rounded-lg flex justify-evenly items-center'>
                <AlertCircle className='size-6 text-yellow-700'></AlertCircle>
                <span className='text-yellow-600'>Make sure to check your spam folder</span>
              </div>
            </CardContent>
            <CardFooter className='flex flex-col justify-center items-center'>
              <Link href="/sign-in" className='flex justify-center items-center dotted'> <ArrowBigLeft className='size-8'/>Go Back</Link>
              <span className='text-sm font-light'>(You may close this window)</span>
            </CardFooter>
        </Card>
    </div>
  )
}

export default Verify