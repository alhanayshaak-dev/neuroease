'use client';

import React, { useState } from 'react';
import { GuardianLayout } from '@/components/GuardianLayout';
import {
  Heart,
  MessageCircle,
  Share2,
  Star,
  Search,
  Users,
  BookOpen,
  Award,
  TrendingUp,
  FileText,
  Plus,
  User,
} from 'lucide-react';
import {
  generateTrendingStrategies,
  generateSuccessStories,
  generatePeerSupportMatches,
  generateLearningResources,
  generateSupportGroups,
  generateUserProfiles,
} from '@/utils/community-data';

interface Strategy {
  id: string;
  title: string;
  author: string;
  category: string;
  description: string;
  rating: number;
  likes: number;
  comments: number;
  verified: boolean;
}

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState<
    'strategies' | 'trending' | 'stories' | 'support' | 'resources' | 'profiles'
  >('strategies');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');

  const strategies: Strategy[] = [
    {
      id: '1',
      title: 'Box Breathing for Anxiety',
      author: 'Sarah M.',
      category: 'Breathing',
      description: 'A simple 4-4-4-4 breathing technique that helps calm the nervous system',
      rating: 4.8,
      likes: 234,
      comments: 45,
      verified: true,
    },
    {
      id: '2',
      title: 'Weighted Blanket Routine',
      author: 'James T.',
      category: 'Sensory',
      description: 'Using weighted blankets for deep pressure stimulation and relaxation',
      rating: 4.6,
      likes: 189,
      comments: 32,
      verified: false,
    },
    {
      id: '3',
      title: 'Noise-Canceling Headphones Protocol',
      author: 'Dr. Emily R.',
      category: 'Auditory',
      description: 'Best practices for using noise-canceling technology in different environments',
      rating: 4.9,
      likes: 312,
      comments: 67,
      verified: true,
    },
  ];

  const trendingStrategies = generateTrendingStrategies();
  const successStories = generateSuccessStories();
  const peerMatches = generatePeerSupportMatches();
  const learningResources = generateLearningResources();
  const supportGroups = generateSupportGroups();
  const userProfiles = generateUserProfiles();

  return (
    <GuardianLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-lg font-bold text-white mb-1">Community Library</h1>
            <p className="text-xs text-gray-400">Discover coping strategies shared by the community</p>
          </div>
          <button
            onClick={() => window.history.back()}
            className="text-gray-400 hover:text-white transition-colors p-2"
            title="Go back"
          >
            <span className="text-2xl font-bold">✕</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 border-b border-teal-600/30 overflow-x-auto">
          {['strategies', 'trending', 'stories', 'support', 'resources', 'profiles'].map((tab) => (
            <button type="button"
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-2 font-semibold transition-colors whitespace-nowrap ${
                activeTab === tab
                  ? 'text-teal-400 border-b-2 border-teal-400'
                  : 'text-gray-400 hover:text-teal-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Strategies Tab */}
        {activeTab === 'strategies' && (
          <div className="space-y-6">
            {/* Search & Filter */}
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search size={18} className="absolute left-3 top-3 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search strategies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-navy-900 border border-teal-600/30 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-teal-400"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-navy-900 border border-teal-600/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-teal-400"
              >
                <option>All Categories</option>
                <option>Breathing</option>
                <option>Sensory</option>
                <option>Auditory</option>
                <option>Movement</option>
                <option>Social</option>
              </select>
            </div>

            {/* Strategies Feed */}
            <div className="space-y-4">
              {strategies.map((strategy) => (
                <div
                  key={strategy.id}
                  className="bg-navy-900 border border-teal-600/30 rounded-lg p-6 hover:border-teal-400 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-white font-semibold text-lg">{strategy.title}</h3>
                        {strategy.verified && (
                          <span className="bg-green-900/30 text-green-400 text-xs px-2 py-1 rounded">
                            Verified
                          </span>
                        )}
                      </div>
                      <p className="text-gray-400 text-sm">
                        by {strategy.author} • {strategy.category}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star size={16} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-white font-semibold text-sm">{strategy.rating}</span>
                    </div>
                  </div>

                  <p className="text-gray-300 text-sm mb-4">{strategy.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6 text-gray-400 text-sm">
                      <button type="button" className="flex items-center gap-2 hover:text-teal-400 transition-colors">
                        <Heart size={18} />
                        {strategy.likes}
                      </button>
                      <button type="button" className="flex items-center gap-2 hover:text-teal-400 transition-colors">
                        <MessageCircle size={18} />
                        {strategy.comments}
                      </button>
                      <button type="button" className="flex items-center gap-2 hover:text-teal-400 transition-colors">
                        <Share2 size={18} />
                        Share
                      </button>
                    </div>
                    <button type="button" className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                      Learn More
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <button type="button" className="bg-navy-900 border border-teal-600/30 hover:border-teal-400 text-white px-6 py-2 rounded-lg transition-colors">
                Load More Strategies
              </button>
            </div>
          </div>
        )}

        {/* Trending Tab */}
        {activeTab === 'trending' && (
          <div className="space-y-6">
            <div className="bg-navy-900 border border-teal-600/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <TrendingUp size={20} />
                Trending Strategies
              </h3>
              <div className="space-y-3">
                {trendingStrategies.map((strategy, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-black/50 rounded">
                    <div>
                      <p className="text-white font-semibold text-sm">{strategy.title}</p>
                      <p className="text-gray-400 text-xs">by {strategy.author}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 mb-1">
                        <Star size={14} className="text-yellow-400 fill-yellow-400" />
                        <span className="text-white font-semibold text-sm">{strategy.rating}</span>
                      </div>
                      <p className="text-gray-500 text-xs">{strategy.views} views</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Community Challenges */}
            <div className="bg-navy-900 border border-teal-600/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Award size={20} />
                Active Challenges
              </h3>
              <div className="space-y-3">
                <div className="bg-black/50 rounded p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-white font-semibold">7-Day Breathing Challenge</p>
                      <p className="text-gray-400 text-xs">Practice deep breathing for 5 minutes daily</p>
                    </div>
                    <span className="bg-teal-900/30 text-teal-300 text-xs px-2 py-1 rounded">234 participants</span>
                  </div>
                  <button type="button" className="text-teal-400 hover:text-teal-300 text-xs font-semibold mt-2">
                    Join Challenge
                  </button>
                </div>
                <div className="bg-black/50 rounded p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-white font-semibold">Sensory-Friendly Week</p>
                      <p className="text-gray-400 text-xs">Create a sensory-friendly space at home or school</p>
                    </div>
                    <span className="bg-teal-900/30 text-teal-300 text-xs px-2 py-1 rounded">156 participants</span>
                  </div>
                  <button type="button" className="text-teal-400 hover:text-teal-300 text-xs font-semibold mt-2">
                    Join Challenge
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Success Stories Tab */}
        {activeTab === 'stories' && (
          <div className="space-y-4">
            {successStories.map((story) => (
              <div key={story.id} className="bg-navy-900 border border-teal-600/30 rounded-lg p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-white font-semibold text-lg">{story.title}</h3>
                    <p className="text-gray-400 text-sm">by {story.author}</p>
                  </div>
                  <span className="text-gray-500 text-xs">{story.date}</span>
                </div>
                <p className="text-gray-300 text-sm mb-4">{story.excerpt}</p>
                <div className="flex items-center gap-4">
                  <button type="button" className="flex items-center gap-2 text-gray-400 hover:text-teal-400 transition-colors">
                    <Heart size={18} />
                    {story.likes}
                  </button>
                  <button type="button" className="text-teal-400 hover:text-teal-300 text-sm font-semibold">
                    Read Full Story
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Support Tab */}
        {activeTab === 'support' && (
          <div className="space-y-6">
            {/* Support Groups */}
            <div className="bg-navy-900 border border-teal-600/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Users size={20} />
                Support Groups
              </h3>
              <div className="space-y-3">
                {supportGroups.map((group) => (
                  <div key={group.id} className="bg-black/50 rounded p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-white font-semibold">{group.name}</p>
                        <p className="text-gray-400 text-xs">{group.topic}</p>
                        <p className="text-gray-500 text-xs mt-1">
                          {group.meetingTime} • Led by {group.facilitator}
                        </p>
                      </div>
                      <span className="bg-teal-900/30 text-teal-300 text-xs px-2 py-1 rounded">
                        {group.members} members
                      </span>
                    </div>
                    <button type="button" className="text-teal-400 hover:text-teal-300 text-xs font-semibold mt-2">
                      Join Group
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Peer Support Matching */}
            <div className="bg-navy-900 border border-teal-600/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <User size={20} />
                Peer Support Matches
              </h3>
              <div className="space-y-3">
                {peerMatches.map((match) => (
                  <div key={match.id} className="bg-black/50 rounded p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-white font-semibold">{match.name}</p>
                        <p className="text-gray-400 text-xs">
                          {Math.round(match.similarity * 100)}% match
                        </p>
                      </div>
                      <span className="bg-green-900/30 text-green-400 text-xs px-2 py-1 rounded">
                        {match.status}
                      </span>
                    </div>
                    <p className="text-gray-500 text-xs mb-2">
                      Common interests: {match.commonInterests.join(', ')}
                    </p>
                    <button type="button" className="text-teal-400 hover:text-teal-300 text-xs font-semibold">
                      Connect
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Resources Tab */}
        {activeTab === 'resources' && (
          <div className="space-y-6">
            <div className="bg-navy-900 border border-teal-600/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <BookOpen size={20} />
                Learning Resources
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {learningResources.map((resource) => (
                  <div
                    key={resource.id}
                    className="bg-black/50 rounded p-4 hover:border-teal-400 border border-transparent transition-colors cursor-pointer"
                  >
                    <p className="text-white font-semibold text-sm mb-1">{resource.title}</p>
                    <p className="text-gray-400 text-xs mb-2">{resource.category}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 text-xs">{resource.type}</span>
                      <span className="text-teal-400 text-xs">{resource.duration}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Resources */}
            <div className="bg-navy-900 border border-teal-600/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Recommended Resources</h3>
              <div className="space-y-3">
                <div className="bg-black/50 rounded p-4 hover:border-teal-400 border border-transparent transition-colors cursor-pointer">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-white font-semibold text-sm">Understanding Autism Spectrum Disorder</p>
                      <p className="text-gray-400 text-xs">Educational Guide</p>
                    </div>
                    <span className="bg-teal-900/30 text-teal-300 text-xs px-2 py-1 rounded">15 min</span>
                  </div>
                  <p className="text-gray-500 text-xs">Learn about ASD characteristics, strengths, and support strategies.</p>
                </div>

                <div className="bg-black/50 rounded p-4 hover:border-teal-400 border border-transparent transition-colors cursor-pointer">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-white font-semibold text-sm">Sensory Processing & Regulation</p>
                      <p className="text-gray-400 text-xs">Video Course</p>
                    </div>
                    <span className="bg-teal-900/30 text-teal-300 text-xs px-2 py-1 rounded">45 min</span>
                  </div>
                  <p className="text-gray-500 text-xs">Explore sensory sensitivities and evidence-based regulation techniques.</p>
                </div>

                <div className="bg-black/50 rounded p-4 hover:border-teal-400 border border-transparent transition-colors cursor-pointer">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-white font-semibold text-sm">Communication Strategies for Caregivers</p>
                      <p className="text-gray-400 text-xs">Interactive Workshop</p>
                    </div>
                    <span className="bg-teal-900/30 text-teal-300 text-xs px-2 py-1 rounded">30 min</span>
                  </div>
                  <p className="text-gray-500 text-xs">Learn effective communication techniques tailored for neurodivergent individuals.</p>
                </div>

                <div className="bg-black/50 rounded p-4 hover:border-teal-400 border border-transparent transition-colors cursor-pointer">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-white font-semibold text-sm">Stress Management & Coping Skills</p>
                      <p className="text-gray-400 text-xs">Guided Practice</p>
                    </div>
                    <span className="bg-teal-900/30 text-teal-300 text-xs px-2 py-1 rounded">20 min</span>
                  </div>
                  <p className="text-gray-500 text-xs">Practical exercises for managing stress and building resilience.</p>
                </div>
              </div>
            </div>

            {/* External Resources */}
            <div className="bg-navy-900 border border-teal-600/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">External Resources</h3>
              <div className="space-y-2">
                <a href="#" className="block text-teal-400 hover:text-teal-300 text-sm font-semibold">
                  → Autism Society of America
                </a>
                <a href="#" className="block text-teal-400 hover:text-teal-300 text-sm font-semibold">
                  → National Institute of Mental Health
                </a>
                <a href="#" className="block text-teal-400 hover:text-teal-300 text-sm font-semibold">
                  → Crisis Text Line (Text HOME to 741741)
                </a>
                <a href="#" className="block text-teal-400 hover:text-teal-300 text-sm font-semibold">
                  → SAMHSA National Helpline (1-800-662-4357)
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Profiles Tab */}
        {activeTab === 'profiles' && (
          <div className="space-y-4">
            {userProfiles.map((profile) => (
              <div key={profile.id} className="bg-navy-900 border border-teal-600/30 rounded-lg p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-white font-semibold text-lg">{profile.name}</p>
                    <p className="text-gray-400 text-sm capitalize">{profile.role}</p>
                    {profile.bio && <p className="text-gray-300 text-sm mt-2">{profile.bio}</p>}
                  </div>
                  <div className="text-right">
                    <p className="text-teal-400 font-semibold">{profile.followers}</p>
                    <p className="text-gray-500 text-xs">followers</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                  <span>Joined {profile.joinDate}</span>
                  <span>{profile.strategiesShared} strategies shared</span>
                </div>
                <button type="button" className="text-teal-400 hover:text-teal-300 text-sm font-semibold">
                  View Profile
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </GuardianLayout>
  );
}

