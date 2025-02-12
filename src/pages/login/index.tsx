import React from 'react'
import { useSession, signIn, signOut } from "next-auth/react"
import Nav from '../../components/Nav';

const LoginPage: React.FC = ({ }) => {
    const { data: session } = useSession();

    if (!session) {
        return (
            <div className="text-center w-full">
                <button onClick={() => signIn('google')} className='button-filled'>Login with Google</button>
            </div>
        );
    }

    return (
        <div className="bg-green-900 w-screen h-screen flex items-center">
            <div className="">logged in {session.user?.email}</div>
        </div>
    );
}
export default LoginPage;