'use client';

import { useEffect, useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { StrategyCard } from '@/components/StrategyCard';
import { CommunityStrategy, AgeGroup, StrategyCategory } from '@/types';
import { Search, Filter } from 'lucide-react';

export default function CommunityPage() {
  const [strategies, setStrategies] = useState<CommunityStrategy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<AgeGroup>('all');
  const [selectedCategory, setSelectedCategory] = useState<StrategyCategory | ''>('');
  const [sortBy, setSortBy] = useState<'rating' | 'popularity' | 'recent'>('rating');
  const [showFilters, setShowFilters] = useState(false);

  const categories: StrategyCategory[] = [
    'breathwork',
    'grounding',
    'body_awareness',
    'sensory',
    'other',
  ];
  const ageGroups: AgeGroup[] = ['child', 'teen', 'adult', 'all'];

  const fetchStrategies = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        ageGroup: selectedAgeGroup,
        sortBy,
        limit: '50',
      });

      if (searchTerm) {
        params.append('search', searchTerm);
      }

      if (selectedCategory) {
        params.append('category', selectedCategory);
      }

      const response = await fetch(`/api/community-strategies?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch strategies');
      }

      const result = await response.json();
      setStrategies(result.data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setStrategies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStrategies();
  }, [searchTerm, selectedAgeGroup, selectedCategory, sortBy]);

  const handleRate = async (strategyId: string, rating: number) => {
    try {
      const response = await fetch(`/api/community-strategies/${strategyId}/rate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating,
          patient_id: 'current-patient-id', // In real app, get from auth context
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to rate strategy');
      }

      // Refresh strategies to show updated rating
      fetchStrategies();
    } catch (err) {
      console.error('Error rating strategy:', err);
    }
  };

  return (
    <AppLayout headerProps={{ userName: 'Violet', supportLevel: 1 }}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-neutral-100 mb-2">Community Library</h1>
          <p className="text-neutral-400">Discover coping strategies from the community.</p>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-3 text-neutral-500" size={20} />
          <input
            type="text"
            placeholder="Search strategies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg pl-10 pr-4 py-2 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-teal-500"
          />
        </div>

        {/* Filter Toggle */}
        <button type="button"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 text-neutral-400 hover:text-neutral-200 transition-colors"
        >
          <Filter size={18} />
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>

        {/* Filters */}
        {showFilters && (
          <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-4 space-y-4">
            {/* Age Group Filter */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Age Group</label>
              <div className="flex flex-wrap gap-2">
                {ageGroups.map((group) => (
                  <button type="button"
                    key={group}
                    onClick={() => setSelectedAgeGroup(group)}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      selectedAgeGroup === group
                        ? 'bg-teal-600 text-white'
                        : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                    }`}
                  >
                    {group === 'all' ? 'All Ages' : group.charAt(0).toUpperCase() + group.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Category</label>
              <div className="flex flex-wrap gap-2">
                <button type="button"
                  onClick={() => setSelectedCategory('')}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    selectedCategory === ''
                      ? 'bg-teal-600 text-white'
                      : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                  }`}
                >
                  All
                </button>
                {categories.map((cat) => (
                  <button type="button"
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors capitalize ${
                      selectedCategory === cat
                        ? 'bg-teal-600 text-white'
                        : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                    }`}
                  >
                    {cat.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Sort By</label>
              <div className="flex flex-wrap gap-2">
                {(['rating', 'popularity', 'recent'] as const).map((sort) => (
                  <button type="button"
                    key={sort}
                    onClick={() => setSortBy(sort)}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors capitalize ${
                      sortBy === sort
                        ? 'bg-teal-600 text-white'
                        : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                    }`}
                  >
                    {sort}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {loading ? (
          <div className="text-center py-8">
            <p className="text-neutral-400">Loading strategies...</p>
          </div>
        ) : error ? (
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-4">
            <p className="text-red-400">{error}</p>
          </div>
        ) : strategies.length === 0 ? (
          <div className="bg-neutral-900 rounded-lg p-6 border border-neutral-800 text-center">
            <p className="text-neutral-400">No strategies found. Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {strategies.map((strategy) => (
              <StrategyCard
                key={strategy.id}
                strategy={strategy}
                onRate={(rating) => handleRate(strategy.id, rating)}
              />
            ))}
          </div>
        )}

        {/* Results Count */}
        {!loading && strategies.length > 0 && (
          <p className="text-sm text-neutral-400 text-center">
            Showing {strategies.length} strateg{strategies.length === 1 ? 'y' : 'ies'}
          </p>
        )}
      </div>
    </AppLayout>
  );
}
