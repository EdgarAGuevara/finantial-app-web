import styles from './MovementItem.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// fontawesome.js
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons'; // Import all solid icons
import { fab } from '@fortawesome/free-brands-svg-icons'; // Import all brand icons

library.add(fas, fab); // Add imported icon sets to the library

export default function MovementItem({ transaction, categoryName, categoryIcon, categoryType }) {
    const isIncome = categoryType === 'income';
    const amount = transaction.amount;

    return (
        <div className={styles.item}>
            <div className={styles.iconContainer}>
                <FontAwesomeIcon icon={categoryIcon} />
            </div>
            <div className={styles.details}>
                <span className={styles.category}>{categoryName}</span>
            </div>
            <div className={`${styles.amount} ${isIncome ? styles.income : styles.expense}`}>
                {isIncome ? '+' : '-'}${Math.abs(amount).toFixed(2)}
            </div>
        </div>
    );
}