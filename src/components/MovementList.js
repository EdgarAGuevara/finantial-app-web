import MovementItem from './MovementItem';
import styles from './MovementList.module.css';

export default function MovementList({ transactions, getCategoryName, getCategoryIcon, getCategoryType }) {
    return (
        <div className={styles.listContainer}>
            {transactions.map((tx) => (
                <MovementItem
                    key={tx.id}
                    transaction={tx}
                    categoryName={getCategoryName(tx.categoryId)}
                    categoryIcon={getCategoryIcon(tx.categoryId)}
                    categoryType={getCategoryType(tx.categoryId)}
                />
            ))}
        </div>
    );
}