import { Platform, View, type ViewProps } from "react-native";
import Animated, { type AnimatedProps } from "react-native-reanimated";

// Tentukan tipe props. Use a union instead of using the runtime `Platform.OS` in a type position.
// This avoids referencing a value in a type expression which TypeScript disallows.
type Props = AnimatedProps<ViewProps> | ViewProps;

/**
 * Komponen ini bertindak sebagai wrapper.
 * - Di iOS/Android, ia me-render `Animated.View` dari reanimated.
 * - Di Web, ia me-render `View` standar.
 *
 * Ini berguna agar props seperti `entering` dan `exiting`
 * tidak menyebabkan crash pada platform web.
 */
export const NativeOnlyAnimatedView = ({ children, ...props }: Props) => {
  if (Platform.OS === "web") {
    // Di web, 'entering' dan 'exiting' bukan props yang valid untuk <View>.
    // Kita hapus secara manual sebelum meneruskannya ke <View>.
    const { entering, exiting, ...webProps } = props as any;

    return <View {...webProps}>{children}</View>;
  }

  // Di native, kita bisa langsung me-render Animated.View
  // dan meneruskan semua props (termasuk 'entering'/'exiting').
  return (
    <Animated.View {...(props as AnimatedProps<ViewProps>)}>
      {children}
    </Animated.View>
  );
};
