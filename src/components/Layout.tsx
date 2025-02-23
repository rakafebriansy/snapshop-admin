import { useSession } from "next-auth/react";
import Nav from "../components/Nav";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

interface LayoutProps {
    children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }: LayoutProps) => {
    const { status } = useSession();
    const { push, pathname } = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            push('/login');
        }
    }, [status, pathname]);

    if (status === "loading") {
        return <div className="text-black text-center mt-10">Loading...</div>;
    }

    return (
        <div className="bg-green-900 w-screen h-screen flex">
            <Nav pathname={pathname} />
            <div className="bg-white flex-grow mt-2 mr-2 mb-2 rounded-lg p-4 overflow-y-auto">
                {children}
            </div>
        </div>
    );
}

export default Layout;