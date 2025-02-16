import React from 'react'
import { signIn } from "next-auth/react"
import { useRouter } from 'next/router'
import logger from '../../lib/logger'

const LoginPage: React.FC = ({ }) => {

    const login = async () => {
        try {
            await signIn('google');
        } catch (error) {
            logger.error(`/pages/login: ${(error as Error).message}`);
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