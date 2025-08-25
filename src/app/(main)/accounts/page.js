'use client';
import AccountForm from '@/components/AccountForm';
import AccountList from '@/components/AccountList';
import { useAuth } from '@/contexts/AuthContext';

export default function AccountsPage() {
    const { user } = useAuth();

    return (
        <div>
            <h1>Manage Accounts</h1>
            <AccountForm user={user} />
            <AccountList user={user} />
        </div>
    );
}
