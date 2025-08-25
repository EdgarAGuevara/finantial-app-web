'use client';

import React from 'react';
import { HomeIcon, BarChartIcon, PlusCircleIcon, ListIcon, WalletIcon } from './icons';

export const BottomNav = ({ activePage, setActivePage }) => {
    const navItems = [
        { name: 'Home', icon: HomeIcon },
        { name: 'Stats', icon: BarChartIcon },
        { name: 'New', icon: PlusCircleIcon },
        { name: 'Categories', icon: ListIcon },
        { name: 'Accounts', icon: WalletIcon },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-t-md">
            <div className="flex justify-around max-w-md mx-auto">
                {navItems.map(item => (
                    <button
                        key={item.name}
                        onClick={() => setActivePage(item.name)}
                        className={`flex flex-col items-center justify-center w-full pt-3 pb-2 text-sm transition-colors duration-200 ${activePage === item.name ? 'text-indigo-600' : 'text-gray-500 hover:text-indigo-500'
                            }`}
                    >
                        <item.icon className={`w-7 h-7 mb-1 ${item.name === 'New' ? 'text-indigo-600' : ''}`} />
                        <span>{item.name}</span>
                    </button>
                ))}
            </div>
        </nav>
    );
};

