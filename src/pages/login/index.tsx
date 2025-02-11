import React from 'react'
import { useSession, signIn, signOut } from "next-auth/react"

const LoginPage: React.FC = ({ }) => {
    const { data: session } = useSession();

    if (!session) {
        return (
            <div className="bg-blue-900 w-screen h-screen flex items-center">
                <div className="text-center w-full">
                    <button onClick={() => signIn('google')} className='button-filled'>Login with Google</button>
                </div>
            </div>
        );
    }

    return (
        <div className="">logged in {session.user?.email}</div>
    );
}
export default LoginPage;