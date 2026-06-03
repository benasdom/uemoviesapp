import { icons } from '@/constants/icons';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import SliderItem, { ITEM_WIDTH } from './slideritem';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SIDE_PADDING = (SCREEN_WIDTH - ITEM_WIDTH) / 2;
const GAP = 14;
const STEP = ITEM_WIDTH + GAP; // distance per card including gap

interface SliderProps {
  movies: Movie[] | null | undefined;
  mediaType?: 'movie' | 'tv';
}

const Slider = ({ movies, mediaType = 'movie' }: SliderProps) => {
  const router = useRouter();
  const flatListRef = useRef<any>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [activeIndex, setActiveIndex] = useState(0); // index within original movies[]
  const isJumping = useRef(false); // prevents onScroll firing during silent jump

  if (!movies || movies.length === 0) return null;

  const count = movies.length;

  // Triple the data: [copy0 | copy1 (start here) | copy2]
  const loopedData: Movie[] = [...movies, ...movies, ...movies];
  const startOffset = count * STEP; // scroll offset for the middle copy

  // Jump to middle copy silently on mount
  useEffect(() => {
    requestAnimationFrame(() => {
      flatListRef.current?.scrollToOffset({ offset: startOffset, animated: false });
    });
  }, [startOffset]);

  // After every scroll settle, silently warp to the equivalent position in the middle copy
  const handleScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const x = e.nativeEvent.contentOffset.x;
      const rawIndex = Math.round(x / STEP);

      // Warp to middle copy if we're in the first or last copy
      if (rawIndex < count || rawIndex >= count * 2) {
        const wrappedIndex = ((rawIndex % count) + count) % count;
        const targetOffset = (wrappedIndex + count) * STEP;
        isJumping.current = true;
        flatListRef.current?.scrollToOffset({ offset: targetOffset, animated: false });
        // Let the next frame clear the lock
        requestAnimationFrame(() => { isJumping.current = false; });
      }
    },
    [count]
  );

  // Track active real index from scroll position
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    {
      useNativeDriver: true,
      listener: (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        if (isJumping.current) return;
        const x = e.nativeEvent.contentOffset.x;
        const rawIndex = Math.round(x / STEP);
        const realIndex = ((rawIndex % count) + count) % count;
        setActiveIndex(realIndex);
      },
    }
  );

  const activeMovie = movies[activeIndex];
  const title = activeMovie?.title ?? '';
  const genreDisplay = mediaType === 'tv' ? 'TV Series' : 'Movie';

  return (
    <View style={{ paddingBottom: 16 }}>
      {/* ── Card strip ── */}
      <Animated.FlatList
        ref={flatListRef}
        data={loopedData}
        horizontal
        pagingEnabled={false}
        snapToInterval={STEP}
        snapToAlignment="start"
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: SIDE_PADDING,
          gap: GAP,
          alignItems: 'center',
          paddingVertical: 20,
        }}
        // Key by looped index so React doesn't confuse duplicate ids
        keyExtractor={(_item: Movie, index: number) => `loop-${index}`}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onMomentumScrollEnd={handleScrollEnd}
        getItemLayout={(_: any, index: number) => ({
          length: STEP,
          offset: STEP * index,
          index,
        })}
        renderItem={({ item, index }: { item: Movie; index: number }) => {
          // Map looped index back to a 0-based position for the scale interpolation
          const positionInLoop = index - count; // relative to middle copy start
          return (
            <TouchableOpacity
              activeOpacity={0.92}
              onPress={() =>
                router.push({
                  pathname: '/movies/[id]',
                  params: { id: item.id, mediaType },
                })
              }
            >
              <SliderItem
                item={item}
                scrollX={scrollX}
                index={index}
                step={STEP}
              />
            </TouchableOpacity>
          );
        }}
      />

      {/* ── Dot indicators (real count only) ── */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          gap: 6,
          marginTop: 4,
          marginBottom: 10,
        }}
      >
        {movies.slice(0, 10).map((_, i) => (
          <View
            key={i}
            style={{
              width: i === activeIndex ? 20 : 6,
              height: 6,
              borderRadius: 3,
              backgroundColor:
                i === activeIndex
                  ? 'rgba(183,189,198,0.9)'
                  : 'rgba(183,189,198,0.25)',
            }}
          />
        ))}
      </View>

      {/* ── Dynamic title + rating ── */}
      <View style={{ alignItems: 'center', paddingHorizontal: 24, gap: 4 }}>
        <Text
          numberOfLines={1}
          style={{
            color: 'white',
            fontSize: 22,
            fontWeight: '800',
            textAlign: 'center',
            letterSpacing: 0.3,
          }}
        >
          {title}
        </Text>
        <Text style={{ color: 'rgb(183,189,198)', fontSize: 13, textAlign: 'center' }}>
          {genreDisplay}
          {activeMovie?.vote_average
            ? `  ·  ★ ${activeMovie.vote_average.toFixed(1)}`
            : ''}
        </Text>
      </View>

      {/* ── Action row ── */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
          marginTop: 16,
          paddingHorizontal: 20,
        }}
      >
        <TouchableOpacity
          style={{ alignItems: 'center', gap: 4 }}
          onPress={() =>
            router.push({
              pathname: '/movies/[id]',
              params: { id: activeMovie?.id, mediaType },
            })
          }
        >
          <Image style={{ width: 24, height: 24 }} tintColor="rgb(183,189,198)" source={icons.info} />
          <Text style={{ color: 'rgb(183,189,198)', fontSize: 12 }}>Detail</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            backgroundColor: 'rgb(243,244,246)',
            width: 190,
            height: 56,
            borderRadius: 14,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() =>
            router.push({ pathname: '/movies/videourls', params: { title } })
          }
        >
          <Text style={{ fontWeight: '700', fontSize: 16, color: 'rgb(21,21,21)' }}>
            Watch Now
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={{ alignItems: 'center', gap: 4 }}>
          <Image style={{ width: 24, height: 24 }} tintColor="rgb(183,189,198)" source={icons.calender} />
          <Text style={{ color: 'rgb(183,189,198)', fontSize: 12 }}>Add List</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Slider;