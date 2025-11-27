import { Icon } from "@/components/ui/icon"; // Asumsi ini adalah <Icon> yang dikonversi dari langkah sebelumnya
import { NativeOnlyAnimatedView } from "@/components/ui/native-only-animated-view";
import * as DialogPrimitive from "@rn-primitives/dialog";
import { X } from "lucide-react-native";
import * as React from "react";
import {
  Platform,
  StyleSheet,
  View,
  type PressableStateCallbackType,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import { FadeIn, FadeOut } from "react-native-reanimated";
import { FullWindowOverlay as RNFullWindowOverlay } from "react-native-screens";

// --- 1. Asumsi Theme ---
const theme = {
  colors: {
    background: "#FFFFFF",
    border: "#E4E4E7",
    foreground: "#09090B",
    mutedForeground: "#71717A",
    accentForeground: "#09090B",
  },
  fontSizes: {
    lg: 18,
    sm: 14,
  },
  fontWeights: {
    semibold: "600" as const,
  },
};

// --- 2. Terjemahan `cn` ke `StyleSheet` ---
const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 50,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // 'bg-black/50'
    padding: 8, // 'p-2'
  },
  content: {
    backgroundColor: theme.colors.background, // 'bg-background'
    borderColor: theme.colors.border, // 'border-border'
    zIndex: 50,
    marginHorizontal: "auto", // 'mx-auto'
    width: "100%", // 'w-full'
    maxWidth: 512, // 'sm:max-w-lg' (Diambil dari 'sm:' sebagai default)
    flexDirection: "column", // 'flex-col'
    gap: 16, // 'gap-4'
    borderRadius: 8, // 'rounded-lg'
    borderWidth: 1, // 'border'
    padding: 24, // 'p-6'
    // 'shadow-lg shadow-black/5'
    shadowColor: "rgba(0, 0, 0, 0.1)", // Kombinasi
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 1, // Dikelola oleh shadowColor
    shadowRadius: 15,
    elevation: 10,
  },
  closeButton: {
    position: "absolute",
    right: 16, // 'right-4'
    top: 16, // 'top-4'
    borderRadius: 6, // 'rounded'
    opacity: 0.7, // 'opacity-70'
  },
  closeButtonPressed: {
    opacity: 1, // 'active:opacity-100'
  },
  closeIcon: {
    color: theme.colors.accentForeground, // 'text-accent-foreground'
    flexShrink: 0, // 'shrink-0'
  },
  header: {
    display: "flex",
    flexDirection: "column", // 'flex flex-col'
    gap: 8, // 'gap-2'
    // 'text-center sm:text-left' diabaikan karena style text
    // tidak bisa di-cascade dari <View> di React Native
  },
  footer: {
    display: "flex",
    // 'flex-col-reverse sm:flex-row sm:justify-end'
    // Kita ambil default 'sm:' (desktop) untuk native
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8, // 'gap-2'
  },
  title: {
    color: theme.colors.foreground, // 'text-foreground'
    fontSize: theme.fontSizes.lg, // 'text-lg'
    fontWeight: theme.fontWeights.semibold, // 'font-semibold'
    lineHeight: theme.fontSizes.lg * 1.1, // 'leading-none'
  },
  description: {
    color: theme.colors.mutedForeground, // 'text-muted-foreground'
    fontSize: theme.fontSizes.sm, // 'text-sm'
  },
});

// --- 3. Komponen yang Dikonversi ---

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const FullWindowOverlay =
  Platform.OS === "ios" ? RNFullWindowOverlay : React.Fragment;

function DialogOverlay({
  style, // 'className' diganti 'style'
  children,
  ...props
}: Omit<DialogPrimitive.OverlayProps, "asChild"> &
  React.RefAttributes<DialogPrimitive.OverlayRef> & {
    children?: React.ReactNode;
    style?: StyleProp<ViewStyle>; // Tipe 'style'
  }) {
  return (
    <FullWindowOverlay>
      <DialogPrimitive.Overlay
        style={[styles.overlay, style]} // 'className' diganti 'style'
        {...props}
        asChild={Platform.OS !== "web"}
      >
        <NativeOnlyAnimatedView
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(150)}
        >
          <NativeOnlyAnimatedView
            entering={FadeIn.delay(50)}
            exiting={FadeOut.duration(150)}
          >
            <>{children}</>
          </NativeOnlyAnimatedView>
        </NativeOnlyAnimatedView>
      </DialogPrimitive.Overlay>
    </FullWindowOverlay>
  );
}

function DialogContent({
  style, // 'className' diganti 'style'
  portalHost,
  children,
  ...props
}: DialogPrimitive.ContentProps &
  React.RefAttributes<DialogPrimitive.ContentRef> & {
    portalHost?: string;
    style?: StyleProp<ViewStyle>; // Tipe 'style'
  }) {
  // Callback untuk style 'active:opacity-100'
  const closeButtonStyle = ({
    pressed,
  }: PressableStateCallbackType): StyleProp<ViewStyle> => [
    styles.closeButton,
    pressed && styles.closeButtonPressed,
  ];

  return (
    <DialogPortal hostName={portalHost}>
      <DialogOverlay>
        <DialogPrimitive.Content
          style={[styles.content, style]} // 'className' diganti 'style'
          {...props}
        >
          <>{children}</>
          <DialogPrimitive.Close
            style={closeButtonStyle} // 'className' diganti 'style'
            hitSlop={12}
            accessibilityLabel="Close" // 'sr-only' diganti accessibilityLabel
          >
            <Icon
              as={X}
              style={styles.closeIcon} // 'className' diganti 'style'
              size={16} // 'size-4'
            />
            {/* <Text className="sr-only">Close</Text> dihilangkan */}
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogOverlay>
    </DialogPortal>
  );
}

function DialogHeader({ style, ...props }: ViewProps) {
  return (
    <View style={[styles.header, style]} {...props} /> // 'className' diganti 'style'
  );
}

function DialogFooter({ style, ...props }: ViewProps) {
  return (
    <View style={[styles.footer, style]} {...props} /> // 'className' diganti 'style'
  );
}

function DialogTitle({
  style, // 'className' diganti 'style'
  ...props
}: DialogPrimitive.TitleProps &
  React.RefAttributes<DialogPrimitive.TitleRef> & {
    style?: StyleProp<ViewStyle>; // Tipe 'style'
  }) {
  return (
    <DialogPrimitive.Title
      style={[styles.title, style]} // 'className' diganti 'style'
      {...props}
    />
  );
}

function DialogDescription({
  style, // 'className' diganti 'style'
  ...props
}: DialogPrimitive.DescriptionProps &
  React.RefAttributes<DialogPrimitive.DescriptionRef> & {
    style?: StyleProp<ViewStyle>; // Tipe 'style'
  }) {
  return (
    <DialogPrimitive.Description
      style={[styles.description, style]} // 'className' diganti 'style'
      {...props}
    />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
