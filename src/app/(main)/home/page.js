'use client';

import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, orderBy, limit, doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/firebase/config';
import { useAuth } from '@/contexts/AuthContext';

import styles from './page.module.css';
import MovementList from '../../../components/MovementList';

export default function HomePage() {
    const { user } = useAuth();
    const [spaceId, setSpaceId] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [categories, setCategories] = useState({});
    const [loading, setLoading] = useState(true);
    const [balance, setBalance] = useState(0);

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
        setLoading(true);

        const categoriesRef = collection(db, 'spaces', spaceId, 'categories');
        const unsubscribeCategories = onSnapshot(categoriesRef, (querySnapshot) => {
            const categoriesData = {};
            querySnapshot.forEach((doc) => {
                categoriesData[doc.id] = doc.data();
            });
            setCategories(categoriesData);
        });

        const transactionsRef = collection(db, 'spaces', spaceId, 'transactions');
        const q = query(transactionsRef, orderBy('date', 'desc'));

        const unsubscribeTransactions = onSnapshot(q, (querySnapshot) => {
            const transactionsData = [];
            let totalBalance = 0;
            querySnapshot.forEach((doc) => {
                const tx = { id: doc.id, ...doc.data() };
                transactionsData.push(tx);
                totalBalance += tx.amount;
            });
            setTransactions(transactionsData.slice(0, 10));
            setBalance(totalBalance);
            setLoading(false);
        }, (error) => {
            console.error("Error obteniendo transacciones:", error);
            setLoading(false);
        });

        return () => {
            unsubscribeCategories();
            unsubscribeTransactions();
        };
    }, [spaceId]);

    const formatDate = (timestamp) => {
        if (!timestamp) return 'Sin fecha';
        return new Date(timestamp.seconds * 1000).toLocaleDateString('es-ES');
    };

    const getCategoryName = (categoryId) => {
        return categories[categoryId] ? categories[categoryId].name : 'Desconocido';
    };

    const getCategoryIcon = (categoryId) => {
        const iconString = categories[categoryId] ? categories[categoryId].icon : 'fa-home';
        const iconName = iconString.split(' ')[1]?.replace('fa-', '');
        return iconName || 'home';
    };

    const getCategoryType = (categoryId) => {
        const iconType = categories[categoryId] ? categories[categoryId].type : '';
        return iconType;
    };


    return (
        <div className={styles.main}>
            <header className={styles.header}>
                <h1>Home</h1>
            </header>

            <div className={styles.movementsContainer}>
                {loading ? (
                    <p className="text-center text-gray-500 mt-8">Cargando movimientos...</p>
                ) : transactions.length === 0 ? (
                    <p className="text-center text-gray-500 mt-8">No hay movimientos todavía. ¡Añade uno!</p>
                ) : (
                    <MovementList
                        transactions={transactions}
                        getCategoryName={getCategoryName}
                        getCategoryIcon={getCategoryIcon}
                        getCategoryType={getCategoryType}
                    />
                )}
                <div className={styles.seeMoreContainer}>
                    <a href="#" className={styles.movementsLink}>See more</a>
                </div>
            </div>
        </div>
    );
}