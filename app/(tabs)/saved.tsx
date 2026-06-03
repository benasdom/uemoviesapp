import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Path, Polygon, Line } from 'react-native-svg';

// ─── SVG Icon components ──────────────────────────────────────────────────────

const IconBookmark = ({ color = 'white', size = 18 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </Svg>
);

const IconStar = ({ color = '#FFD700', size = 12 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
  </Svg>
);

const IconFilm = ({ color = 'white', size = 40 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </Svg>
);

// ─── Types ────────────────────────────────────────────────────────────────────
interface SavedItem {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  mediaType: 'movie' | 'tv';
}

// ─── Mock data – replace with your AsyncStorage / context store ──────────────
const MOCK_SAVED: SavedItem[] = [
  {
    id: 1,
    title: 'Dune: Part Two',
    poster_path: '/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
    vote_average: 8.4,
    release_date: '2024-03-01',
    mediaType: 'movie',
  },
  {
    id: 2,
    name: 'Shōgun',
    poster_path: '/7O4iVfOMQmdCSXhDI8QRF7BDeFr.jpg',
    vote_average: 8.9,
    first_air_date: '2024-02-27',
    mediaType: 'tv',
  },
  {
    id: 3,
    title: 'Oppenheimer',
    poster_path: '/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
    vote_average: 8.1,
    release_date: '2023-07-21',
    mediaType: 'movie',
  },
  {
    id: 4,
    name: 'The Bear',
    poster_path: '/sHFlbKS3WLqMnp9t2ghADIJFnuQ.jpg',
    vote_average: 8.5,
    first_air_date: '2022-06-23',
    mediaType: 'tv',
  },
  {
    id: 5,
    title: 'Poor Things',
    poster_path: '/kCGlIMHnOm8JPXq3rXM6c5wMxcT.jpg',
    vote_average: 7.8,
    release_date: '2023-12-08',
    mediaType: 'movie',
  },
  {
    id: 6,
    name: 'Fallout',
    poster_path: '/AnsSKR9RJ3GFxv4PoJuNSgLvAIV.jpg',
    vote_average: 8.3,
    first_air_date: '2024-04-10',
    mediaType: 'tv',
  },
];

// ─── Constants ────────────────────────────────────────────────────────────────
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - 48) / 2;

type FilterTab = 'All' | 'Movies' | 'TV Shows';
const TABS: FilterTab[] = ['All', 'Movies', 'TV Shows'];

// ─── SavedCard ────────────────────────────────────────────────────────────────
const SavedCard = ({
  item,
  onPress,
  onRemove,
}: {
  item: SavedItem;
  onPress: () => void;
  onRemove: () => void;
}) => {
  const title = item.title ?? item.name ?? 'Unknown';
  const year = (item.release_date ?? item.first_air_date ?? '').split('-')[0];

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={{ width: CARD_WIDTH, marginBottom: 16 }}
    >
      <View style={{ borderRadius: 12, overflow: 'hidden', position: 'relative' }}>
        <Image
          source={{
            uri: item.poster_path
              ? `https://image.tmdb.org/t/p/w342${item.poster_path}`
              : 'https://via.placeholder.com/342x513?text=No+Image',
          }}
          style={{ width: CARD_WIDTH, height: CARD_WIDTH * 1.5 }}
          resizeMode="cover"
        />

        {/* Bottom gradient overlay */}
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 80,
            backgroundColor: 'rgba(21,21,21,0.6)',
          }}
        />

        {/* Media type badge */}
        <View
          style={{
            position: 'absolute',
            top: 8,
            left: 8,
            backgroundColor:
              item.mediaType === 'tv' ? 'rgba(70,81,101,0.9)' : 'rgba(0,0,0,0.75)',
            borderRadius: 6,
            paddingHorizontal: 8,
            paddingVertical: 3,
          }}
        >
          <Text style={{ color: 'rgb(183,189,198)', fontSize: 10, fontWeight: '600' }}>
            {item.mediaType === 'tv' ? 'TV' : 'FILM'}
          </Text>
        </View>

        {/* Remove bookmark button */}
        <TouchableOpacity
          onPress={onRemove}
          activeOpacity={0.8}
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            backgroundColor: 'rgba(0,0,0,0.6)',
            borderRadius: 20,
            width: 30,
            height: 30,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <IconBookmark color="rgb(183,189,198)" size={16} />
        </TouchableOpacity>

        {/* Rating chip */}
        <View
          style={{
            position: 'absolute',
            bottom: 8,
            right: 8,
            backgroundColor: 'rgb(71,77,87)',
            borderRadius: 6,
            paddingHorizontal: 7,
            paddingVertical: 3,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <IconStar size={11} />
          <Text style={{ color: 'white', fontSize: 11, fontWeight: '700' }}>
            {Math.round(item.vote_average)}/10
          </Text>
        </View>
      </View>

      <Text
        numberOfLines={1}
        style={{ color: 'white', fontSize: 13, fontWeight: '600', marginTop: 8 }}
      >
        {title}
      </Text>
      <Text style={{ color: 'rgb(132,142,156)', fontSize: 11, marginTop: 2 }}>
        {year}
      </Text>
    </TouchableOpacity>
  );
};

// ─── Empty State ──────────────────────────────────────────────────────────────
const EmptyState = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 14 }}>
    <View
      style={{
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: 'rgb(43,49,57)',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <IconFilm color="rgb(132,142,156)" size={36} />
    </View>
    <Text style={{ color: 'white', fontSize: 18, fontWeight: '600' }}>
      Nothing saved yet
    </Text>
    <Text
      style={{
        color: 'rgb(132,142,156)',
        fontSize: 14,
        textAlign: 'center',
        paddingHorizontal: 40,
      }}
    >
      Tap the bookmark icon on any title to add it here.
    </Text>
  </View>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const Saved = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<FilterTab>('All');
  const [saved, setSaved] = useState<SavedItem[]>(MOCK_SAVED);

  const filtered = saved.filter((item) => {
    if (activeTab === 'Movies') return item.mediaType === 'movie';
    if (activeTab === 'TV Shows') return item.mediaType === 'tv';
    return true;
  });

  const handleRemove = (id: number) =>
    setSaved((prev) => prev.filter((item) => item.id !== id));

  const handlePress = (item: SavedItem) =>
    router.push({
      pathname: '/movies/[id]',
      params: { id: item.id, mediaType: item.mediaType },
    });

  return (
    <View style={{ flex: 1, backgroundColor: 'rgba(21,21,21,1)' }}>
      {/* Header */}
      <View style={{ paddingTop: 60, paddingHorizontal: 16, paddingBottom: 8 }}>
        <Text style={{ color: 'white', fontSize: 26, fontWeight: '700', letterSpacing: 0.5 }}>
          My Watchlist
        </Text>
        <Text style={{ color: 'rgb(132,142,156)', fontSize: 13, marginTop: 4 }}>
          {saved.length} {saved.length === 1 ? 'title' : 'titles'} saved
        </Text>
      </View>

      {/* Filter tabs */}
      <View style={{ flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 12, gap: 8 }}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 20,
              backgroundColor:
                activeTab === tab ? 'rgba(70,81,101,0.844)' : 'rgba(43,49,57,0.8)',
            }}
          >
            <Text
              style={{
                color: activeTab === tab ? 'white' : 'rgb(132,142,156)',
                fontSize: 13,
                fontWeight: activeTab === tab ? '600' : '400',
              }}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Grid or empty state */}
      {filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => `${item.mediaType}-${item.id}`}
          numColumns={2}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
          columnWrapperStyle={{ gap: 16 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <SavedCard
              item={item}
              onPress={() => handlePress(item)}
              onRemove={() => handleRemove(item.id)}
            />
          )}
        />
      )}
    </View>
  );
};

export default Saved;