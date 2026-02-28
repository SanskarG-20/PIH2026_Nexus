import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import { useClerkAvailable } from "../hooks/useClerkAvailable";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
    const clerkAvailable = useClerkAvailable();

    if (!clerkAvailable) {
        // Clerk not configured — redirect to sign-in page which will show setup message
        return <Navigate to="/sign-in" replace />;
    }

    return (
        <>
            <SignedIn>{children}</SignedIn>
            <SignedOut>
                <RedirectToSignIn />
            </SignedOut>
        </>
    );
}
