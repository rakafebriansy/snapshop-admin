import { useSession } from "next-auth/react";
import Nav from "../components/Nav";
import { useRouter } from "next/router";
import React from "react";

interface LayoutProps {
    children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }: LayoutProps) => {
    const { data: session } = useSession();
    const { push } = useRouter();

    if (!session) {
        push('/login');
    }

    return (
        <div className="bg-green-900 w-screen h-screen flex">
            <Nav />
            <div className="bg-white flex-grow mt-2 mr-2 mb-2 rounded-lg p-4">
                {children}
            </div>
        </div>
    );
}

export default Layout;