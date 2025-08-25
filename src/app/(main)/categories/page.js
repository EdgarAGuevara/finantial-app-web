
'use client';
import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase/config';
import CategoryForm from '@/components/CategoryForm';
import CategoryList from '@/components/CategoryList';
import { useAuth } from '@/contexts/AuthContext';

export default function CategoriesPage() {
    const { user } = useAuth();
    const [icons, setIcons] = useState([]);

    useEffect(() => {
        const fetchIcons = async () => {
            const iconsCollection = await getDocs(collection(db, 'icons'));
            const iconsData = iconsCollection.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setIcons(iconsData);
        };

        fetchIcons();
    }, []);

    return (
        <div>
            <h1>Manage Categories</h1>
            <CategoryForm user={user} icons={icons} />
            <CategoryList user={user} />
        </div>
    );
}

