import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { Y, BK } from "../constants/theme";

function LoginButton({ scrolled, onLogin }) {
    return (
        <button
            onClick={onLogin}
            data-hover
            style={{
                background: "transparent",
                border: `2px solid ${Y}`,
                color: scrolled ? Y : BK,
                fontFamily: "'Bebas Neue',sans-serif",
                fontSize: 16,
                letterSpacing: 2,
                padding: "6px 16px",
                cursor: "pointer",
                transition: "all .2s",
            }}
            onMouseEnter={(e) => {
                e.target.style.background = Y;
                e.target.style.color = BK;
            }}
            onMouseLeave={(e) => {
                e.target.style.background = "transparent";
                e.target.style.color = scrolled ? Y : BK;
            }}
        >
            LOGIN
        </button>
    );
}

export default function NavAuthButtons({ scrolled, onLogin }) {
    return (
        <>
            <SignedIn>
                <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                        elements: {
                            avatarBox: { width: 32, height: 32, border: `2px solid ${Y}` },
                        },
                    }}
                />
            </SignedIn>
            <SignedOut>
                <LoginButton scrolled={scrolled} onLogin={onLogin} />
            </SignedOut>
        </>
    );
}
