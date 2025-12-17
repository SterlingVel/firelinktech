import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { firebase } from '../tools/config';

const provider = new firebase.auth.GoogleAuthProvider();

export default function AdminLogin() {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [signInAttempts, setSignInAttempts] = useState(0);
    const [signInBlocked, setSignInBlocked] = useState(false);
    const router = useRouter();

    const getReturnPath = () => {
        if (router.query.returnTo) {
            return router.query.returnTo;
        }

        if (typeof window !== 'undefined') {
            const referrer = document.referrer;
            if (referrer && referrer.includes(window.location.origin)) {
                const url = new URL(referrer);
                return url.pathname;
            }
        }

        return '/';
    };

    useEffect(() => {
        const unsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
            if (user) {
                const adminRef = firebase.database().ref('admins/' + user.uid);
                const snapshot = await adminRef.once('value');

                if (snapshot.exists()) {
                    router.replace(getReturnPath());
                } else {
                    await firebase.auth().signOut();
                }
            }
        });

        return () => unsubscribe();
    }, [router]);

    const handleSignIn = async () => {
        if (signInBlocked) {
            alert('Too many failed attempts. Please wait before trying again.');
            return;
        }

        setError('');
        setLoading(true);

        try {
            const result = await firebase.auth().signInWithPopup(provider);
            const user = result.user;

            const adminRef = firebase.database().ref('admins/' + user.uid);
            const snapshot = await adminRef.once('value');

            if (!snapshot.exists()) {
                await firebase.database().ref('unauthorized_attempts/' + user.uid).set({
                    email: user.email,
                    timestamp: firebase.database.ServerValue.TIMESTAMP,
                    page: window.location.pathname,
                    attempts: signInAttempts + 1,
                });

                await firebase.auth().signOut();

                const attempts = signInAttempts + 1;
                setSignInAttempts(attempts);

                if (attempts >= 3) {
                    setSignInBlocked(true);
                    setTimeout(() => {
                        setSignInBlocked(false);
                        setSignInAttempts(0);
                    }, 60000);
                }

                setError('You do not have administrator privileges.');
                setLoading(false);
                return;
            }

            router.replace(getReturnPath());

        } catch (err) {
            console.error('Sign in error:', err);
            if (err.code !== 'auth/popup-closed-by-user') {
                setError('Sign in failed. Please try again.');
            }
            setLoading(false);
        }
    };

    const handleGoBack = () => {
        router.replace(getReturnPath());
    };

    return (
        <>
            <Head>
                <title>Admin Sign In - FireLink Tech</title>
            </Head>
            <div className="admin-login-modal-bg">
                <div className="admin-login-modal">
                    <h2>Administrator Sign In</h2>
                    <p className="admin-login-description">
                        Sign in with your authorized Google account to access administrative features.
                    </p>

                    <button
                        className="admin-google-signin-btn"
                        onClick={handleSignIn}
                        disabled={loading || signInBlocked}
                    >
                        {loading ? (
                            'Signing in...'
                        ) : (
                            <>
                                <svg className="google-icon" viewBox="0 0 24 24" width="20" height="20">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                Sign in with Google
                            </>
                        )}
                    </button>

                    {error && <div className="admin-login-error">{error}</div>}

                    <button
                        className="admin-login-back"
                        onClick={handleGoBack}
                        disabled={loading}
                    >
                        Go Back
                    </button>
                </div>
            </div>
        </>
    );
}