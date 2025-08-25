'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';
import { FaHome, FaChartPie, FaPlus, FaList, FaWallet } from 'react-icons/fa';

const navItems = [
    { href: '/home', icon: FaHome, label: 'Home' },
    { href: '/stats', icon: FaChartPie, label: 'Stats' },
    { href: '/add', icon: FaPlus, label: 'Add' },
    { href: '/categories', icon: FaList, label: 'Categories' },
    { href: '/accounts', icon: FaWallet, label: 'Accounts' },
];

export default function Navbar() {
    const pathname = usePathname();

    return (
        <nav className={styles.navbar}>
            {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                    <Link href={item.href} key={item.href} className={`${styles.navItem} ${isActive ? styles.active : ''}`}>
                        <item.icon size={24} />
                    </Link>
                );
            })}
        </nav>
    );
}