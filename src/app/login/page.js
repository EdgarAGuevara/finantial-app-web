'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import styles from './page.module.css';
import { FcGoogle } from 'react-icons/fc';

export default function LoginPage() {
    const { user, userDoc, loading, signInWithGoogle } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && user) {
            if (userDoc) {
                if (userDoc.spaceId) {
                    router.push('/home');
                } else {
                    router.push('/spaces');
                }
            }
            // if userDoc is null, it means it's being created,
            // the listener in AuthContext will update it, and this useEffect will re-run.
        }
    }, [user, userDoc, loading, router]);

    return (
        <main className={styles.main}>
            <div className={styles.loginBox}>
                <FcGoogle size={60} />
                <h1 className={styles.title}>Financial Tracker</h1>
                <p className={styles.subtitle}>Sign in to continue</p>
                <button onClick={signInWithGoogle} className={styles.signInButton}>
                    <FcGoogle size={24} />
                    <span>Sign in with Google</span>
                </button>
            </div>
        </main>
    );
}

