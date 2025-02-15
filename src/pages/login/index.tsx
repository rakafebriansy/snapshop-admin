import React from 'react'
import { signIn } from "next-auth/react"
import { useRouter } from 'next/router'

const LoginPage: React.FC = ({ }) => {

    const login = async () => {
        try {
            await signIn('google');
        } catch (Error) {
            alert('Error');
        }
    }

    return (
        <div className="text-center w-full">
            <button onClick={login} className='button-filled'>Login with Google</button>
        </div>
    );
}
export default LoginPage;