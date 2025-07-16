"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { authClient } from '@/lib/auth-client'
import React, { useState } from 'react'

const page = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const onSubmit = async () => {
    authClient.signUp.email({
      name,
      email,
      password
    },{
      onError: () =>{
        window.alert("Something went Wrong")
      },
      onSuccess: () =>{
        window.alert("User Created Successfully! SExy work!")
      }
    })
  }
  const onLogin = async () => {
    authClient.signIn.email({
      email,
      password
    },{
      onError: () =>{
        window.alert("Something went Wrong")
      },
      onSuccess: () =>{
        window.alert("Login  Successfully! SExy work!")
      }
    })
  }
  return (
    <div className='flex flex-col gap-y-10'>
      <div className='p-4 flex flex-col gap-y-4'>
      <Input placeholder='name' value={name} onChange={(e) => setName(e.target.value)}/>
      <Input placeholder='email'   value={email} onChange={(e) => setEmail(e.target.value)} />
      <Input placeholder='password' type='password' value={password} onChange={(e) => setPassword(e.target.value)}/>
      <Button className='mt-4' onClick={onSubmit}>Create User</Button>
    </div>
      <div className='p-4 flex flex-col gap-y-4'>
      {/* <Input placeholder='name' value={name} onChange={(e) => setName(e.target.value)}/> */}
      <Input placeholder='email'   value={email} onChange={(e) => setEmail(e.target.value)} />
      <Input placeholder='password' type='password' value={password} onChange={(e) => setPassword(e.target.value)}/>
      <Button className='mt-4' onClick={onLogin}>Login User</Button>
    </div>
    </div>
  )
}

export default page