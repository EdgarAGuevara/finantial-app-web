'use client';
import { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import styles from './MovementForm.module.css';

export default function AccountList({ user }) {
    const [spaceId, setSpaceId] = useState(null);
    const [accounts, setAccounts] = useState([]);

    useEffect(() => {
        if (!user) return;

        const fetchSpaceId = async () => {
            const userDocRef = doc(db, 'users', user.uid);
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists()) {
                const userData = userDocSnap.data();
                setSpaceId(userData.spaceId);
            }
        };

        fetchSpaceId();
    }, [user]);

    useEffect(() => {
        if (!spaceId) return;

        const unsubscribe = onSnapshot(collection(db, 'spaces', spaceId, 'accounts'), (snapshot) => {
            const accountsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setAccounts(accountsData);
        });

        return () => unsubscribe();
    }, [spaceId]);

    return (
        <div className={styles.listContainer}>
            <h2>Accounts</h2>
            <ul className={styles.list}>
                {accounts.map(account => (
                    <li key={account.id} className={styles.listItem}>
                        <span>{account.name}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
