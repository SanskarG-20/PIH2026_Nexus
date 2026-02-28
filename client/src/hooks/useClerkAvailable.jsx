import { createContext, useContext } from "react";

const ClerkAvailableContext = createContext(false);

export function ClerkAvailableProvider({ available, children }) {
    return (
        <ClerkAvailableContext.Provider value={available}>
            {children}
        </ClerkAvailableContext.Provider>
    );
}

export function useClerkAvailable() {
    return useContext(ClerkAvailableContext);
}
