import MovieCard from '@/components/moviecard';
import SearchComponent from '@/components/searchcomponent';
import { fetchMovies, fetchTVShows } from '@/services/api';
import useFetch from '@/services/useFetch';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Svg, { Circle, Line, Polyline, Rect } from 'react-native-svg';

// ─── SVG Icons ────────────────────────────────────────────────────────────────

type IconProps = { color?: string; size?: number };

const IconSearch = ({ color = 'rgb(132,142,156)', size = 48 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="11" cy="11" r="8" />
    <Line x1="21" y1="21" x2="16.65" y2="16.65" />
  </Svg>
);

const IconFilm = ({ color = 'rgb(132,142,156)', size = 40 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <Rect x="2" y="2" width="20" height="20" rx="2" />
    <Line x1="7" y1="2" x2="7" y2="22" />
    <Line x1="17" y1="2" x2="17" y2="22" />
    <Line x1="2" y1="12" x2="22" y2="12" />
    <Line x1="2" y1="7" x2="7" y2="7" />
    <Line x1="2" y1="17" x2="7" y2="17" />
    <Line x1="17" y1="17" x2="22" y2="17" />
    <Line x1="17" y1="7" x2="22" y2="7" />
  </Svg>
);

const IconTv = ({ color = 'rgb(132,142,156)', size = 40 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <Rect x="2" y="7" width="20" height="15" rx="2" />
    <Polyline points="17 2 12 7 7 2" />
  </Svg>
);

const IconAlertCircle = ({ color = '#FF6B6B', size = 16 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="10" />
    <Line x1="12" y1="8" x2="12" y2="12" />
    <Line x1="12" y1="16" x2="12.01" y2="16" />
  </Svg>
);

// ─── Types ────────────────────────────────────────────────────────────────────

type MediaTab = 'movie' | 'tv';

// ─── Empty state ──────────────────────────────────────────────────────────────

const EmptyState = ({ query, mediaTab }: { query: string; mediaTab: MediaTab }) => {
  const hasQuery = query.trim().length > 0;
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 60, gap: 14 }}>
      <View
        style={{
          width: 88,
          height: 88,
          borderRadius: 44,
          backgroundColor: 'rgb(43,49,57)',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {hasQuery
          ? mediaTab === 'tv' ? <IconTv /> : <IconFilm />
          : <IconSearch />}
      </View>
      <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
        {hasQuery ? 'No results found' : `Search ${mediaTab === 'tv' ? 'TV shows' : 'movies'}`}
      </Text>
      <Text
        style={{
          color: 'rgb(132,142,156)',
          fontSize: 13,
          textAlign: 'center',
          paddingHorizontal: 48,
          lineHeight: 20,
        }}
      >
        {hasQuery
          ? `Nothing matched "${query}". Try a different title.`
          : `Type a title above to find ${mediaTab === 'tv' ? 'TV shows' : 'movies'}.`}
      </Text>
    </View>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [mediaTab, setMediaTab] = useState<MediaTab>('movie');

  // Two separate fetch hooks — one per media type
  const {
    data: movieResults,
    loading: movieLoading,
    refetch: loadMovies,
    reset: resetMovies,
    error: movieError,
  } = useFetch(() => fetchMovies({ query: searchQuery }), false);

  const {
    data: tvResults,
    loading: tvLoading,
    refetch: loadTV,
    reset: resetTV,
    error: tvError,
  } = useFetch(() => fetchTVShows({ query: searchQuery }), false);

  // Debounced search — fires when query or tab changes
  useEffect(() => {
    const id = setTimeout(async () => {
      if (searchQuery.trim()) {
        if (mediaTab === 'movie') await loadMovies();
        else await loadTV();
      } else {
        resetMovies();
        resetTV();
      }
    }, 500);
    return () => clearTimeout(id);
  }, [searchQuery, mediaTab]);

  // Active data based on selected tab
  const results = mediaTab === 'movie' ? movieResults : tvResults;
  const loading  = mediaTab === 'movie' ? movieLoading  : tvLoading;
  const error    = mediaTab === 'movie' ? movieError    : tvError;
  const resultCount = results?.length ?? 0;

  return (
    <View style={{ flex: 1, backgroundColor: 'rgba(21,21,21,1)' }}>
      {/* ── Header ── */}
      <View style={{ paddingTop: 60, paddingHorizontal: 16, paddingBottom: 4 }}>
        <Text style={{ color: 'white', fontSize: 26, fontWeight: '700', letterSpacing: 0.5, marginBottom: 14 }}>
          Discover
        </Text>
        <SearchComponent
          placeholder={`Search ${mediaTab === 'tv' ? 'TV shows' : 'movies'}…`}
          value={searchQuery}
          onChangeText={(text: string) => setSearchQuery(text)}
        />
      </View>

      {/* ── Media type toggle ── */}
      <View
        style={{
          flexDirection: 'row',
          marginHorizontal: 16,
          marginTop: 12,
          marginBottom: 4,
          backgroundColor: 'rgb(43,49,57)',
          borderRadius: 10,
          padding: 3,
        }}
      >
        {(['movie', 'tv'] as MediaTab[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setMediaTab(tab)}
            style={{
              flex: 1,
              paddingVertical: 8,
              borderRadius: 8,
              alignItems: 'center',
              backgroundColor: mediaTab === tab ? 'rgba(70,81,101,0.844)' : 'transparent',
            }}
          >
            <Text
              style={{
                color: mediaTab === tab ? 'white' : 'rgb(132,142,156)',
                fontSize: 13,
                fontWeight: mediaTab === tab ? '600' : '400',
              }}
            >
              {tab === 'movie' ? 'Movies' : 'TV Shows'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── Status bar ── */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 8, minHeight: 32 }}>
        {loading && <ActivityIndicator size="small" color="rgb(183,189,198)" />}

        {!loading && error && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <IconAlertCircle />
            <Text style={{ color: '#FF6B6B', fontSize: 13 }}>
              {error.message ?? 'Something went wrong'}
            </Text>
          </View>
        )}

        {!loading && !error && searchQuery.trim() && resultCount > 0 && (
          <Text style={{ color: 'rgb(132,142,156)', fontSize: 13 }}>
            {resultCount} result{resultCount !== 1 ? 's' : ''} for{' '}
            <Text style={{ color: 'rgb(183,189,198)', fontWeight: '600' }}>
              "{searchQuery}"
            </Text>
          </Text>
        )}
      </View>

      {/* ── Results grid ── */}
      <FlatList
        data={results}
        numColumns={3}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => (item?.id?.toString() ?? index.toString())}
        contentContainerStyle={{
          paddingHorizontal: 10,
          gap: 10,
          paddingBottom: 120,
          flexGrow: 1,
        }}
        columnWrapperStyle={{ gap: 8, justifyContent: 'flex-start' }}
        renderItem={({ item }) => <MovieCard {...item} mediaType={mediaTab} />}
        ListEmptyComponent={
          !loading ? <EmptyState query={searchQuery} mediaTab={mediaTab} /> : null
        }
      />
    </View>
  );
};

export default Search;