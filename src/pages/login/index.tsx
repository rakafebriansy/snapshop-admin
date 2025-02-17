import React from 'react'
import { signIn } from "next-auth/react"
import { useRouter } from 'next/router'
import logger from '../../lib/logger'
import { swalAlert } from '../../lib/swal'

const LoginPage: React.FC = ({ }) => {

    const login = async (): Promise<void> => {
        try {
            await signIn('google');
        } catch (error) {
            logger.error(`/pages/login: ${(error as Error).message}`);
            swalAlert({
                isSuccess: false,
                title: 'Something went wrong!',
                text: `${(error as Error).message}.`
            });
        }
    }

    return (
        <div className="text-center w-full">
            <button onClick={login} className='button-filled'>Login with Google</button>
        </div>
    );
}
export default LoginPage;