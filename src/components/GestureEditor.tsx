'use client';

import React, { useState } from 'react';
import { Trash2, Plus } from 'lucide-react';
import { Gesture, GestureType, getGestureTypeLabel, getActionLabel } from '@/utils/gestures';

interface GestureEditorProps {
  gestures: Gesture[];
  onAddGesture?: (gesture: Omit<Gesture, 'id' | 'created_at'>) => void;
  onUpdateGesture?: (id: string, updates: Partial<Gesture>) => void;
  onDeleteGesture?: (id: string) => void;
}

const GESTURE_TYPES: GestureType[] = ['long-press', 'swipe', 'double-tap', 'triple-tap', 'custom'];
const ACTIONS = ['toggle-emergency', 'open-menu', 'call-guardian', 'activate-strategy'];

export function GestureEditor({
  gestures,
  onAddGesture,
  onUpdateGesture: _onUpdateGesture,
  onDeleteGesture,
}: GestureEditorProps) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    gesture_type: 'long-press' as GestureType,
    action: 'toggle-emergency',
    user_only: false,
    can_be_overridden_by_carer: true,
  });

  const handleAddGesture = () => {
    if (onAddGesture) {
      onAddGesture({
        patient_id: '', // Will be set by parent
        gesture_type: formData.gesture_type,
        action: formData.action,
        action_params: {},
        applies_to_modes: [],
        user_only: formData.user_only,
        can_be_overridden_by_carer: formData.can_be_overridden_by_carer,
      });
      setShowForm(false);
      setFormData({
        gesture_type: 'long-press',
        action: 'toggle-emergency',
        user_only: false,
        can_be_overridden_by_carer: true,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Existing Gestures */}
      <div>
        <h3 className="text-lg font-semibold text-neutral-100 mb-4">Your Gestures</h3>
        {gestures.length === 0 ? (
          <p className="text-neutral-400">No gestures configured yet.</p>
        ) : (
          <div className="space-y-3">
            {gestures.map((gesture) => (
              <div
                key={gesture.id}
                className="bg-neutral-900 rounded-lg border border-neutral-800 p-4 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-neutral-100">
                    {getGestureTypeLabel(gesture.gesture_type as GestureType)}
                  </p>
                  <p className="text-sm text-neutral-400">{getActionLabel(gesture.action)}</p>
                  {gesture.user_only && <p className="text-xs text-yellow-400 mt-1">User only</p>}
                </div>
                {onDeleteGesture && (
                  <button type="button"
                    onClick={() => onDeleteGesture(gesture.id)}
                    className="p-2 hover:bg-red-900 rounded transition-colors"
                    title="Delete gesture"
                  >
                    <Trash2 className="w-5 h-5 text-red-500" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Gesture Form */}
      {onAddGesture && (
        <div>
          {!showForm ? (
            <button type="button"
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Gesture
            </button>
          ) : (
            <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-6 space-y-4">
              <h4 className="font-semibold text-neutral-100">Create New Gesture</h4>

              {/* Gesture Type */}
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Gesture Type
                </label>
                <select
                  value={formData.gesture_type}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      gesture_type: e.target.value as GestureType,
                    })
                  }
                  className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded text-neutral-100"
                >
                  {GESTURE_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {getGestureTypeLabel(type)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Action */}
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Action</label>
                <select
                  value={formData.action}
                  onChange={(e) => setFormData({ ...formData, action: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded text-neutral-100"
                >
                  {ACTIONS.map((action) => (
                    <option key={action} value={action}>
                      {getActionLabel(action)}
                    </option>
                  ))}
                </select>
              </div>

              {/* User Only */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="user_only"
                  checked={formData.user_only}
                  onChange={(e) => setFormData({ ...formData, user_only: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="user_only" className="text-sm text-neutral-300">
                  User only (caregivers cannot use this gesture)
                </label>
              </div>

              {/* Can Be Overridden */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="can_override"
                  checked={formData.can_be_overridden_by_carer}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      can_be_overridden_by_carer: e.target.checked,
                    })
                  }
                  className="w-4 h-4"
                />
                <label htmlFor="can_override" className="text-sm text-neutral-300">
                  Can be overridden by caregivers
                </label>
              </div>

              {/* Buttons */}
              <div className="flex gap-2 pt-4">
                <button type="button"
                  onClick={handleAddGesture}
                  className="flex-1 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded font-medium transition-colors"
                >
                  Create Gesture
                </button>
                <button type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-100 rounded font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

