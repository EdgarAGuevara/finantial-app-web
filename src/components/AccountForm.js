'use client';
import { useState, useEffect } from 'react';
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import styles from './MovementForm.module.css';

export default function AccountForm({ user }) {
    const [name, setName] = useState('');
    const [balance, setBalance] = useState('');
    const [spaceId, setSpaceId] = useState(null);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name) {
            alert('Please enter an account name.');
            return;
        }
        if (!spaceId) {
            alert('Could not find user space.');
            return;
        }

        try {
            await addDoc(collection(db, 'spaces', spaceId, 'accounts'), {
                name,
                balance: parseFloat(balance),
            });
            // alert('Account added!');
            setName('');
            setBalance('');
        } catch (error) {
            console.error('Error adding account: ', error);
            alert('Error adding account.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <h2>Add New Account</h2>
            <div className={styles.formGroup}>
                <label htmlFor="accountName">Account Name</label>
                <input
                    type="text"
                    id="accountName"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Joint Account"
                    required
                />
            </div>
            <div className={styles.formGroup}>
                <label htmlFor="accountBalance">Initial Balance</label>
                <input
                    type="number"
                    id="accountBalance"
                    value={balance}
                    onChange={(e) => setBalance(e.target.value)}
                    placeholder="0.00"
                    required
                />
            </div>
            <button type="submit" className={styles.submitButton}>Add Account</button>
        </form>
    );
}
