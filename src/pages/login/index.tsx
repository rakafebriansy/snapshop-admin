import React from 'react'
import { signIn } from "next-auth/react"

const LoginPage: React.FC = ({ }) => {
    return (
        <div className="text-center w-full">
            <button onClick={() => signIn('google')} className='button-filled'>Login with Google</button>
        </div>
    );
}
export default LoginPage;