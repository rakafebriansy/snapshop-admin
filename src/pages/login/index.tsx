import React from 'react'
import { signIn } from "next-auth/react"
import { useRouter } from 'next/router'
import logger from '../../lib/logger'
import { swalAlert } from '../../lib/swal'
import { AxiosError } from 'axios'

const LoginPage: React.FC = ({ }) => {

    const login = async (): Promise<void> => {
        try {
            await signIn('google');
        } catch (error) {
            const message = error instanceof AxiosError ? error.response?.data.errors : (error as Error).message;
            logger.error(`/pages/login@login: ${message}`);
            swalAlert({
                isSuccess: false,
                title: 'Something went wrong!',
                text: `${message}.`
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