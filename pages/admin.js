import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { firebase } from '../tools/config';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [signInAttempts, setSignInAttempts] = useState(0);
    const [signInBlocked, setSignInBlocked] = useState(false);
    const [blockSeconds, setBlockSeconds] = useState(0);
    const timerRef = useRef(null);
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
        if (typeof window !== 'undefined') {
            const blockData = localStorage.getItem('adminSignInBlock');
            if (blockData) {
                const { blockedUntil, attempts, error: storedError } = JSON.parse(blockData);
                const now = Date.now();
                if (now < blockedUntil) {
                    setSignInBlocked(true);
                    setSignInAttempts(attempts);
                    setError(storedError || 'Too many failed attempts.');
                    updateBlockSeconds(blockedUntil);
                    startBlockTimer(blockedUntil);
                } else {
                    localStorage.removeItem('adminSignInBlock');
                    setSignInAttempts(0);
                    setError('');
                }
            }
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
        // eslint-disable-next-line
    }, []);

    const updateBlockSeconds = (blockedUntil) => {
        const now = Date.now();
        const seconds = Math.ceil((blockedUntil - now) / 1000);
        setBlockSeconds(seconds > 0 ? seconds : 0);
    };

    const startBlockTimer = (blockedUntil) => {
        if (timerRef.current) clearInterval(timerRef.current);
        updateBlockSeconds(blockedUntil);
        timerRef.current = setInterval(() => {
            updateBlockSeconds(blockedUntil);
            const now = Date.now();
            if (now >= blockedUntil) {
                setSignInBlocked(false);
                setSignInAttempts(0);
                setError('');
                setBlockSeconds(0);
                localStorage.removeItem('adminSignInBlock');
                clearInterval(timerRef.current);
            }
        }, 1000);
    };

    useEffect(() => {
        const unsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
            if (user) {
                const adminRef = firebase.database().ref('admins/' + user.uid);
                const snapshot = await adminRef.once('value');
                if (snapshot.exists()) {
                    localStorage.removeItem('adminSignInBlock');
                    setError('');
                    setBlockSeconds(0);
                    if (timerRef.current) clearInterval(timerRef.current);
                    router.replace(getReturnPath());
                } else {
                    await firebase.auth().signOut();
                }
            }
        });
        return () => unsubscribe();
    }, [router]);

    const handleSignIn = async (e) => {
        e.preventDefault();
        if (signInBlocked) {
            alert('Too many failed attempts.');
            return;
        }
        setError('');
        setLoading(true);

        try {
            const result = await firebase.auth().signInWithEmailAndPassword(email, password);
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
                    const blockedUntil = Date.now() + 60000;
                    const blockMsg = 'Too many failed attempts.';
                    localStorage.setItem('adminSignInBlock', JSON.stringify({
                        blockedUntil,
                        attempts,
                        error: blockMsg
                    }));
                    setSignInBlocked(true);
                    setError(blockMsg);
                    updateBlockSeconds(blockedUntil);
                    startBlockTimer(blockedUntil);
                } else {
                    setError('You do not have administrator privileges.');
                }
                setLoading(false);
                return;
            }
            localStorage.removeItem('adminSignInBlock');
            setError('');
            setBlockSeconds(0);
            if (timerRef.current) clearInterval(timerRef.current);
            router.replace(getReturnPath());
        } catch (err) {
            console.error('Sign in error:', err);
            const attempts = signInAttempts + 1;
            setSignInAttempts(attempts);
            if (attempts >= 3) {
                const blockedUntil = Date.now() + 60000;
                const blockMsg = 'Too many failed attempts.';
                localStorage.setItem('adminSignInBlock', JSON.stringify({
                    blockedUntil,
                    attempts,
                    error: blockMsg
                }));
                setSignInBlocked(true);
                setError(blockMsg);
                updateBlockSeconds(blockedUntil);
                startBlockTimer(blockedUntil);
            } else {
                if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
                    setError('Invalid email or password.');
                } else if (err.code === 'auth/invalid-email') {
                    setError('Invalid email format.');
                } else if (err.code === 'auth/too-many-requests') {
                    setError('Too many failed attempts.');
                } else {
                    setError('Sign in failed. Please try again.');
                }
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
                        Sign in with your administrator credentials
                    </p>

                    <form onSubmit={handleSignIn} className="admin-login-form">
                        <label>
                            <span>Email</span>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={loading || signInBlocked}
                                autoComplete="email"
                            />
                        </label>

                        <label>
                            <span>Password</span>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={loading || signInBlocked}
                                autoComplete="current-password"
                            />
                        </label>

                        <button
                            type="submit"
                            className="admin-signin-btn"
                            disabled={loading || signInBlocked}
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    {error && (
                        <div className="admin-login-error">
                            {error}
                            {signInBlocked && blockSeconds > 0 && (
                                <div style={{ marginTop: 6, fontWeight: 500, color: '#1d3557' }}>
                                    Please wait {blockSeconds} second{blockSeconds !== 1 ? 's' : ''} before trying again.
                                </div>
                            )}
                        </div>
                    )}

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