'use client';
import { useState, useEffect } from 'react';
import styles from './MovementForm.module.css';
import { db } from '../firebase/config';
import { collection, addDoc, getDocs, getDoc, doc, Timestamp } from 'firebase/firestore';

export default function MovementForm({ user }) {
    const [spaceId, setSpaceId] = useState(null);
    const [categories, setCategories] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [category, setCategory] = useState('');
    const [account, setAccount] = useState('');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

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

        const fetchData = async () => {
            // Fetch Categories
            const categoriesCollection = collection(db, 'spaces', spaceId, 'categories');
            const categoriesSnapshot = await getDocs(categoriesCollection);
            const categoriesList = categoriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setCategories(categoriesList);
            if (categoriesList.length > 0) {
                setCategory(categoriesList[0].id);
            }

            // Fetch Accounts
            const accountsCollection = collection(db, 'spaces', spaceId, 'accounts');
            const accountsSnapshot = await getDocs(accountsCollection);
            const accountsList = accountsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setAccounts(accountsList);
            if (accountsList.length > 0) {
                setAccount(accountsList[0].id);
            }
        };

        fetchData();

    }, [spaceId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!spaceId) {
            alert('No space selected!');
            return;
        }

        try {
            const transactionsCollection = collection(db, 'spaces', spaceId, 'transactions');
            await addDoc(transactionsCollection, {
                amount: parseFloat(amount),
                categoryId: category,
                accountId: account,
                description,
                date: Timestamp.fromDate(new Date(date)),
                createdBy: user.uid,
            });

            // alert('Transaction Added!');
            setAmount('');
            setDescription('');
        } catch (error) {
            console.error("Error adding document: ", error);
            alert('Error adding transaction.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
                <label htmlFor="category">Category</label>
                <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
            </div>
            <div className={styles.formGroup}>
                <label htmlFor="account">Account</label>
                <select id="account" value={account} onChange={(e) => setAccount(e.target.value)}>
                    {accounts.map(acc => (
                        <option key={acc.id} value={acc.id}>{acc.name}</option>
                    ))}
                </select>
            </div>
            <div className={styles.formGroup}>
                <label htmlFor="amount">Amount</label>
                <input
                    type="number"
                    id="amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00 (use '-' for expenses)"
                    required
                />
            </div>
            <div className={styles.formGroup}>
                <label htmlFor="description">Description</label>
                <input
                    type="text"
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    maxLength="100"
                    placeholder="e.g., Weekly shopping"
                    required
                />
            </div>
            <div className={styles.formGroup}>
                <label htmlFor="date">Date</label>
                <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>
            <button type="submit" className={styles.submitButton}>Add Transaction</button>
        </form>
    );
}

