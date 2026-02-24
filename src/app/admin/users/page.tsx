'use client';

import { useState, useEffect } from 'react';
import { Button, Input, Modal } from '@/components/ui';

type Office = 'LA' | 'New York' | 'Munich' | 'UK' | 'Singapore' | 'Washington DC' | 'Dallas' | 'Atlanta' | 'Jacksonville';

const OFFICES: Office[] = ['LA', 'New York', 'Munich', 'UK', 'Singapore', 'Washington DC', 'Dallas', 'Atlanta', 'Jacksonville'];

interface User {
  id: string;
  username: string;
  display_name: string;
  first_name: string | null;
  last_name: string | null;
  office: Office | null;
  role: 'admin' | 'user';
  avatar_url: string | null;
  created_at: string;
  last_login_at: string | null;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Add user modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newDisplayName, setNewDisplayName] = useState('');
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newOffice, setNewOffice] = useState<Office | ''>('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<'user' | 'admin'>('user');
  const [isAdding, setIsAdding] = useState(false);
  const [addError, setAddError] = useState('');

  // Edit user modal
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editDisplayName, setEditDisplayName] = useState('');
  const [editFirstName, setEditFirstName] = useState('');
  const [editLastName, setEditLastName] = useState('');
  const [editOffice, setEditOffice] = useState<Office | ''>('');
  const [editPassword, setEditPassword] = useState('');
  const [editRole, setEditRole] = useState<'user' | 'admin'>('user');
  const [isEditing, setIsEditing] = useState(false);
  const [editError, setEditError] = useState('');
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // Delete confirmation
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      } else {
        setError('Failed to load users');
      }
    } catch {
      setError('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async () => {
    if (!newUsername || !newDisplayName || !newPassword) {
      setAddError('Username, display name, and password are required');
      return;
    }

    setIsAdding(true);
    setAddError('');

    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: newUsername,
          display_name: newDisplayName,
          first_name: newFirstName || null,
          last_name: newLastName || null,
          office: newOffice || null,
          password: newPassword,
          role: newRole,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setUsers((prev) => [data.user, ...prev]);
        setIsAddModalOpen(false);
        setNewUsername('');
        setNewDisplayName('');
        setNewFirstName('');
        setNewLastName('');
        setNewOffice('');
        setNewPassword('');
        setNewRole('user');
      } else {
        setAddError(data.error || 'Failed to add user');
      }
    } catch {
      setAddError('Failed to add user');
    } finally {
      setIsAdding(false);
    }
  };

  const handleEditUser = async () => {
    if (!editingUser) return;

    setIsEditing(true);
    setEditError('');

    try {
      const updates: Record<string, string | null> = {};
      if (editDisplayName !== editingUser.display_name) {
        updates.display_name = editDisplayName;
      }
      if (editFirstName !== (editingUser.first_name || '')) {
        updates.first_name = editFirstName || null;
      }
      if (editLastName !== (editingUser.last_name || '')) {
        updates.last_name = editLastName || null;
      }
      if (editOffice !== (editingUser.office || '')) {
        updates.office = editOffice || null;
      }
      if (editRole !== editingUser.role) {
        updates.role = editRole;
      }
      if (editPassword) {
        updates.password = editPassword;
      }

      if (Object.keys(updates).length === 0) {
        setEditingUser(null);
        return;
      }

      const response = await fetch(`/api/admin/users/${editingUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (response.ok) {
        setUsers((prev) =>
          prev.map((u) => (u.id === editingUser.id ? data.user : u))
        );
        setEditingUser(null);
      } else {
        setEditError(data.error || 'Failed to update user');
      }
    } catch {
      setEditError('Failed to update user');
    } finally {
      setIsEditing(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!deletingUser) return;

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/admin/users/${deletingUser.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setUsers((prev) => prev.filter((u) => u.id !== deletingUser.id));
        setDeletingUser(null);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to delete user');
      }
    } catch {
      setError('Failed to delete user');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAvatarUpload = async (file: File) => {
    if (!editingUser) return;

    setIsUploadingAvatar(true);
    setEditError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`/api/admin/users/${editingUser.id}/avatar`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setUsers((prev) =>
          prev.map((u) => (u.id === editingUser.id ? data.user : u))
        );
        setEditingUser(data.user);
      } else {
        setEditError(data.error || 'Failed to upload avatar');
      }
    } catch {
      setEditError('Failed to upload avatar');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleAvatarRemove = async () => {
    if (!editingUser) return;

    setIsUploadingAvatar(true);
    setEditError('');

    try {
      const response = await fetch(`/api/admin/users/${editingUser.id}/avatar`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        setUsers((prev) =>
          prev.map((u) => (u.id === editingUser.id ? data.user : u))
        );
        setEditingUser(data.user);
      } else {
        setEditError(data.error || 'Failed to remove avatar');
      }
    } catch {
      setEditError('Failed to remove avatar');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setEditDisplayName(user.display_name);
    setEditFirstName(user.first_name || '');
    setEditLastName(user.last_name || '');
    setEditOffice(user.office || '');
    setEditRole(user.role);
    setEditPassword('');
    setEditError('');
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Users</h2>
          <p className="text-sm text-muted">Manage user accounts and permissions</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          Add User
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-error/10 border border-error/20 rounded-lg">
          <p className="text-error text-sm">{error}</p>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-card-bg border border-card-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-card-border bg-card-border/30">
              <th className="text-left px-4 py-3 text-sm font-medium text-muted">User</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-muted">Office</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-muted">Role</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-muted">Last Login</th>
              <th className="text-right px-4 py-3 text-sm font-medium text-muted">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-card-border last:border-0">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {user.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        alt={user.display_name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent text-sm font-medium">
                        {user.display_name[0].toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-foreground">{user.display_name}</p>
                      <p className="text-xs text-muted">@{user.username}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-muted">
                  {user.office || '—'}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      user.role === 'admin'
                        ? 'bg-accent/20 text-accent'
                        : 'bg-card-border text-muted'
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-muted">
                  {formatDate(user.last_login_at)}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => openEditModal(user)}
                    className="text-sm text-accent hover:underline mr-3"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeletingUser(user)}
                    className="text-sm text-error hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <div className="text-center py-12 text-muted">
            No users found
          </div>
        )}
      </div>

      {/* Add User Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setNewUsername('');
          setNewDisplayName('');
          setNewFirstName('');
          setNewLastName('');
          setNewOffice('');
          setNewPassword('');
          setNewRole('user');
          setAddError('');
        }}
        title="Add New User"
      >
        <div className="space-y-4">
          <Input
            label="Username"
            placeholder="e.g., johndoe"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            autoFocus
          />
          <Input
            label="Display Name"
            placeholder="e.g., John Doe"
            value={newDisplayName}
            onChange={(e) => setNewDisplayName(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              placeholder="John"
              value={newFirstName}
              onChange={(e) => setNewFirstName(e.target.value)}
            />
            <Input
              label="Last Name"
              placeholder="Doe"
              value={newLastName}
              onChange={(e) => setNewLastName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Office
            </label>
            <select
              value={newOffice}
              onChange={(e) => setNewOffice(e.target.value as Office | '')}
              className="w-full px-3 py-2 bg-card-bg border border-card-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="">Select office...</option>
              {OFFICES.map((office) => (
                <option key={office} value={office}>{office}</option>
              ))}
            </select>
          </div>
          <Input
            label="Password"
            type="password"
            placeholder="Minimum 6 characters"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Role
            </label>
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value as 'user' | 'admin')}
              className="w-full px-3 py-2 bg-card-bg border border-card-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          {addError && (
            <p className="text-error text-sm">{addError}</p>
          )}
          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="secondary"
              onClick={() => {
                setIsAddModalOpen(false);
                setAddError('');
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleAddUser} isLoading={isAdding}>
              Add User
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        isOpen={!!editingUser}
        onClose={() => {
          setEditingUser(null);
          setEditError('');
        }}
        title="Edit User"
      >
        <div className="space-y-4">
          {/* Avatar Upload */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Profile Picture
            </label>
            <div className="flex items-center gap-4">
              {editingUser?.avatar_url ? (
                <img
                  src={editingUser.avatar_url}
                  alt={editingUser.display_name}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center text-accent text-xl font-medium">
                  {editingUser?.display_name[0].toUpperCase()}
                </div>
              )}
              <div className="flex flex-col gap-2">
                <label className="cursor-pointer">
                  <span className="inline-flex items-center px-3 py-1.5 text-sm bg-card-border hover:bg-muted/30 rounded transition-colors">
                    {isUploadingAvatar ? 'Uploading...' : 'Upload Photo'}
                  </span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleAvatarUpload(file);
                      e.target.value = '';
                    }}
                    disabled={isUploadingAvatar}
                  />
                </label>
                {editingUser?.avatar_url && (
                  <button
                    type="button"
                    onClick={handleAvatarRemove}
                    disabled={isUploadingAvatar}
                    className="text-sm text-error hover:underline text-left"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
            <p className="text-xs text-muted mt-2">JPG, PNG, GIF or WebP. Max 2MB.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Username
            </label>
            <p className="text-muted">@{editingUser?.username}</p>
          </div>
          <Input
            label="Display Name"
            value={editDisplayName}
            onChange={(e) => setEditDisplayName(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              placeholder="John"
              value={editFirstName}
              onChange={(e) => setEditFirstName(e.target.value)}
            />
            <Input
              label="Last Name"
              placeholder="Doe"
              value={editLastName}
              onChange={(e) => setEditLastName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Office
            </label>
            <select
              value={editOffice}
              onChange={(e) => setEditOffice(e.target.value as Office | '')}
              className="w-full px-3 py-2 bg-card-bg border border-card-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="">Select office...</option>
              {OFFICES.map((office) => (
                <option key={office} value={office}>{office}</option>
              ))}
            </select>
          </div>
          <Input
            label="New Password"
            type="password"
            placeholder="Leave blank to keep current"
            value={editPassword}
            onChange={(e) => setEditPassword(e.target.value)}
          />
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Role
            </label>
            <select
              value={editRole}
              onChange={(e) => setEditRole(e.target.value as 'user' | 'admin')}
              className="w-full px-3 py-2 bg-card-bg border border-card-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          {editError && (
            <p className="text-error text-sm">{editError}</p>
          )}
          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="secondary"
              onClick={() => {
                setEditingUser(null);
                setEditError('');
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleEditUser} isLoading={isEditing}>
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingUser}
        onClose={() => setDeletingUser(null)}
        title="Delete User"
      >
        <div className="space-y-4">
          <p className="text-foreground">
            Are you sure you want to delete <strong>{deletingUser?.display_name}</strong>?
            This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="secondary"
              onClick={() => setDeletingUser(null)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteUser}
              isLoading={isDeleting}
              className="bg-error hover:bg-error/90"
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
