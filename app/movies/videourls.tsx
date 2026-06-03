import Videoplayer from '@/components/Videoplayer';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Svg, { Circle, Line, Path, Polygon, Polyline } from 'react-native-svg';

// ─── SVG Icons ────────────────────────────────────────────────────────────────

type IconProps = { color?: string; size?: number };

const IconArrowLeft = ({ color = 'white', size = 22 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Line x1="19" y1="12" x2="5" y2="12" />
    <Polyline points="12 19 5 12 12 5" />
  </Svg>
);

const IconPlay = ({ color = 'rgb(21,21,21)', size = 16 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Polygon points="5,3 19,12 5,21" />
  </Svg>
);

const IconWifi = ({ color = 'rgb(132,142,156)', size = 40 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M5 12.55a11 11 0 0 1 14.08 0" />
    <Path d="M1.42 9a16 16 0 0 1 21.16 0" />
    <Path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
    <Line x1="12" y1="20" x2="12.01" y2="20" strokeWidth={3} />
  </Svg>
);

const IconAlertCircle = ({ color = '#FF6B6B', size = 40 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="10" />
    <Line x1="12" y1="8" x2="12" y2="12" />
    <Line x1="12" y1="16" x2="12.01" y2="16" strokeWidth={3} />
  </Svg>
);

const IconRefresh = ({ color = 'white', size = 18 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Polyline points="23 4 23 10 17 10" />
    <Path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
  </Svg>
);

const IconSignal = ({ color = 'rgb(183,189,198)', size = 14 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Line x1="1" y1="6" x2="1" y2="18" />
    <Line x1="6" y1="2" x2="6" y2="22" />
    <Line x1="11" y1="10" x2="11" y2="22" />
    <Line x1="16" y1="6" x2="16" y2="22" />
    <Line x1="21" y1="2" x2="21" y2="22" />
  </Svg>
);

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Pull a quality label from a stream object */
const getQualityLabel = (item: any, index: number): string => {
  if (item?.label) return item.label;
  if (item?.quality) return item.quality;
  return `Stream ${index + 1}`;
};

/** Try to extract a resolution hint from the label string */
const getResolutionBadge = (label: string): string | null => {
  const match = label.match(/\d{3,4}p/i);
  return match ? match[0].toUpperCase() : null;
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const StreamRow = ({
  item,
  index,
  isActive,
  onPress,
}: {
  item: any;
  index: number;
  isActive: boolean;
  onPress: () => void;
}) => {
  const label = getQualityLabel(item, index);
  const badge = getResolutionBadge(label);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        marginBottom: 10,
        borderRadius: 14,
        overflow: 'hidden',
        backgroundColor: isActive ? 'rgba(70,81,101,0.95)' : 'rgb(43,49,57)',
        borderWidth: 1,
        borderColor: isActive ? 'rgba(183,189,198,0.4)' : 'rgba(255,255,255,0.05)',
        paddingHorizontal: 16,
        paddingVertical: 14,
        gap: 12,
      }}
    >
      {/* Play icon bubble */}
      <View
        style={{
          width: 38,
          height: 38,
          borderRadius: 19,
          backgroundColor: isActive ? 'rgb(243,244,246)' : 'rgba(70,81,101,0.5)',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <IconPlay color={isActive ? 'rgb(21,21,21)' : 'white'} size={14} />
      </View>

      {/* Label */}
      <Text
        numberOfLines={1}
        style={{
          flex: 1,
          color: isActive ? 'white' : 'rgb(183,189,198)',
          fontSize: 14,
          fontWeight: isActive ? '600' : '400',
        }}
      >
        {label}
      </Text>

      {/* Resolution badge */}
      {badge && (
        <View
          style={{
            backgroundColor: isActive
              ? 'rgba(255,255,255,0.15)'
              : 'rgba(70,81,101,0.5)',
            borderRadius: 6,
            paddingHorizontal: 8,
            paddingVertical: 3,
          }}
        >
          <Text style={{ color: isActive ? 'white' : 'rgb(132,142,156)', fontSize: 11, fontWeight: '600' }}>
            {badge}
          </Text>
        </View>
      )}

      {/* Signal icon */}
      <IconSignal color={isActive ? 'rgb(183,189,198)' : 'rgb(71,77,87)'} />
    </TouchableOpacity>
  );
};

// ─── Empty / Error states ─────────────────────────────────────────────────────

const StateCard = ({
  icon,
  title,
  subtitle,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) => (
  <View style={{ alignItems: 'center', paddingTop: 80, gap: 14, paddingHorizontal: 40 }}>
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
      {icon}
    </View>
    <Text style={{ color: 'white', fontSize: 17, fontWeight: '700', textAlign: 'center' }}>
      {title}
    </Text>
    {subtitle && (
      <Text style={{ color: 'rgb(132,142,156)', fontSize: 13, textAlign: 'center', lineHeight: 20 }}>
        {subtitle}
      </Text>
    )}
    {action}
  </View>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const VideoUrls = () => {
  const { title } = useLocalSearchParams();
  const [showVideo, setShowVideo] = useState(false);
  const [foundLink, setFoundLink] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [payload, setPayload] = useState<any[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [showError, setShowError] = useState(false);

//   const baseUrl = 'http://192.168.100.12:3000';
    const baseUrl = 'http://172.20.10.3:3000';


  // Resolve full video URI whenever foundLink changes
  useEffect(() => {
    if (foundLink.length > 0) {
      const full = foundLink.startsWith('http') ? foundLink : `${baseUrl}${foundLink}`;
      setVideoUri(full);
    }
  }, [foundLink]);

  // Fetch on mount / title change
  useEffect(() => {
    fetchMovie();
  }, [title]);

  const movieData = async () => {
    const response = await fetch(`${baseUrl}/api/moviebox`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });
    return await response.json();
  };

  const fetchMovie = async () => {
    setShowError(false);
    setError(null);
    setPayload([]);
    setShowVideo(false);
    setActiveIndex(null);
    try {
      setLoading(true);
      const data = await movieData();
      if (data?.streams) setPayload(data.streams);
      if (data?.error) {
        setError(data.error);
        setShowError(true);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'An error occurred';
      setError(msg);
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectStream = (item: any, index: number) => {
    if (!item?.streamUrl) return;
    setActiveIndex(index);
    setFoundLink(item.streamUrl);
    setShowVideo(true);
  };

  const titleStr = Array.isArray(title) ? title[0] : title ?? 'Unknown';

  return (
    <View style={{ flex: 1, backgroundColor: 'rgba(21,21,21,1)' }}>
      {/* ── Video player (sits at top when active) ── */}
      {showVideo && videoUri && (
        <Videoplayer loading={loading} videoUri={videoUri} />
      )}

      {/* ── Header ── */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingTop: showVideo ? 12 : 60,
          paddingHorizontal: 16,
          paddingBottom: 12,
          gap: 12,
          borderBottomWidth: 1,
          borderBottomColor: 'rgba(255,255,255,0.06)',
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            backgroundColor: 'rgb(43,49,57)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <IconArrowLeft />
        </TouchableOpacity>

        <View style={{ flex: 1 }}>
          <Text
            numberOfLines={1}
            style={{ color: 'white', fontSize: 16, fontWeight: '700' }}
          >
            {titleStr}
          </Text>
          <Text style={{ color: 'rgb(132,142,156)', fontSize: 12, marginTop: 2 }}>
            {loading
              ? 'Searching for streams…'
              : showError
              ? 'No streams found'
              : `${payload.length} stream${payload.length !== 1 ? 's' : ''} available`}
          </Text>
        </View>

        {/* Retry button */}
        <TouchableOpacity
          onPress={fetchMovie}
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            backgroundColor: 'rgb(43,49,57)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <IconRefresh />
        </TouchableOpacity>
      </View>

      {/* ── Stream list ── */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 60, flexGrow: 1 }}
      >
        {/* Loading */}
        {loading && (
          <View style={{ alignItems: 'center', paddingTop: 80, gap: 16 }}>
            <ActivityIndicator size="large" color="rgb(183,189,198)" />
            <Text style={{ color: 'rgb(132,142,156)', fontSize: 14 }}>
              Finding available streams…
            </Text>
          </View>
        )}

        {/* Error */}
        {!loading && showError && (
          <StateCard
            icon={<IconAlertCircle />}
            title="No streams found"
            subtitle={error ?? 'Could not reach the server. Make sure your local server is running.'}
            action={
              <TouchableOpacity
                onPress={fetchMovie}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                  marginTop: 4,
                  backgroundColor: 'rgb(43,49,57)',
                  borderRadius: 12,
                  paddingHorizontal: 20,
                  paddingVertical: 12,
                }}
              >
                <IconRefresh />
                <Text style={{ color: 'white', fontWeight: '600' }}>Try again</Text>
              </TouchableOpacity>
            }
          />
        )}

        {/* No results (no error, no loading, empty) */}
        {!loading && !showError && payload.length === 0 && (
          <StateCard
            icon={<IconWifi />}
            title="No streams available"
            subtitle="Nothing was returned for this title. Try searching for a different version of the name."
          />
        )}

        {/* Stream rows */}
        {!loading && payload.length > 0 && (
          <>
            <Text
              style={{
                color: 'rgb(132,142,156)',
                fontSize: 11,
                fontWeight: '600',
                letterSpacing: 1.3,
                textTransform: 'uppercase',
                marginBottom: 12,
                paddingHorizontal: 16,
              }}
            >
              Available Streams
            </Text>
            {payload.map((item, index) => (
              <StreamRow
                key={index}
                item={item}
                index={index}
                isActive={activeIndex === index}
                onPress={() => handleSelectStream(item, index)}
              />
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default VideoUrls;