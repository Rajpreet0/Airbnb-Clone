"use client";
import { useEffect, useState } from "react"

interface ClientOnlyProps {
    children: React.ReactNode;
}

// Component to resolve Hydration Errors while (Re-)Loading the page and interacting with it

const ClientOnly: React.FC<ClientOnlyProps> = ({children}) => {
    const [hasMounted, setHasMounted] = useState(false);

    // Only check if it has mounted then no error
    useEffect(() => {
        setHasMounted(true);
    }, []);

    if(!hasMounted) {
        return null;
    }

    return (
        <>
            {children}
        </>
    )
}

export default ClientOnly