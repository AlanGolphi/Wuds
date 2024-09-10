"use client"
import { useAuth, useUser } from "@clerk/nextjs"

export default function TestSignedIn() {
  const { userId, sessionId } = useAuth()
  const { isSignedIn, user } = useUser()
  console.log(userId, sessionId, isSignedIn, user)

  return <p>Signedin Page</p>
}
