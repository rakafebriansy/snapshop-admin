import Nav from "../components/Nav";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Logo from "./Logo";

interface LayoutProps {
    children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }: LayoutProps) => {
    const { pathname } = useRouter();
    const [isShowNavInMobile, setIsShowNavInMobile] = useState<boolean>(false);

    useEffect(() => {
        if (isShowNavInMobile) {
            setIsShowNavInMobile(false);
        }
    }, []);

    return (
        <div className="bg-green-900 w-screen h-screen flex">
            <Nav isShowNavInMobile={isShowNavInMobile} pathname={pathname} />
            <div className="bg-white flex-grow lg:mt-2 lg:mr-2 lg:mb-2 rounded-lg p-4 overflow-y-auto">
                <div className="flex lg:hidden items-center justify-between mb-4">
                    <button onClick={() => setIsShowNavInMobile(true)}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    </button>
                    <Logo />
                    <div className=""></div>
                </div>
                {children}
            </div>
        </div>
    );
}

export default Layout;