'use client';

import React, { useState } from 'react';
import { HomeScreen } from './HomeScreen';
import { BottomNav } from './BottomNav';
import MovementForm from './MovementForm';
import CategoriesPage from '../app/(main)/categories/page';
import AccountsPage from '../app/(main)/accounts/page';

// Pantallas de Platzhalter
const StatsScreen = () => <div className="p-4"><h1 className="text-2xl font-bold">Estadísticas</h1></div>;

export const MainAppLayout = ({ user, spaceId }) => {
    const [activePage, setActivePage] = useState('Home');

    const renderPage = () => {
        switch (activePage) {
            case 'Home':
                return <HomeScreen user={user} spaceId={spaceId} />;
            case 'Stats':
                return <StatsScreen user={user} spaceId={spaceId} />;
            case 'New':
                return <MovementForm user={user} spaceId={spaceId} />;
            case 'Categories':
                return <CategoriesPage user={user} spaceId={spaceId} />;
            case 'Accounts':
                return <AccountsPage user={user} spaceId={spaceId} />;
            default:
                return <HomeScreen user={user} spaceId={spaceId} />;
        }
    };

    return (
        <div className="font-sans bg-gray-50 min-h-screen">
            <main>{renderPage()}</main>
            <BottomNav activePage={activePage} setActivePage={setActivePage} />
        </div>
    );
};