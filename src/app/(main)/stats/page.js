'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/firebase/config';
import { collection, onSnapshot, doc, getDoc } from 'firebase/firestore';
import PieChart from '@/components/PieChart';
import styles from './page.module.css';

export default function StatsPage() {
    const { user } = useAuth();
    const [spaceId, setSpaceId] = useState(null);
    const [expenseData, setExpenseData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            const fetchSpaceId = async () => {
                const userDocRef = doc(db, 'users', user.uid);
                const userDocSnap = await getDoc(userDocRef);
                if (userDocSnap.exists()) {
                    const userData = userDocSnap.data();
                    setSpaceId(userData.spaceId);
                } else {
                    console.log("User document not found");
                    setLoading(false);
                }
            };
            fetchSpaceId();
        } else {
            console.log("User not found");
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (!spaceId) {
            if (user) { // only log if user is available but spaceId is not
                console.log("spaceId not found, returning");
            }
            return;
        };

        const transactionsRef = collection(db, 'spaces', spaceId, 'transactions');
        const categoriesRef = collection(db, 'spaces', spaceId, 'categories');

        const unsubscribe = onSnapshot(transactionsRef, (transactionsSnapshot) => {
            onSnapshot(categoriesRef, (categoriesSnapshot) => {

                const categoriesMap = {};
                categoriesSnapshot.forEach((doc) => {
                    categoriesMap[doc.id] = doc.data();
                });
                console.log("Categories map:", categoriesMap);

                const expensesByCategory = {};
                transactionsSnapshot.forEach((doc) => {
                    const transaction = doc.data();
                    const categoryId = transaction?.categoryId;
                    const category = categoriesMap[categoryId];

                    if (category?.type === 'expense') { // Only consider expenses
                        if (category) {
                            if (expensesByCategory[category.name]) {
                                expensesByCategory[category.name] += Math.abs(transaction.amount);
                            } else {
                                expensesByCategory[category.name] = Math.abs(transaction.amount);
                            }
                        } else {
                            console.log("Category not found for categoryId:", categoryId);
                        }
                    }
                });

                const formattedData = Object.keys(expensesByCategory).map(categoryName => ({
                    name: categoryName,
                    value: expensesByCategory[categoryName],
                }));

                setExpenseData(formattedData);
                setLoading(false);
            });
        });

        return () => unsubscribe();
    }, [spaceId, user]);

    return (
        <main className={styles.main}>
            <header className={styles.header}>
                <h1>Stats</h1>
            </header>
            {loading ? (
                <p>Loading stats...</p>
            ) : expenseData.length > 0 ? (
                <>
                    <div className={styles.chartContainer}>
                        <PieChart data={expenseData} />
                    </div>
                    <div className={styles.categoryList}>
                        <h2>Expenses by Category</h2>
                        <ul>
                            {expenseData.map((item, index) => (
                                <li key={index} className={styles.categoryItem}>
                                    <span>{item.name}</span>
                                    <span>${item.value.toFixed(2)}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </>
            ) : (
                <p>No expense data available.</p>
            )}
        </main>
    );
}

