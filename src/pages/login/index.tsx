import React, { useEffect } from 'react'
import { signIn, useSession } from "next-auth/react"
import logger from '../../lib/logger'
import { swalAlert } from '../../lib/swal'
import { AxiosError } from 'axios'
import { useRouter } from 'next/router'
import Cookies from 'js-cookie' 

const LoginPage: React.FC = ({ }) => {

    const { data: session, status } = useSession();
    const { push } = useRouter();

    useEffect(() => {
        if (status === "authenticated" && session?.user) {
            Cookies.set('auth-token', session.user.email, { expires: 1, path: '/' });
            push('/');
        }
    }, [session, status, push]);


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