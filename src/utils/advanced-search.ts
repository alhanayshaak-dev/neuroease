// Advanced Search
export interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'alert' | 'medication' | 'device' | 'note' | 'message';
  timestamp: string;
  relevance: number;
}

export interface SearchFilter {
  type?: string;
  dateRange?: { start: string; end: string };
  priority?: 'low' | 'medium' | 'high';
  status?: string;
}

export interface SavedSearch {
  id: string;
  name: string;
  query: string;
  filters: SearchFilter;
  createdAt: string;
}

export function fullTextSearch(query: string, data: any[]): SearchResult[] {
  const results: SearchResult[] = [];
  const lowerQuery = query.toLowerCase();

  data.forEach((item, index) => {
    const text = JSON.stringify(item).toLowerCase();
    if (text.includes(lowerQuery)) {
      results.push({
        id: `result-${index}`,
        title: item.title || item.name || 'Result',
        description: item.description || '',
        type: item.type || 'note',
        timestamp: item.timestamp || new Date().toISOString(),
        relevance: text.split(lowerQuery).length - 1,
      });
    }
  });

  return results.sort((a, b) => b.relevance - a.relevance);
}

export function applyFilters(results: SearchResult[], filters: SearchFilter): SearchResult[] {
  return results.filter(result => {
    if (filters.type && result.type !== filters.type) return false;
    if (filters.priority && result.type !== filters.priority) return false;
    if (filters.dateRange) {
      const resultDate = new Date(result.timestamp);
      const startDate = new Date(filters.dateRange.start);
      const endDate = new Date(filters.dateRange.end);
      if (resultDate < startDate || resultDate > endDate) return false;
    }
    return true;
  });
}

export function getSearchHistory(): string[] {
  const history = localStorage.getItem('search-history');
  return history ? JSON.parse(history) : [];
}

export function addToSearchHistory(query: string): void {
  const history = getSearchHistory();
  history.unshift(query);
  localStorage.setItem('search-history', JSON.stringify(history.slice(0, 20)));
}

export function clearSearchHistory(): void {
  localStorage.removeItem('search-history');
}

export function getSavedSearches(): SavedSearch[] {
  const saved = localStorage.getItem('saved-searches');
  return saved ? JSON.parse(saved) : [];
}

export function saveSearch(name: string, query: string, filters: SearchFilter): SavedSearch {
  const search: SavedSearch = {
    id: Math.random().toString(36).substr(2, 9),
    name,
    query,
    filters,
    createdAt: new Date().toISOString(),
  };

  const saved = getSavedSearches();
  saved.push(search);
  localStorage.setItem('saved-searches', JSON.stringify(saved));

  return search;
}

export function deleteSavedSearch(searchId: string): void {
  const saved = getSavedSearches().filter(s => s.id !== searchId);
  localStorage.setItem('saved-searches', JSON.stringify(saved));
}

export function getSearchSuggestions(query: string): string[] {
  const suggestions = [
    'stress levels',
    'medication reminders',
    'device status',
    'recent alerts',
    'therapy notes',
  ];

  return suggestions.filter(s => s.toLowerCase().includes(query.toLowerCase()));
}
