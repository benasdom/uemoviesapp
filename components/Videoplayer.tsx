import { useEventListener } from 'expo';
import { router } from 'expo-router';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useVideoPlayer, VideoView } from 'expo-video';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Animated,
    Dimensions,
    GestureResponderEvent,
    LayoutChangeEvent,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import Svg, {
    Circle,
    Line,
    Polygon,
    Polyline,
    Rect
} from 'react-native-svg';

// ─── Design tokens ─────────────────────────────────────────────────────────────

const C = {
  bg:         'rgb(8, 8, 12)',
  surface:    'rgba(18, 18, 26, 0.95)',
  surfaceMid: 'rgba(30, 30, 44, 0.88)',
  accent:     'rgb(130, 110, 255)',
  accentSoft: 'rgba(130, 110, 255, 0.18)',
  white:      'rgb(255, 255, 255)',
  muted:      'rgba(180, 180, 210, 0.65)',
  dimmed:     'rgba(255, 255, 255, 0.10)',
  track:      'rgba(255, 255, 255, 0.18)',
  trackFill:  'rgb(130, 110, 255)',
};

// ─── SVG Icons ─────────────────────────────────────────────────────────────────

type IP = { color?: string; size?: number };

const IcoArrowLeft = ({ color = C.white, size = 20 }: IP) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <Line x1="19" y1="12" x2="5" y2="12" />
    <Polyline points="12 19 5 12 12 5" />
  </Svg>
);

const IcoPlay = ({ color = C.white, size = 28 }: IP) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Polygon points="6,3 20,12 6,21" />
  </Svg>
);

const IcoPause = ({ color = C.white, size = 28 }: IP) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Rect x="5" y="3" width="4" height="18" rx="1" />
    <Rect x="15" y="3" width="4" height="18" rx="1" />
  </Svg>
);

const IcoForward = ({ color = C.white, size = 22 }: IP) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <Polygon points="5,4 15,12 5,20" fill={color} stroke="none" />
    <Line x1="19" y1="4" x2="19" y2="20" />
  </Svg>
);

const IcoRewind = ({ color = C.white, size = 22 }: IP) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <Polygon points="19,4 9,12 19,20" fill={color} stroke="none" />
    <Line x1="5" y1="4" x2="5" y2="20" />
  </Svg>
);

const IcoMaximize = ({ color = C.white, size = 18 }: IP) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <Polyline points="15 3 21 3 21 9" />
    <Polyline points="9 21 3 21 3 15" />
    <Line x1="21" y1="3" x2="14" y2="10" />
    <Line x1="3" y1="21" x2="10" y2="14" />
  </Svg>
);

const IcoMinimize = ({ color = C.white, size = 18 }: IP) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <Polyline points="4 14 10 14 10 20" />
    <Polyline points="20 10 14 10 14 4" />
    <Line x1="10" y1="14" x2="3" y2="21" />
    <Line x1="21" y1="3" x2="14" y2="10" />
  </Svg>
);

const IcoAlertCircle = ({ color = '#FF6B6B', size = 36 }: IP) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="10" />
    <Line x1="12" y1="8" x2="12" y2="12" />
    <Line x1="12" y1="16" x2="12.01" y2="16" strokeWidth={3} />
  </Svg>
);

// ─── Helpers ───────────────────────────────────────────────────────────────────

const formatTime = (secs: number): string => {
  if (!isFinite(secs) || secs < 0) return '0:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
};

// ─── Control button ────────────────────────────────────────────────────────────

const ControlBtn = ({
  onPress,
  children,
  size = 44,
  circle = false,
  accent = false,
}: {
  onPress: () => void;
  children: React.ReactNode;
  size?: number;
  circle?: boolean;
  accent?: boolean;
}) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.7}
    style={{
      width: size,
      height: size,
      borderRadius: circle ? size / 2 : 12,
      backgroundColor: accent ? C.accentSoft : C.surfaceMid,
      borderWidth: accent ? 1 : 0.5,
      borderColor: accent ? C.accent : C.dimmed,
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    {children}
  </TouchableOpacity>
);

// ─── Seek bar ──────────────────────────────────────────────────────────────────

const SeekBar = ({
  progress,       // 0–1
  onSeek,
}: {
  progress: number;
  onSeek: (ratio: number) => void;
}) => {
  const barRef = useRef<View>(null);
  const [barWidth, setBarWidth] = useState(1);

  const clamp = (v: number) => Math.max(0, Math.min(1, v));

  const getRatio = (evt: GestureResponderEvent) => {
    const x = evt.nativeEvent.locationX;
    return clamp(x / barWidth);
  };

  return (
    <View
      ref={barRef}
      onLayout={(e: LayoutChangeEvent) => setBarWidth(e.nativeEvent.layout.width || 1)}
      style={styles.seekHitArea}
      onStartShouldSetResponder={() => true}
      onMoveShouldSetResponder={() => true}
      onResponderGrant={(e) => onSeek(getRatio(e))}
      onResponderMove={(e) => onSeek(getRatio(e))}
    >
      {/* Track background */}
      <View style={styles.seekTrack}>
        {/* Fill */}
        <View style={[styles.seekFill, { width: `${clamp(progress) * 100}%` }]} />
        {/* Thumb */}
        <View style={[styles.seekThumb, { left: `${clamp(progress) * 100}%` }]} />
      </View>
    </View>
  );
};

// ─── Loader / Error overlays ───────────────────────────────────────────────────

const LoaderOverlay = ({ label }: { label?: string }) => (
  <View style={styles.fillCenter}>
    <View style={styles.loaderCard}>
      <ActivityIndicator size="large" color={C.accent} />
      {label && <Text style={styles.loaderLabel}>{label}</Text>}
    </View>
  </View>
);

const ErrorOverlay = () => (
  <View style={styles.fillCenter}>
    <View style={styles.loaderCard}>
      <IcoAlertCircle />
      <Text style={[styles.loaderLabel, { color: C.white, marginTop: 8 }]}>Playback failed</Text>
      <Text style={[styles.loaderLabel, { fontSize: 12, opacity: 0.5 }]}>
        Try another stream
      </Text>
    </View>
  </View>
);

// ─── Main ──────────────────────────────────────────────────────────────────────

interface VideoplayerProps {
  loading?: boolean;
  videoUri: string;
  title?: string;
}

const Videoplayer = ({ loading = false, videoUri, title }: VideoplayerProps) => {
  const player = useVideoPlayer(videoUri || '');

  const [isBuffering, setIsBuffering]       = useState(true);
  const [isPlaying, setIsPlaying]           = useState(false);
  const [isLandscape, setIsLandscape]       = useState(false);
  const [hasError, setHasError]             = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [currentTime, setCurrentTime]       = useState(0);
  const [duration, setDuration]             = useState(0);

  const controlsOpacity = useRef(new Animated.Value(1)).current;
  const controlsTimer   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressTimer   = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Orientation cleanup ────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (controlsTimer.current) clearTimeout(controlsTimer.current);
      if (progressTimer.current) clearInterval(progressTimer.current);
      ScreenOrientation.unlockAsync().catch(() => {});
    };
  }, []);

  // ── Poll current time ──────────────────────────────────────────────────────
  useEffect(() => {
    progressTimer.current = setInterval(() => {
      try {
        const ct = player.currentTime ?? 0;
        const dur = player.duration ?? 0;
        setCurrentTime(ct);
        if (dur > 0) setDuration(dur);
      } catch {}
    }, 500);
    return () => {
      if (progressTimer.current) clearInterval(progressTimer.current);
    };
  }, [player]);

  // ── Player events ──────────────────────────────────────────────────────────
  useEventListener(player, 'statusChange', ({ status }) => {
    if (status === 'readyToPlay') {
      setIsBuffering(false);
      setHasError(false);
      player.play();
      setIsPlaying(true);
    } else if (status === 'error') {
      setIsBuffering(false);
      setHasError(true);
    }
  });

  useEventListener(player, 'playingChange', ({ isPlaying: p }) => {
    setIsPlaying(p);
  });

  // ── Controls fade ──────────────────────────────────────────────────────────
  const scheduleHide = useCallback(() => {
    if (controlsTimer.current) clearTimeout(controlsTimer.current);
    controlsTimer.current = setTimeout(() => {
      Animated.timing(controlsOpacity, { toValue: 0, duration: 400, useNativeDriver: true }).start(
        () => setControlsVisible(false)
      );
    }, 3500);
  }, [controlsOpacity]);

  const revealControls = useCallback(() => {
    if (controlsTimer.current) clearTimeout(controlsTimer.current);
    Animated.timing(controlsOpacity, { toValue: 1, duration: 180, useNativeDriver: true }).start();
    setControlsVisible(true);
    scheduleHide();
  }, [controlsOpacity, scheduleHide]);

  useEffect(() => { revealControls(); }, []);

  // ── Actions ────────────────────────────────────────────────────────────────
  const togglePlayPause = () => {
    isPlaying ? player.pause() : player.play();
    revealControls();
  };

  const seek = (ratio: number) => {
    if (duration > 0) {
      player.currentTime = ratio * duration;
      setCurrentTime(ratio * duration);
    }
    revealControls();
  };

  const skipBy = (secs: number) => {
    const next = Math.max(0, Math.min(duration, currentTime + secs));
    player.currentTime = next;
    setCurrentTime(next);
    revealControls();
  };

  const toggleOrientation = async () => {
    try {
      if (isLandscape) {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
        setIsLandscape(false);
      } else {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
        setIsLandscape(true);
      }
    } catch (e) {
      console.warn('Orientation error:', e);
    }
    revealControls();
  };

  // ── Dimensions — centred for both orientations ─────────────────────────────
  const screen   = Dimensions.get('window');
  const scrW     = screen.width;
  const scrH     = screen.height;

  // In portrait the player sits embedded in the list; in landscape it fills the screen
  const vidW = isLandscape ? Math.max(scrW, scrH) : scrW;
  const vidH = isLandscape ? Math.min(scrW, scrH) : scrW * (9 / 16);

  const progress = duration > 0 ? currentTime / duration : 0;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <View style={[
      styles.root,
      {
        width: vidW,
        height: vidH,
        marginTop:isLandscape?0:60,
        alignSelf: 'center',
      },
    ]}>
      <TouchableWithoutFeedback onPress={revealControls}>
        <View style={{ width: vidW, height: vidH }}>

          {/* Video */}
          {!loading && videoUri && (
            <VideoView
              key={videoUri}
              player={player}
              allowsFullscreen={false}
              allowsPictureInPicture
              style={[styles.video, { width: vidW, height: vidH }]}
            />
          )}

          {/* Buffering */}
          {(loading || isBuffering) && !hasError && (
            <LoaderOverlay label={loading ? 'Loading stream…' : 'Buffering…'} />
          )}

          {/* Error */}
          {hasError && <ErrorOverlay />}

          {/* ── Overlay controls (fade in/out) ─────────────────────────── */}
          <Animated.View
            pointerEvents={controlsVisible ? 'auto' : 'none'}
            style={[StyleSheet.absoluteFill, { opacity: controlsOpacity }]}
          >
            {/* Scrim top */}
            <View style={styles.scrimTop} />
            {/* Scrim bottom */}
            <View style={styles.scrimBottom} />

            {/* ── Top bar ── */}
            <View style={styles.topBar}>
              <ControlBtn onPress={() => router.back()}>
                <IcoArrowLeft />
              </ControlBtn>

              {title ? (
                <Text style={styles.titleText} numberOfLines={1}>
                  {title}
                </Text>
              ) : <View style={{ flex: 1 }} />}

              <ControlBtn onPress={toggleOrientation}>
                {isLandscape ? <IcoMinimize /> : <IcoMaximize />}
              </ControlBtn>
            </View>

            {/* ── Centre transport ── */}
            {!isBuffering && !hasError && !loading && (
              <View style={styles.transportRow}>
                <ControlBtn onPress={() => skipBy(-10)} size={48} circle>
                  <IcoRewind size={20} />
                </ControlBtn>

                <ControlBtn onPress={togglePlayPause} size={64} circle accent>
                  {isPlaying ? <IcoPause size={28} /> : <IcoPlay size={28} />}
                </ControlBtn>

                <ControlBtn onPress={() => skipBy(10)} size={48} circle>
                  <IcoForward size={20} />
                </ControlBtn>
              </View>
            )}

            {/* ── Bottom bar: seek + time ── */}
            {!isBuffering && !hasError && !loading && (
              <View style={styles.bottomBar}>
                {/* Time row */}
                <View style={styles.timeRow}>
                  <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
                  <Text style={styles.timeText}>{formatTime(duration)}</Text>
                </View>

                {/* Seek bar */}
                <SeekBar progress={progress} onSeek={seek} />

                {/* Skip labels */}
                <View style={styles.skipLabels}>
                  <Text style={styles.skipLabel}>−10s</Text>
                  <Text style={styles.skipLabel}>+10s</Text>
                </View>
              </View>
            )}
          </Animated.View>

        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

// ─── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    backgroundColor: C.bg,
    overflow: 'hidden',
    // Fix Android landscape shift — removes any implicit margin
    ...Platform.select({
      android: { elevation: 0 },
    }),
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: C.bg,
  },
  fillCenter: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderCard: {
    alignItems: 'center',
    gap: 10,
    backgroundColor: C.surface,
    borderRadius: 18,
    paddingHorizontal: 28,
    paddingVertical: 22,
    borderWidth: 0.5,
    borderColor: C.dimmed,
  },
  loaderLabel: {
    color: C.muted,
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
    letterSpacing: 0.3,
  },

  // Scrims
  scrimTop: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: 100,
    // Simple dark fade at top
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  scrimBottom: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    height: 130,
    backgroundColor: 'rgba(0,0,0,0.60)',
  },

  // Top bar
  topBar: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 8,
    gap: 10,
  },
  titleText: {
    flex: 1,
    color: C.white,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.2,
  },

  // Centre transport
  transportRow: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
  },

  // Bottom bar
  bottomBar: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    paddingHorizontal: 16,
    paddingBottom: 14,
    paddingTop: 8,
    gap: 6,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    color: C.muted,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
    fontVariant: ['tabular-nums'],
  },

  // Seek bar
  seekHitArea: {
    width: '100%',
    height: 28,
    justifyContent: 'center',
  },
  seekTrack: {
    height: 3,
    backgroundColor: C.track,
    borderRadius: 2,
    position: 'relative',
    overflow: 'visible',
  },
  seekFill: {
    height: '100%',
    backgroundColor: C.trackFill,
    borderRadius: 2,
  },
  seekThumb: {
    position: 'absolute',
    top: -5,
    width: 13,
    height: 13,
    borderRadius: 6.5,
    backgroundColor: C.white,
    marginLeft: -6.5,
    // subtle accent ring
    borderWidth: 2,
    borderColor: C.accent,
    shadowColor: C.accent,
    shadowOpacity: 0.6,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 0 },
    elevation: 4,
  },

  skipLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  skipLabel: {
    color: C.muted,
    fontSize: 10,
    fontWeight: '500',
    letterSpacing: 0.4,
  },
});

export default Videoplayer;