import React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from './ui/button'
import {Link} from 'react-router'

const MainBody = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="p-6 shadow-lg w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle className='text-3xl font-bold mb-2'>Smart Cover Letter</CardTitle>
          <CardDescription className='text-lg text-gray-600'>Need a professionally crafted cover letter? Click the button below to generate one tailored to your needs!</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Link to="/form">
          <Button className='bg-blue-800 text-lg px-8 py-3 rounded-md hover:bg-blue-700 transition-colors duration-200'>Generate Now!!!</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}

export default MainBody