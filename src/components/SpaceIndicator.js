
'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import styles from './SpaceIndicator.module.css';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { UsersIcon } from './icons';


const SpaceIndicator = () => {
  const { userDoc } = useAuth();
  const router = useRouter();
  const [space, setSpace] = useState(null);

  const handleSpaceClick = () => {
    router.push('/spaces');
  };


  useEffect(() => {
    if (!userDoc || !userDoc.spaceId) {
      setSpace(null);
      return;
    }

    const fetchSpace = async () => {
      const spaceDocRef = doc(db, 'spaces', userDoc.spaceId);
      const spaceDocSnap = await getDoc(spaceDocRef);
      if (spaceDocSnap.exists()) {
        const spaceData = spaceDocSnap.data();
        setSpace(spaceData);
      } else {
        setSpace(null);
      }
    };

    fetchSpace();
  }, [userDoc]);

  return (
    <button type="button" className={styles.spaceIndicator} onClick={handleSpaceClick}>
      <UsersIcon />
      <span>{space ? space.name : 'Select a Space'}</span>
    </button>
  );
};

export default SpaceIndicator;
