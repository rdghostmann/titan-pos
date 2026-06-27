"use client";
import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Shield, 
  CheckCircle, 
  UserSquare2, 
  AlertTriangle, 
  Trash2, 
  Key, 
  Unlock 
} from 'lucide-react';
import { User, UserRole } from '@/types';

const STATIC_USERS: User[] = [
  { id: 'usr-1', name: 'Alhaji Ibrahim', role: 'Administrator', username: 'admin' },
  { id: 'usr-2', name: 'Binta Musa', role: 'Cashier', username: 'binta' },
  { id: 'usr-3', name: 'Tunde Akin', role: 'Pump Attendant', username: 'tunde' },
  { id: 'usr-4', name: 'Kemi Lawal', role: 'Car Wash Attendant', username: 'kemi' }
];

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>(STATIC_USERS);
  const [currentRole, setCurrentRole] = useState<UserRole>('Administrator');
  const [currentUser, setCurrentUser] = useState('admin');

  // Local form states
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffUsername, setNewStaffUsername] = useState('');
  const [newStaffRole, setNewStaffRole] = useState<UserRole>('Pump Attendant');

  const showToast = (msg: string, type?: 'success' | 'error' | 'info') => {
    console.info(`[${type ?? 'info'}] ${msg}`);
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName.trim()) {
      showToast('Staff Name cannot be empty', 'error');
      return;
    }
    const uname = newStaffUsername.trim().toLowerCase();
    if (!uname) {
      showToast('Username cannot be empty', 'error');
      return;
    }

    // Check conflict
    const exists = users.some(u => u.username === uname);
    if (exists) {
      showToast(`Username "${uname}" already in use by another attendee.`, 'error');
      return;
    }

    const newUser: User = {
      id: 'usr-' + Date.now(),
      name: newStaffName.trim(),
      role: newStaffRole,
      username: uname
    };

    setUsers(prev => [...prev, newUser]);
    showToast(`System Account created for ${newUser.name} as ${newUser.role}!`, 'success');
    
    // reset form
    setNewStaffName('');
    setNewStaffUsername('');
    setNewStaffRole('Pump Attendant');
  };

  return (
    <div className="space-y-6 animate-none" id="user-management-panel">
      
      {/* Top Title Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 bg-white dark:bg-gray-800 rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-xs" id="user-mgt-header">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-100 dark:bg-indigo-950/40 rounded-xl text-indigo-600 dark:text-indigo-400">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Active Users & Context Switching</h1>
            <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">Simulate secure logins, test role restrictions & control attendant listings</p>
          </div>
        </div>
      </div>

 
      {/* Admin Panel Specific Operations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="user-mgmt-actions-grid">
        
        {/* PANEL A: ADD NEW STAFFF (Only viewable by Administrators) */}
        <div className="lg:col-span-4" id="add-user-form-container">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-xs space-y-6">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b pb-3 flex items-center gap-1.5">
              <UserPlus className="w-4 h-4 text-theme" /> Create New Staff Account
            </h2>

            {currentRole === 'Administrator' ? (
              <form onSubmit={handleCreateUser} className="space-y-4" id="create-user-form">
                
                {/* Full name */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 dark:text-gray-300">Staff Full Name</label>
                  <input
                    type="text"
                    value={newStaffName}
                    onChange={(e) => setNewStaffName(e.target.value)}
                    placeholder="e.g. Babatunde Balogun"
                    className="w-full text-xs px-3 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white rounded-lg focus:outline-none"
                    required
                  />
                </div>

                {/* Username */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 dark:text-gray-300">Staff Username</label>
                  <input
                    type="text"
                    value={newStaffUsername}
                    onChange={(e) => setNewStaffUsername(e.target.value.replace(/\s+/g, ''))}
                    placeholder="e.g. babatunde"
                    className="w-full text-xs px-3 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white rounded-lg focus:outline-none"
                    required
                  />
                </div>

                {/* Role Allocation */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 dark:text-gray-300">Division Role Allocation</label>
                  <select
                    value={newStaffRole}
                    onChange={(e) => setNewStaffRole(e.target.value as UserRole)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white rounded-lg focus:outline-none"
                  >
                    <option value="Administrator">Administrator</option>
                    <option value="Cashier">Cashier</option>
                    <option value="Pump Attendant">Pump Attendant</option>
                    <option value="Car Wash Attendant">Car Wash Attendant</option>
                  </select>
                </div>

                {/* Form Buttons */}
                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs transition"
                >
                  Confirm Account Registration
                </button>

              </form>
            ) : (
              <div className="p-4 bg-slate-50 dark:bg-slate-900/40 rounded-xl text-center text-xs text-slate-450 space-y-2">
                <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
                <p className="font-semibold text-slate-700 dark:text-slate-350">Admin privilege required</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Only Administrator role can generate new staff registers. Switch active account to "admin" to test creator features.</p>
              </div>
            )}
          </div>
        </div>

        {/* PANEL B: USER REGISTRY INDEX */}
        <div className="lg:col-span-8 animate-none" id="users-table-list">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">System Accounts Inventory</h2>
            
            <div className="overflow-x-auto border border-slate-50 dark:border-slate-700/50 rounded-xl">
              <table className="w-full text-xs text-left border-collapse">
                <thead className="bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 font-semibold border-b">
                  <tr>
                    <th className="p-3">Staff Name</th>
                    <th className="p-3">Username Account</th>
                    <th className="p-3">System Role Permission</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50 dark:text-slate-300">
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="p-3 font-bold">{u.name}</td>
                      <td className="p-3 font-mono text-slate-500">@{u.username}</td>
                      <td className="p-3">
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                          u.role === 'Administrator' 
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-400' 
                            : u.role === 'Cashier' 
                              ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/40 dark:text-purple-400' 
                              : u.role === 'Pump Attendant'
                                ? 'bg-orange-100 text-orange-850 dark:bg-orange-950/40 dark:text-orange-400'
                                : 'bg-green-105 text-green-900 dark:bg-green-950/40 dark:text-green-400'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        {/* Only Allow delete if ADMIN and not current logged in user */}
                        {currentRole === 'Administrator' ? (
                          u.username === currentUser ? (
                            <span className="text-[10px] text-slate-400 italic">Current Session</span>
                          ) : (
                            <button
                              onClick={() => {
                                if (confirm(`Are you certain you wish to purge staff member ${u.name}?`)) {
                                  setUsers(prev => prev.filter(user => user.id !== u.id));
                                  showToast(`Staff record for ${u.name} removed.`, 'info');
                                }
                              }}
                              className="text-red-500 hover:text-red-700 p-1"
                              title="Delete Account"
                            >
                              <Trash2 className="w-4 h-4 inline" />
                            </button>
                          )
                        ) : (
                          <span className="text-[10px] text-slate-400 italic">Locked</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
