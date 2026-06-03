import { fetchMovieDetails } from '@/services/api';
import useFetch from '@/services/useFetch';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Circle, Line, Path, Polygon, Polyline, Rect } from 'react-native-svg';

// ─── SVG Icons ────────────────────────────────────────────────────────────────

type IconProps = { color?: string; size?: number };

const IconArrowLeft = ({ color = 'white', size = 22 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Line x1="19" y1="12" x2="5" y2="12" />
    <Polyline points="12 19 5 12 12 5" />
  </Svg>
);

const IconPlay = ({ color = 'white', size = 20 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Polygon points="5,3 19,12 5,21" />
  </Svg>
);

const IconStar = ({ color = '#FFD700', size = 14 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
  </Svg>
);

const IconClock = ({ color = 'rgb(183,189,198)', size = 13 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="10" />
    <Polyline points="12 6 12 12 16 14" />
  </Svg>
);

const IconCalendar = ({ color = 'rgb(183,189,198)', size = 13 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <Line x1="16" y1="2" x2="16" y2="6" />
    <Line x1="8" y1="2" x2="8" y2="6" />
    <Line x1="3" y1="10" x2="21" y2="10" />
  </Svg>
);

const IconFilm = ({ color = 'rgb(183,189,198)', size = 13 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
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

const IconTv = ({ color = 'rgb(183,189,198)', size = 13 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Rect x="2" y="7" width="20" height="15" rx="2" />
    <Polyline points="17 2 12 7 7 2" />
  </Svg>
);

const IconDollar = ({ color = 'rgb(183,189,198)', size = 13 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Line x1="12" y1="1" x2="12" y2="23" />
    <Path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </Svg>
);

const IconUsers = ({ color = 'rgb(183,189,198)', size = 13 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <Circle cx="9" cy="7" r="4" />
    <Path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <Path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </Svg>
);

// ─── Helpers ──────────────────────────────────────────────────────────────────

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─── Sub-components ───────────────────────────────────────────────────────────

/** A single labelled info row with a leading icon */
const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number | null | undefined;
}) => {
  if (!value && value !== 0) return null;
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.06)',
      }}
    >
      <View style={{ width: 18, alignItems: 'center' }}>{icon}</View>
      <Text style={{ color: 'rgb(132,142,156)', fontSize: 13, width: 100 }}>{label}</Text>
      <Text style={{ color: 'rgb(183,189,198)', fontSize: 13, flex: 1 }}>{value}</Text>
    </View>
  );
};

/** Genre pill */
const GenrePill = ({ name }: { name: string }) => (
  <View
    style={{
      backgroundColor: 'rgba(70,81,101,0.6)',
      borderRadius: 20,
      paddingHorizontal: 12,
      paddingVertical: 5,
      borderWidth: 1,
      borderColor: 'rgba(183,189,198,0.15)',
    }}
  >
    <Text style={{ color: 'rgb(183,189,198)', fontSize: 12 }}>{name}</Text>
  </View>
);

/** Skeleton pulse block */
const Skeleton = ({ width, height, borderRadius = 8 }: { width: number | string; height: number; borderRadius?: number }) => (
  <View
    style={{
      width: width as number,
      height,
      borderRadius,
      backgroundColor: 'rgb(43,49,57)',
    }}
  />
);

/** Full-page loading skeleton */
const LoadingSkeleton = () => (
  <View style={{ flex: 1, backgroundColor: 'rgba(21,21,21,1)' }}>
    <Skeleton width={SCREEN_WIDTH} height={300} borderRadius={0} />
    <View style={{ padding: 20, gap: 14 }}>
      <Skeleton width={220} height={26} />
      <Skeleton width={140} height={16} />
      <Skeleton width={100} height={32} borderRadius={8} />
      <View style={{ gap: 8, marginTop: 8 }}>
        <Skeleton width={'100%' as any} height={14} />
        <Skeleton width={'90%' as any} height={14} />
        <Skeleton width={'75%' as any} height={14} />
      </View>
    </View>
  </View>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const MovieDetails = () => {
  const router = useRouter();
  const { id, mediaType } = useLocalSearchParams();
  const isTV = mediaType === 'tv';

  const { data: movie, loading } = useFetch(() =>
    fetchMovieDetails(id as string, (mediaType as 'movie' | 'tv') ?? 'movie')
  );

  const title = movie?.title ?? movie?.name ?? '';
  const date = movie?.release_date ?? movie?.first_air_date;
  const year = date?.split('-')[0];

  const runtime = isTV
    ? movie?.episode_run_time?.[0]
      ? `${movie.episode_run_time[0]} min / ep`
      : null
    : movie?.runtime
    ? `${movie.runtime} min`
    : null;

  const rating = Math.round((movie?.vote_average ?? 0) * 10) / 10;
  const voteCount = movie?.vote_count?.toLocaleString();

  const genres: { id: number; name: string }[] = movie?.genres ?? [];

  if (loading) return <LoadingSkeleton />;

  return (
    <View style={{ flex: 1, backgroundColor: 'rgba(21,21,21,1)' }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Backdrop ── */}
        <View>
          <Image
            source={{ uri: `https://image.tmdb.org/t/p/w780${movie?.backdrop_path}` }}
            style={{ width: SCREEN_WIDTH, height: 300 }}
            resizeMode="cover"
          />
          {/* Fade backdrop into bg */}
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 120,
              backgroundColor: 'rgba(21,21,21,0)',
              // gradient simulation via layered views
            }}
          />
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 80,
              backgroundColor: 'rgba(21,21,21,0.7)',
            }}
          />
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 30,
              backgroundColor: 'rgba(21,21,21,1)',
            }}
          />
        </View>

        {/* ── Title block ── */}
        <View style={{ paddingHorizontal: 20, marginTop: -4 }}>
          {/* Media type badge */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              marginBottom: 8,
            }}
          >
            <View
              style={{
                backgroundColor: 'rgba(70,81,101,0.7)',
                borderRadius: 6,
                paddingHorizontal: 10,
                paddingVertical: 3,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 5,
              }}
            >
              {isTV
                ? <IconTv size={11} color="rgb(183,189,198)" />
                : <IconFilm size={11} color="rgb(183,189,198)" />}
              <Text style={{ color: 'rgb(183,189,198)', fontSize: 11, fontWeight: '600' }}>
                {isTV ? 'TV Series' : 'Movie'}
              </Text>
            </View>
          </View>

          <Text
            style={{
              color: 'white',
              fontSize: 26,
              fontWeight: '800',
              letterSpacing: 0.2,
              lineHeight: 32,
            }}
          >
            {title}
          </Text>

          {/* Year · runtime */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 8 }}>
            {year && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                <IconCalendar />
                <Text style={{ color: 'rgb(132,142,156)', fontSize: 13 }}>{year}</Text>
              </View>
            )}
            {runtime && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                <IconClock />
                <Text style={{ color: 'rgb(132,142,156)', fontSize: 13 }}>{runtime}</Text>
              </View>
            )}
          </View>

          {/* Rating bar */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              marginTop: 14,
              backgroundColor: 'rgb(43,49,57)',
              borderRadius: 10,
              paddingHorizontal: 14,
              paddingVertical: 10,
              alignSelf: 'flex-start',
            }}
          >
            <IconStar size={16} />
            <Text style={{ color: 'white', fontWeight: '700', fontSize: 15 }}>
              {rating}
              <Text style={{ color: 'rgb(132,142,156)', fontWeight: '400', fontSize: 13 }}>
                {' '}/10
              </Text>
            </Text>
            {voteCount && (
              <Text style={{ color: 'rgb(132,142,156)', fontSize: 12 }}>
                ({voteCount} votes)
              </Text>
            )}
          </View>

          {/* Genres */}
          {genres.length > 0 && (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 16 }}>
              {genres.map((g) => (
                <GenrePill key={g.id} name={g.name} />
              ))}
            </View>
          )}

          {/* Overview */}
          {movie?.overview ? (
            <View style={{ marginTop: 20 }}>
              <Text
                style={{
                  color: 'rgb(132,142,156)',
                  fontSize: 11,
                  fontWeight: '600',
                  letterSpacing: 1.3,
                  textTransform: 'uppercase',
                  marginBottom: 8,
                }}
              >
                Overview
              </Text>
              <Text
                style={{
                  color: 'rgb(183,189,198)',
                  fontSize: 14,
                  lineHeight: 22,
                }}
              >
                {movie.overview}
              </Text>
            </View>
          ) : null}

          {/* ── Details table ── */}
          <View
            style={{
              marginTop: 24,
              backgroundColor: 'rgb(43,49,57)',
              borderRadius: 14,
              paddingHorizontal: 16,
              paddingTop: 4,
            }}
          >
            {/* Movie-only */}
            {!isTV && (
              <>
                <InfoRow
                  icon={<IconDollar />}
                  label="Budget"
                  value={
                    movie?.budget
                      ? `$${(movie.budget / 1_000_000).toFixed(1)}M`
                      : 'N/A'
                  }
                />
                <InfoRow
                  icon={<IconDollar />}
                  label="Revenue"
                  value={
                    movie?.revenue
                      ? `$${(movie.revenue / 1_000_000).toFixed(1)}M`
                      : 'N/A'
                  }
                />
              </>
            )}

            {/* TV-only */}
            {isTV && (
              <>
                <InfoRow
                  icon={<IconTv />}
                  label="Seasons"
                  value={movie?.number_of_seasons ?? 'N/A'}
                />
                <InfoRow
                  icon={<IconFilm />}
                  label="Episodes"
                  value={movie?.number_of_episodes ?? 'N/A'}
                />
                <InfoRow
                  icon={<IconCalendar />}
                  label="Last Air Date"
                  value={movie?.last_air_date ?? 'N/A'}
                />
              </>
            )}

            <InfoRow
              icon={<IconUsers />}
              label="Production"
              value={
                movie?.production_companies?.map((c: any) => c.name).join(', ') ||
                'N/A'
              }
            />
            <InfoRow
              icon={<IconFilm />}
              label="Language"
              value={movie?.original_language?.toUpperCase() ?? 'N/A'}
            />
          </View>
        </View>
      </ScrollView>

      {/* ── Back button (floating) ── */}
      <TouchableOpacity
        onPress={() => router.back()}
        style={{
          position: 'absolute',
          top: 60,
          left: 16,
          width: 44,
          height: 44,
          borderRadius: 12,
          backgroundColor: 'rgba(0,0,0,0.55)',
          justifyContent: 'center',
          alignItems: 'center',
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.1)',
        }}
      >
        <IconArrowLeft />
      </TouchableOpacity>

      {/* ── Fixed Play button ── */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          paddingHorizontal: 20,
          paddingBottom: 36,
          paddingTop: 16,
          backgroundColor: 'rgba(21,21,21,0.95)',
          borderTopWidth: 1,
          borderTopColor: 'rgba(255,255,255,0.06)',
        }}
      >
        <TouchableOpacity
          onPress={() =>
            router.push({ pathname: '/movies/videourls', params: { title } })
          }
          style={{
            backgroundColor: 'rgb(243,244,246)',
            borderRadius: 14,
            height: 56,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <IconPlay color="rgb(21,21,21)" size={18} />
          <Text style={{ color: 'rgb(21,21,21)', fontWeight: '700', fontSize: 16 }}>
            Play Now
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MovieDetails;