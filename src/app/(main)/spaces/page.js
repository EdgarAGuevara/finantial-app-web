'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/firebase/config';
import { collection, query, where, getDocs, addDoc, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import styles from './page.module.css';

export default function SpacesPage() {
    const { user } = useAuth();
    const [spaces, setSpaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newSpaceName, setNewSpaceName] = useState('');

    useEffect(() => {
        if (!user) return;

        const fetchSpaces = async () => {
            const spacesRef = collection(db, 'spaces');
            const querySnapshot = await getDocs(spacesRef);

            const userSpaces = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setSpaces(userSpaces);
            setLoading(false);
        };

        fetchSpaces();
    }, [user]);

    const handleCreateSpace = async (e) => {
        e.preventDefault();
        if (!newSpaceName.trim()) {
            alert('Please enter a space name.');
            return;
        }

        try {
            const newSpaceRef = await addDoc(collection(db, 'spaces'), {
                name: newSpaceName,
                members: [user.uid],
                owner: user.uid,
            });
            await handleSelectSpace(newSpaceRef.id);
        } catch (error) {
            console.error('Error creating space: ', error);
            alert('Error creating space.');
        }
    };

    const handleSelectSpace = async (spaceId) => {
        if (!user) return;
        try {

            const spaceDocRef = doc(db, 'spaces', spaceId);
            await updateDoc(spaceDocRef, {
                members: arrayUnion(user.uid),
            });

            const userDocRef = doc(db, 'users', user.uid);
            await updateDoc(userDocRef, {
                spaceId: spaceId,
            });

            // Redirect to home page or reload the page
            window.location.href = '/home';
        } catch (error) {
            console.error('Error selecting space: ', error);
            alert('Error selecting space.');
        }
    };

    if (loading) {
        return <p>Loading spaces...</p>;
    }

    return (
        <main className={styles.main}>
            <h1>Select or Create a Space</h1>
            <div className={styles.spacesList}>
                <h2>Your Spaces</h2>
                {spaces.length > 0 ? (
                    <ul>
                        {spaces.map(space => (
                            <li key={space.id}>
                                <button onClick={() => handleSelectSpace(space.id)} className={styles.spaceButton}>
                                    {space.name}
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>You are not a member of any space yet.</p>
                )}
            </div>
            <div className={styles.createSpace}>
                <h2>Create a New Space</h2>
                <form onSubmit={handleCreateSpace}>
                    <input
                        type="text"
                        value={newSpaceName}
                        onChange={(e) => setNewSpaceName(e.target.value)}
                        placeholder="Enter new space name"
                    />
                    <button type="submit" className={styles.button}>Create Space</button>
                </form>
            </div>
        </main>
    );
}
