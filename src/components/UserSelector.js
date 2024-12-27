// src/components/UserSelector.js
import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { hasAccess } from '@/lib/utils/role-utils';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const UserSelector = ({ onUserSelect, currentUserId }) => {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            if (user && hasAccess(user.role, 'OFFICE')) {
                try {
                    const querySnapshot = await getDocs(collection(db, 'users'));
                    const usersData = querySnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    })).sort((a, b) => {
                        // Sort by last name, then first name
                        const lastNameCompare = (a.lastName || '').localeCompare(b.lastName || '');
                        if (lastNameCompare !== 0) return lastNameCompare;
                        return (a.firstName || '').localeCompare(b.firstName || '');
                    });
                    setUsers(usersData);
                } catch (error) {
                    console.error('Error fetching users:', error);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [user]);

    if (!hasAccess(user?.role, 'OFFICE') || loading) return null;

    return (
        <Select
            value={currentUserId}
            onValueChange={onUserSelect}
        >
            <SelectTrigger className="w-[300px]">
                <SelectValue placeholder="Select employee to view..." />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Select Employee</SelectLabel>
                    {users.map((u) => (
                        <SelectItem key={u.id} value={u.id}>
                            {u.lastName}, {u.firstName}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
};

export default UserSelector;