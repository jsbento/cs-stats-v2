import React from "react";
import NavBar from "./NavBar";

interface LayoutProps {
    children: React.ReactElement;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <>
            <div className="relative z-10">
                <NavBar />
                <main>{ children }</main>
            </div>
        </>
    );
}

export default Layout;