import Nav from "../components/Nav";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

interface LayoutProps {
    children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }: LayoutProps) => {
    const { pathname } = useRouter();

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