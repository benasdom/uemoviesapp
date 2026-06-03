import { images } from '@/constants/images';
import { Animated, Dimensions, Image } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const ITEM_WIDTH = SCREEN_WIDTH * 0.52;
export const ITEM_HEIGHT = ITEM_WIDTH * 1.55;
const SIDE_ITEM_SCALE = 0.82;

interface SliderItemProps {
  item: Movie;
  scrollX: Animated.Value;
  index: number;   // looped index (0 … count*3-1)
  step: number;    // ITEM_WIDTH + GAP
}

const SliderItem = ({ item, scrollX, index, step }: SliderItemProps) => {
  // Center offset of this item in the scrollable list
  const center = index * step;

  const scale = scrollX.interpolate({
    inputRange: [center - step, center, center + step],
    outputRange: [SIDE_ITEM_SCALE, 1, SIDE_ITEM_SCALE],
    extrapolate: 'clamp',
  });

  const opacity = scrollX.interpolate({
    inputRange: [center - step, center, center + step],
    outputRange: [0.55, 1, 0.55],
    extrapolate: 'clamp',
  });

  const imageUri = item.poster_path
    ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
    : null;

  return (
    <Animated.View
      style={{
        width: ITEM_WIDTH,
        height: ITEM_HEIGHT,
        transform: [{ scale }],
        opacity,
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.45,
        shadowRadius: 12,
        elevation: 10,
      }}
    >
      <Image
        style={{ width: '100%', height: '100%' }}
        source={imageUri ? { uri: imageUri } : images.logo}
        resizeMode="cover"
      />
    </Animated.View>
  );
};

export default SliderItem;