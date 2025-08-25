'use client';
import { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import styles from './CategoryList.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// fontawesome.js
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons'; // Import all solid icons
import { fab } from '@fortawesome/free-brands-svg-icons'; // Import all brand icons

library.add(fas, fab); // Add imported icon sets to the library

export default function CategoryList({ user }) {
    const [spaceId, setSpaceId] = useState(null);
    const [categories, setCategories] = useState([]);

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

        const unsubscribe = onSnapshot(collection(db, 'spaces', spaceId, 'categories'), (snapshot) => {
            const categoriesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setCategories(categoriesData);
        });

        return () => unsubscribe();
    }, [spaceId]);

    return (
        <div className={styles.listContainer}>
            <h2>Categories</h2>
            <ul className={styles.list}>
                {categories.map(category => (
                    <li key={category.id} className={styles.listItem}>

                        <span>{category?.icon && <FontAwesomeIcon icon={category?.icon.split(' ')[1]?.replace('fa-', '')} style={{ marginLeft: '25px', fontSize: '40px' }} />}
                        </span>

                        <span className={category.type === 'income' ? styles.income : styles.expense} >{category.name}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
