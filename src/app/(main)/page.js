'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import styles from './page.module.css';
import { FcGoogle } from 'react-icons/fc';

export default function LoginPage() {
    const { user, signInWithGoogle } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (user) {
            router.push('/home');
        }
    }, [user, router]);

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

