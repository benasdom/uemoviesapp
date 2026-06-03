import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Path, Circle, Rect, Polyline, Line, Polygon } from 'react-native-svg';

// ─── SVG Icon Library ─────────────────────────────────────────────────────────

type IconProps = { color?: string; size?: number };

const IconFilm = ({ color = 'white', size = 20 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <Rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
    <Line x1="7" y1="2" x2="7" y2="22" />
    <Line x1="17" y1="2" x2="17" y2="22" />
    <Line x1="2" y1="12" x2="22" y2="12" />
    <Line x1="2" y1="7" x2="7" y2="7" />
    <Line x1="2" y1="17" x2="7" y2="17" />
    <Line x1="17" y1="17" x2="22" y2="17" />
    <Line x1="17" y1="7" x2="22" y2="7" />
  </Svg>
);

const IconBookmark = ({ color = 'white', size = 20 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </Svg>
);

const IconClock = ({ color = 'white', size = 20 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="10" />
    <Polyline points="12 6 12 12 16 14" />
  </Svg>
);

const IconEdit = ({ color = 'white', size = 20 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <Path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </Svg>
);

const IconPen = ({ color = 'white', size = 14 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M12 20h9" />
    <Path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
  </Svg>
);

const IconStar = ({ color = 'white', size = 20 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <Polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
  </Svg>
);

const IconLock = ({ color = 'white', size = 20 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <Rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <Path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </Svg>
);

const IconGlobe = ({ color = 'white', size = 20 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="10" />
    <Line x1="2" y1="12" x2="22" y2="12" />
    <Path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </Svg>
);

const IconShield = ({ color = 'white', size = 20 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </Svg>
);

const IconInfo = ({ color = 'white', size = 20 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="10" />
    <Line x1="12" y1="8" x2="12" y2="12" />
    <Line x1="12" y1="16" x2="12.01" y2="16" />
  </Svg>
);

const IconLogOut = ({ color = '#FF6B6B', size = 20 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <Polyline points="16 17 21 12 16 7" />
    <Line x1="21" y1="12" x2="9" y2="12" />
  </Svg>
);

const IconBell = ({ color = 'white', size = 20 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <Path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </Svg>
);

const IconPlay = ({ color = 'white', size = 20 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <Polygon points="5 3 19 12 5 21 5 3" />
  </Svg>
);

const IconUser = ({ color = 'white', size = 20 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <Circle cx="12" cy="7" r="4" />
  </Svg>
);

const IconChevronRight = ({ color = 'rgb(132,142,156)', size = 18 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Polyline points="9 18 15 12 9 6" />
  </Svg>
);

const IconWriting = ({ color = 'white', size = 20 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <Polyline points="14 2 14 8 20 8" />
    <Line x1="16" y1="13" x2="8" y2="13" />
    <Line x1="16" y1="17" x2="8" y2="17" />
    <Polyline points="10 9 9 9 8 9" />
  </Svg>
);

// ─── Types ────────────────────────────────────────────────────────────────────
interface StatCardProps {
  value: string | number;
  label: string;
  icon: React.ReactNode;
}

interface SettingRowProps {
  icon: React.ReactNode;
  label: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  destructive?: boolean;
}

// ─── Mock user data ───────────────────────────────────────────────────────────
const USER = {
  name: 'Alex Rivera',
  username: '@alexrivera',
  bio: 'Cinema is life. Horror & sci-fi obsessed.',
  avatarUrl: null as string | null,
  joinedYear: 2023,
};

const STATS = {
  watched: 142,
  saved: 38,
  hours: 284,
  reviews: 21,
};

const FAVORITE_GENRES = ['Sci-Fi', 'Horror', 'Thriller', 'Drama', 'Animation'];

// ─── Sub-components ───────────────────────────────────────────────────────────

const StatCard = ({ value, label, icon }: StatCardProps) => (
  <View
    style={{
      flex: 1,
      backgroundColor: 'rgb(43,49,57)',
      borderRadius: 14,
      padding: 14,
      alignItems: 'center',
      gap: 6,
    }}
  >
    {icon}
    <Text style={{ color: 'white', fontSize: 18, fontWeight: '700' }}>{value}</Text>
    <Text style={{ color: 'rgb(132,142,156)', fontSize: 11 }}>{label}</Text>
  </View>
);

const SectionLabel = ({ title }: { title: string }) => (
  <Text
    style={{
      color: 'rgb(132,142,156)',
      fontSize: 11,
      fontWeight: '600',
      letterSpacing: 1.4,
      textTransform: 'uppercase',
      marginBottom: 8,
      marginTop: 24,
      paddingHorizontal: 16,
    }}
  >
    {title}
  </Text>
);

const SettingRow = ({
  icon,
  label,
  onPress,
  rightElement,
  destructive = false,
}: SettingRowProps) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={onPress ? 0.7 : 1}
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255,255,255,0.05)',
      gap: 14,
    }}
  >
    <View style={{ width: 22, alignItems: 'center' }}>{icon}</View>
    <Text
      style={{
        flex: 1,
        color: destructive ? '#FF6B6B' : 'white',
        fontSize: 15,
      }}
    >
      {label}
    </Text>
    {rightElement ?? (onPress ? <IconChevronRight /> : null)}
  </TouchableOpacity>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const Profile = () => {
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoPlayTrailer, setAutoPlayTrailer] = useState(false);

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: () => console.log('Logged out') },
    ]);
  };

  const initials = USER.name
    .split(' ')
    .map((n) => n[0])
    .join('');

  return (
    <View style={{ flex: 1, backgroundColor: 'rgba(21,21,21,1)' }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* ── Avatar & Bio ── */}
        <View style={{ alignItems: 'center', paddingTop: 70, paddingBottom: 24, paddingHorizontal: 16 }}>
          {/* Avatar */}
          <View style={{ position: 'relative', marginBottom: 14 }}>
            <View
              style={{
                width: 90,
                height: 90,
                borderRadius: 45,
                backgroundColor: 'rgba(70,81,101,0.844)',
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 2,
                borderColor: 'rgba(183,189,198,0.3)',
              }}
            >
              {USER.avatarUrl ? (
                <Image
                  source={{ uri: USER.avatarUrl }}
                  style={{ width: 90, height: 90, borderRadius: 45 }}
                />
              ) : (
                <Text style={{ color: 'white', fontSize: 30, fontWeight: '700' }}>
                  {initials}
                </Text>
              )}
            </View>

            {/* Edit avatar button */}
            <TouchableOpacity
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                backgroundColor: 'rgb(43,49,57)',
                borderRadius: 14,
                width: 26,
                height: 26,
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 1.5,
                borderColor: 'rgba(21,21,21,1)',
              }}
            >
              <IconPen color="rgb(183,189,198)" size={13} />
            </TouchableOpacity>
          </View>

          <Text style={{ color: 'white', fontSize: 22, fontWeight: '700' }}>
            {USER.name}
          </Text>
          <Text style={{ color: 'rgb(132,142,156)', fontSize: 14, marginTop: 2 }}>
            {USER.username} · Member since {USER.joinedYear}
          </Text>
          <Text
            style={{
              color: 'rgb(183,189,198)',
              fontSize: 14,
              textAlign: 'center',
              marginTop: 10,
              lineHeight: 20,
              paddingHorizontal: 24,
            }}
          >
            {USER.bio}
          </Text>
        </View>

        {/* ── Stats ── */}
        <View style={{ flexDirection: 'row', gap: 10, paddingHorizontal: 16 }}>
          <StatCard value={STATS.watched} label="Watched" icon={<IconFilm color="rgb(183,189,198)" size={22} />} />
          <StatCard value={STATS.saved} label="Saved" icon={<IconBookmark color="rgb(183,189,198)" size={22} />} />
          <StatCard value={`${STATS.hours}h`} label="Time" icon={<IconClock color="rgb(183,189,198)" size={22} />} />
          <StatCard value={STATS.reviews} label="Reviews" icon={<IconWriting color="rgb(183,189,198)" size={22} />} />
        </View>

        {/* ── Favourite Genres ── */}
        <SectionLabel title="Favourite Genres" />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 16 }}>
          {FAVORITE_GENRES.map((genre) => (
            <View
              key={genre}
              style={{
                backgroundColor: 'rgba(70,81,101,0.6)',
                borderRadius: 20,
                paddingHorizontal: 14,
                paddingVertical: 7,
                borderWidth: 1,
                borderColor: 'rgba(183,189,198,0.15)',
              }}
            >
              <Text style={{ color: 'rgb(183,189,198)', fontSize: 13 }}>{genre}</Text>
            </View>
          ))}
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              borderRadius: 20,
              paddingHorizontal: 14,
              paddingVertical: 7,
              borderWidth: 1,
              borderColor: 'rgba(183,189,198,0.25)',
            }}
          >
            <IconPen color="rgb(132,142,156)" size={12} />
            <Text style={{ color: 'rgb(132,142,156)', fontSize: 13 }}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* ── Preferences ── */}
        <SectionLabel title="Preferences" />
        <View
          style={{
            backgroundColor: 'rgb(43,49,57)',
            borderRadius: 14,
            marginHorizontal: 16,
            overflow: 'hidden',
          }}
        >
          <SettingRow
            icon={<IconBell color="rgb(183,189,198)" size={20} />}
            label="Notifications"
            rightElement={
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: 'rgb(71,77,87)', true: 'rgba(70,81,101,0.844)' }}
                thumbColor="white"
              />
            }
          />
          <SettingRow
            icon={<IconPlay color="rgb(183,189,198)" size={20} />}
            label="Auto-play Trailers"
            rightElement={
              <Switch
                value={autoPlayTrailer}
                onValueChange={setAutoPlayTrailer}
                trackColor={{ false: 'rgb(71,77,87)', true: 'rgba(70,81,101,0.844)' }}
                thumbColor="white"
              />
            }
          />
        </View>

        {/* ── Account ── */}
        <SectionLabel title="Account" />
        <View
          style={{
            backgroundColor: 'rgb(43,49,57)',
            borderRadius: 14,
            marginHorizontal: 16,
            overflow: 'hidden',
          }}
        >
          <SettingRow icon={<IconUser color="rgb(183,189,198)" size={20} />} label="Edit Profile" onPress={() => {}} />
          <SettingRow icon={<IconLock color="rgb(183,189,198)" size={20} />} label="Change Password" onPress={() => {}} />
          <SettingRow icon={<IconGlobe color="rgb(183,189,198)" size={20} />} label="Language" onPress={() => {}} />
          <SettingRow icon={<IconStar color="rgb(183,189,198)" size={20} />} label="Rate the App" onPress={() => {}} />
          <SettingRow icon={<IconShield color="rgb(183,189,198)" size={20} />} label="Privacy Policy" onPress={() => {}} />
          <SettingRow icon={<IconInfo color="rgb(183,189,198)" size={20} />} label="About" onPress={() => {}} />
        </View>

        {/* ── Session ── */}
        <SectionLabel title="Session" />
        <View
          style={{
            backgroundColor: 'rgb(43,49,57)',
            borderRadius: 14,
            marginHorizontal: 16,
            overflow: 'hidden',
          }}
        >
          <SettingRow
            icon={<IconLogOut color="#FF6B6B" size={20} />}
            label="Log Out"
            onPress={handleLogout}
            destructive
          />
        </View>

        <Text style={{ color: 'rgb(71,77,87)', fontSize: 12, textAlign: 'center', marginTop: 24 }}>
          v1.0.0
        </Text>
      </ScrollView>
    </View>
  );
};

export default Profile;