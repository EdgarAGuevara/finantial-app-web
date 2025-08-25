'use client';
import { useState, useEffect } from 'react';
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import styles from './MovementForm.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// fontawesome.js
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons'; // Import all solid icons
import { fab } from '@fortawesome/free-brands-svg-icons'; // Import all brand icons

library.add(fas, fab); // Add imported icon sets to the library

export default function CategoryForm({ user, icons }) {
    const [name, setName] = useState('');
    const [type, setType] = useState('expense');
    const [icon, setIcon] = useState('');
    const [spaceId, setSpaceId] = useState(null);

    useEffect(() => {
        if (icons && icons.length > 0) {
            setIcon(icons[0].name);
        }
    }, [icons]);

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
            alert('Please enter a category name.');
            return;
        }
        if (!spaceId) {
            alert('Could not find user space.');
            return;
        }

        try {
            await addDoc(collection(db, 'spaces', spaceId, 'categories'), {
                name,
                type,
                icon,
            });
            // alert('Category added!');
            setName('');
            if (icons && icons.length > 0) {
                setIcon(icons[0].value);
            } else {
                setIcon('');
            }
        } catch (error) {
            console.error('Error adding category: ', error);
            alert('Error adding category.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <h2>Add New Category</h2>
            <div className={styles.formGroup}>
                <label htmlFor="categoryName">Category Name</label>
                <input
                    type="text"
                    id="categoryName"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Groceries"
                    required
                />
            </div>
            <div className={styles.formGroup}>
                <label htmlFor="categoryType">Type</label>
                <select id="categoryType" value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                </select>
            </div>
            <div className={styles.formGroup}>
                <label htmlFor="categoryIcon">Icon</label>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <select id="categoryIcon" value={icon} onChange={(e) => setIcon(e.target.value)}>
                        {icons && icons.map(iconItem => (
                            <option key={iconItem.id} value={iconItem.value}>
                                {iconItem.name}
                            </option>
                        ))}
                    </select>
                    {icon && <FontAwesomeIcon icon={icon.split(' ')[1]?.replace('fa-', '')} style={{ marginLeft: '25px', fontSize: '40px' }} />}
                </div>
            </div>
            <button type="submit" className={styles.submitButton}>Add Category</button>
        </form>
    );
}

