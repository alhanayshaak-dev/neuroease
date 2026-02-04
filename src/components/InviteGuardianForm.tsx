'use client';

import { useState } from 'react';
import { createDefaultPermissions } from '@/utils/permissions';

interface InviteGuardianFormProps {
  onSubmit: (data: {
    guardianEmail: string;
    relationship: 'parent' | 'therapist' | 'teacher' | 'other';
  }) => Promise<void>;
  isLoading?: boolean;
}

export function InviteGuardianForm({ onSubmit, isLoading = false }: InviteGuardianFormProps) {
  const [email, setEmail] = useState('');
  const [relationship, setRelationship] = useState<'parent' | 'therapist' | 'teacher' | 'other'>(
    'parent'
  );
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !relationship) {
      setError('Please fill in all fields');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      await onSubmit({
        guardianEmail: email,
        relationship,
      });

      setSuccess('Guardian invited successfully!');
      setEmail('');
      setRelationship('parent');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to invite guardian');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-neutral-200 mb-2">
          Guardian Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="guardian@example.com"
          disabled={isLoading}
          className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-teal-500 disabled:opacity-50"
        />
      </div>

      <div>
        <label htmlFor="relationship" className="block text-sm font-medium text-neutral-200 mb-2">
          Relationship
        </label>
        <select
          id="relationship"
          value={relationship}
          onChange={(e) =>
            setRelationship(e.target.value as 'parent' | 'therapist' | 'teacher' | 'other')
          }
          disabled={isLoading}
          className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-100 focus:outline-none focus:border-teal-500 disabled:opacity-50"
        >
          <option value="parent">Parent</option>
          <option value="therapist">Therapist</option>
          <option value="teacher">Teacher</option>
          <option value="other">Other</option>
        </select>
      </div>

      {error && <div className="text-sm text-red-400 bg-red-500/10 p-3 rounded-lg">{error}</div>}

      {success && (
        <div className="text-sm text-teal-400 bg-teal-500/10 p-3 rounded-lg">{success}</div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Inviting...' : 'Invite Guardian'}
      </button>
    </form>
  );
}

