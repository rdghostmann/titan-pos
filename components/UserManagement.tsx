"use client";
import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  Shield, 
  CheckCircle, 
  UserSquare2, 
  AlertTriangle, 
  Trash2, 
  Key, 
  Unlock,
  LoaderCircle,
} from 'lucide-react';
import {
  CreateUserStaff,
  GetUserStaff,
  DeleteUserStaff,
  type UserStaffRecord,
} from "@/controllers/CreateUserStaff";
import { toast } from 'sonner';

export default function UserManagement() {
  const [users, setUsers] = useState<UserStaffRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [currentRole, setCurrentRole] = useState<'admin' | 'cashier'>('admin');
  const [currentUser, setCurrentUser] = useState('admin');

  // Local form states
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffRole, setNewStaffRole] = useState<'admin' | 'cashier'>('cashier');

  // Load users on mount
  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    setLoading(true);
    const result = await GetUserStaff();
    if (result.success) {
      setUsers(result.users);
    } else {
      toast.error(result.message);
    }
    setLoading(false);
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName.trim()) {
      toast.error('Staff name is required.');
      return;
    }

    setSaving(true);

    const result = await CreateUserStaff({
      name: newStaffName.trim(),
      role: newStaffRole,
    });

    setSaving(false);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(`Staff account created: ${result.user?.username}@titanpos.com`);
    
    // Reset form
    setNewStaffName('');
    setNewStaffRole('cashier');
    
    // Reload users
    await loadUsers();
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

            {currentRole === 'admin' ? (
              <form onSubmit={handleCreateUser} className="space-y-4" id="create-user-form">
                
                {/* Full name */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 dark:text-gray-300">Staff Full Name</label>
                  <input
                    type="text"
                    value={newStaffName}
                    onChange={(e) => setNewStaffName(e.target.value)}
                    placeholder="e.g. Babatunde Balogun"
                    className="w-full text-xs px-3 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white rounded-lg focus:outline-none disabled:opacity-50"
                    required
                    disabled={saving}
                  />
                </div>

                {/* Auto-generated username info */}
                <div className="p-3 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 rounded-lg">
                  <p className="text-[10px] text-blue-700 dark:text-blue-300">
                    <span className="font-semibold">Auto-generated username:</span> First name + 4 random digits (e.g., babatunde2847)
                  </p>
                  <p className="text-[10px] text-blue-600 dark:text-blue-400 mt-1">
                    <span className="font-semibold">Email:</span> {newStaffName ? newStaffName.split(' ')[0].toLowerCase() : 'username'}****@titanpos.com
                  </p>
                  <p className="text-[10px] text-blue-600 dark:text-blue-400 mt-1">
                    <span className="font-semibold">Default password:</span> cashier123
                  </p>
                </div>

                {/* Role Allocation */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 dark:text-gray-300">Account Role</label>
                  <select
                    value={newStaffRole}
                    onChange={(e) => setNewStaffRole(e.target.value as 'admin' | 'cashier')}
                    className="w-full text-xs px-3 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white rounded-lg focus:outline-none disabled:opacity-50"
                    disabled={saving}
                  >
                    <option value="admin">Administrator</option>
                    <option value="cashier">Cashier</option>
                  </select>
                </div>

                {/* Form Buttons */}
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-bold rounded-lg text-xs transition flex items-center justify-center gap-1.5"
                >
                  {saving ? (
                    <>
                      <LoaderCircle className="w-3.5 h-3.5 animate-spin" /> Creating Account...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-3.5 h-3.5" /> Confirm Account Registration
                    </>
                  )}
                </button>

              </form>
            ) : (
              <div className="p-4 bg-slate-50 dark:bg-slate-900/40 rounded-xl text-center text-xs text-slate-450 space-y-2">
                <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
                <p className="font-semibold text-slate-700 dark:text-slate-350">Admin privilege required</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Only Administrators can create new staff accounts. You are currently logged in as <span className="font-mono font-semibold\">@{currentUser}</span> ({currentRole}).</p>
              </div>
            )}
          </div>
        </div>

        {/* PANEL B: USER REGISTRY INDEX */}
        <div className="lg:col-span-8 animate-none" id="users-table-list">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-xs space-y-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">System Accounts Inventory</h2>
              {loading && <p className="text-[11px] text-blue-600 dark:text-blue-400 mt-1">Loading staff accounts...</p>}
            </div>
            
            <div className="overflow-x-auto border border-slate-50 dark:border-slate-700/50 rounded-xl">
              <table className="w-full text-xs text-left border-collapse">
                <thead className="bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 font-semibold border-b">
                  <tr>
                    <th className="p-3">Staff Name</th>
                    <th className="p-3">Email Address</th>
                    <th className="p-3">System Role</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50 dark:text-slate-300">
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-slate-400 dark:text-slate-500">
                        <Users className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto mb-2 opacity-60" />
                        No staff accounts yet.
                      </td>
                    </tr>
                  ) : (
                    users.map(u => (
                      <tr key={u._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                        <td className="p-3 font-bold">{u.name}</td>
                        <td className="p-3 font-mono text-slate-500 text-[10px]">{u.email}</td>
                        <td className="p-3">
                          <span className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                            u.role === 'admin' 
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-400' 
                              : 'bg-purple-100 text-purple-800 dark:bg-purple-950/40 dark:text-purple-400'
                          }`}>
                            {u.role === 'admin' ? 'Administrator' : 'Cashier'}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          {/* Only Allow delete if ADMIN and not current logged in user */}
                          {currentRole === 'admin' ? (
                            u.username === currentUser ? (
                              <span className="text-[10px] text-slate-400 italic">Current Session</span>
                            ) : (
                              <button
                                onClick={async () => {
                                  if (!confirm(`Delete staff account for ${u.name}?`)) return;
                                  const result = await DeleteUserStaff(u._id);
                                  if (result.success) {
                                    toast.success('Staff account deleted.');
                                    await loadUsers();
                                  } else {
                                    toast.error(result.message);
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
                    ))
                  )}
                </tbody>
              </table>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
