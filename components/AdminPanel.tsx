
import React, { useState, useEffect } from 'react';
import { User, Role } from '../types';
import { useAuth } from '../contexts/AuthContext';
import Modal from './ui/Modal';
import { PlusIcon, KeyIcon, UserGroupIcon } from './ui/icons';

interface AdminPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose }) => {
    const { users, addUser, updateUserPassword } = useAuth();
    const [userList, setUserList] = useState<User[]>([]);
    const [newUser, setNewUser] = useState({ username: '', password: '', role: Role.User });
    const [passwordChange, setPasswordChange] = useState({ userId: '', newPassword: '' });
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    useEffect(() => {
        if (isOpen) {
            setUserList(users);
            setFeedback(null);
            setNewUser({ username: '', password: '', role: Role.User });
            setPasswordChange({ userId: users[0]?.id || '', newPassword: '' });
        }
    }, [isOpen, users]);
    
    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newUser.username || !newUser.password) {
            setFeedback({ type: 'error', message: 'Username and password are required.' });
            return;
        }
        const result = await addUser(newUser);
        setFeedback(result);
        if (result.success) {
            setNewUser({ username: '', password: '', role: Role.User });
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!passwordChange.userId || !passwordChange.newPassword) {
            setFeedback({ type: 'error', message: 'User and new password are required.' });
            return;
        }
        const result = await updateUserPassword(passwordChange.userId, passwordChange.newPassword);
        setFeedback(result);
        if (result.success) {
            setPasswordChange({ ...passwordChange, newPassword: '' });
        }
    };

    const clearFeedback = () => setFeedback(null);

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="w-full max-w-4xl mx-auto p-4 md:p-6">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <UserGroupIcon className="w-6 h-6" /> Admin Panel
                </h2>
                
                {feedback && (
                    <div className={`p-3 mb-4 rounded-lg text-sm ${feedback.type === 'success' ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'}`}>
                        {feedback.message}
                    </div>
                )}
                
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Add User Form */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold border-b border-primary/30 pb-2">Add New User</h3>
                        <form onSubmit={handleAddUser} className="space-y-4">
                            <input value={newUser.username} onChange={e => { setNewUser({ ...newUser, username: e.target.value }); clearFeedback(); }} placeholder="Username" className="input w-full" />
                            <input type="password" value={newUser.password} onChange={e => { setNewUser({ ...newUser, password: e.target.value }); clearFeedback(); }} placeholder="Password" className="input w-full" />
                            <select value={newUser.role} onChange={e => { setNewUser({ ...newUser, role: e.target.value as Role }); clearFeedback(); }} className="input w-full">
                                <option value={Role.User}>User</option>
                                <option value={Role.Admin}>Admin</option>
                            </select>
                            <button type="submit" className="flex items-center gap-2 w-full justify-center px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-violet-700 transition-all">
                                <PlusIcon className="w-5 h-5"/> Add User
                            </button>
                        </form>
                    </div>

                    {/* Change Password Form */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold border-b border-primary/30 pb-2">Change User Password</h3>
                        <form onSubmit={handlePasswordChange} className="space-y-4">
                            <select value={passwordChange.userId} onChange={e => { setPasswordChange({ ...passwordChange, userId: e.target.value }); clearFeedback(); }} className="input w-full">
                                {userList.map(user => <option key={user.id} value={user.id}>{user.username} ({user.role})</option>)}
                            </select>
                            <input type="password" value={passwordChange.newPassword} onChange={e => { setPasswordChange({ ...passwordChange, newPassword: e.target.value }); clearFeedback(); }} placeholder="New Password" className="input w-full" />
                            <button type="submit" className="flex items-center gap-2 w-full justify-center px-4 py-2 bg-secondary text-white font-semibold rounded-lg hover:bg-gray-600 transition-all">
                                <KeyIcon className="w-5 h-5" /> Update Password
                            </button>
                        </form>
                    </div>
                </div>

                <div className="mt-8">
                     <h3 className="text-lg font-semibold border-b border-primary/30 pb-2 mb-4">Current Users</h3>
                     <div className="max-h-60 overflow-y-auto pr-2">
                         <ul className="space-y-2 text-sm">
                             {userList.map(user => (
                                <li key={user.id} className="flex justify-between items-center bg-background p-2 rounded-lg">
                                    <span className="text-text-primary">{user.username}</span>
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${user.role === Role.Admin ? 'bg-primary/30 text-violet-300' : 'bg-gray-700 text-gray-300'}`}>
                                        {user.role}
                                    </span>
                                </li>
                             ))}
                         </ul>
                     </div>
                </div>

            </div>
             <style>{`
                .input {
                  background-color: #111827;
                  border: 1px solid #4b5563;
                  border-radius: 0.5rem;
                  padding: 0.75rem 1rem;
                  color: #f9fafb;
                }
                .input:focus {
                  outline: none;
                  border-color: #8b5cf6;
                }
            `}</style>
        </Modal>
    );
};

export default AdminPanel;
