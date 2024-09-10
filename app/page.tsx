import { SignedOut, SignedIn, SignInButton, UserButton } from "@clerk/nextjs"
import { auth, currentUser } from "@clerk/nextjs/server"
import TestSignedIn from "@/components/clerk/test-signed-in"

export default function Home() {
  const user = currentUser()
  const authInfo = auth()
  return (
    <>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
        {user && <p>{JSON.stringify(user)}</p>}
        {authInfo && <p>{JSON.stringify(authInfo)}</p>}
      </SignedIn>
      <TestSignedIn />
    </>
  )
}
