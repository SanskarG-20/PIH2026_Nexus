import { useEffect, useRef, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { syncUserWithDatabase } from "../services/supabaseClient";

/**
 * Syncs the current Clerk user to Supabase on first login.
 * Uses a ref to prevent duplicate sync calls.
 *
 * Returns { user, isSignedIn, dbUser, syncing }
 */
export default function useUserSync() {
    const { user, isSignedIn } = useUser();
    const [dbUser, setDbUser] = useState(null);
    const [syncing, setSyncing] = useState(false);
    const hasSynced = useRef(false);

    useEffect(() => {
        if (!isSignedIn || !user || hasSynced.current) return;

        hasSynced.current = true;
        setSyncing(true);

        syncUserWithDatabase({
            clerkId: user.id,
            email: user.primaryEmailAddress?.emailAddress || null,
            phone: user.primaryPhoneNumber?.phoneNumber || null,
            fullName: user.fullName || null,
            avatarUrl: user.imageUrl || null,
        })
            .then((data) => {
                setDbUser(data);
            })
            .catch((err) => {
                console.error("[MargDarshak] Sync error:", err);
                hasSynced.current = false;
            })
            .finally(() => {
                setSyncing(false);
            });
    }, [user, isSignedIn]);

    return { user, isSignedIn, dbUser, syncing };
}
