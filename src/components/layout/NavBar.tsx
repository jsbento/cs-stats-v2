import React, { MouseEventHandler, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import { Alert, Modal } from "@mantine/core";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { HiLogout } from "react-icons/hi";

export const NavBar: React.FC = () => {
    const router = useRouter();
    const { data } = useSession();

    const [ opened, setOpened ] = useState<boolean>( false );

    return (
        <nav className="fade-div-top z-30 h-20 p-6">
            <Modal
                withCloseButton={ false }
                opened={ opened }
                onClose={ () => setOpened( false ) }
            >
                <Alert color="red" title="Warning!">
                    You are about to be signed out of your account.
                </Alert>
                <button
                    className="mt-5 w-full rounded-md border-2 border-gray-border bg-gray-light-d px-2 py-1 text-sm font-semibold text-white drop-shadow-md transition-colors duration-200 hover:bg-gray-dark"
                    onClick={ () => signOut({ redirect: true, callbackUrl: "/" }) }
                >
                    Sign Out
                </button>
            </Modal>
            <div className="mx-auto flex max-w-7xl item-center justify-between">
                <div className="z-20 flex items-center gap-8">
                    <h2 className="py-1 text-xl font-bold">
                        <Link href="/">CS:GO Stats</Link>
                    </h2>
                    <ul className="flex items-center gap-4">
                        <NavbarLink href="/">Home</NavbarLink>
                        { data && <NavbarLink href="/stats">View Stats</NavbarLink> }
                        { data && <NavbarLink href="/visualizations">Visualizations</NavbarLink> }
                    </ul>
                </div>
                <div className="z-20 flex sm:hidden">
                    <button>
                        <DotsVerticalIcon />
                    </button>
                </div>
                { data ? (
                    <div className="z-20 hidden items-center gap-4 sm:flex">
                        <div className="flex overflow-x-hidden rounded-md border-2 border-[#30303F] bg-[#1D1D27] drop-shadow-md">
                            <NavbarButton
                                className="border-r-2"
                                onClick={ () => router.push( "/profile" ) }
                            >
                                Profile
                            </NavbarButton>
                            <NavbarButton
                                className="flex items-center"
                                onClick={ () => setOpened( true ) }
                            >
                                <HiLogout />
                            </NavbarButton>
                        </div>
                        <button
                            className="flex items-center rounded-full bg-white"
                        >
                            {data.user?.name && data.user.image ? (
                                <Image
                                    className="rounded-full"
                                    width={ 25 }
                                    height={ 25 }
                                    alt={ data.user?.name }
                                    src={ data.user?.image }
                                />
                            ) : null}
                        </button>
                    </div>
                ) : (
                    <div className="z-20 hidden items-center gap-4 sm:flex">
                        <div className="flex overflow-x-hidden rounded-md border-2 border-[#30303F] bg-[#1D1D27] drop-shadow-md">
                            <NavbarButton
                                onClick={ () => signIn() }
                                className="flex items-center"
                            >
                                Sign In
                            </NavbarButton>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}

export default NavBar;

interface NavbarLinkProps {
    children: string;
    href: string;
}

const NavbarLink: React.FC<NavbarLinkProps> = ({ children, href }) => (
    <li>
        <Link
            className="rounded-md px-2 py-1 text-sm font-semibold text-gray-400 transition-colors duration-200 hover:bg-[#ffffff0f] hover:text-white"
            href={href}
        >
            { children }
        </Link>
    </li>
);

interface NavbarButtonProps {
    onClick?: MouseEventHandler<HTMLButtonElement>;
    className?: string;
    children: React.ReactElement | string;
}

const NavbarButton: React.FC<NavbarButtonProps> = ({
    onClick,
    className,
    children,
}) => (
    <button
        onClick={ onClick }
        className={ `${className} border-[#30303F] bg-[#1D1D27] px-2 py-1 text-xs text-white transition-all duration-200 hover:bg-[#0B0C17]` }
    >
        { children }
    </button>
);