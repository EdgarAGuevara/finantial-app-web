'use client';
import MovementForm from '@/components/MovementForm';
import styles from './page.module.css';
import { useAuth } from '@/contexts/AuthContext';

export default function AddPage() {
    const { user } = useAuth();

    return (
        <main className={styles.main}>
            <header className={styles.header}>
                <h1>New Movement</h1>
            </header>
            <MovementForm user={user} />
        </main>
    );
}

