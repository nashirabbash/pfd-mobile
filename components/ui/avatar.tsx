import * as React from "react";
import {
  Image,
  StyleSheet,
  View,
  type ImageProps,
  type ViewProps,
} from "react-native";

// --- 1. Asumsi Theme ---
// Menggunakan theme yang sama dari contoh sebelumnya
const theme = {
  colors: {
    muted: "#F3F4F6", // bg-muted
  },
};

// --- 2. Konteks untuk State Management ---
// Ini adalah inti fungsionalitas Radix:
// - Avatar (root) akan menyediakan konteks ini.
// - AvatarImage akan MEMPERBARUI konteks (onLoad, onError).
// - AvatarFallback akan MEMBACA konteKS (untuk render kondisional).

type ImageStatus = "idle" | "loading" | "success" | "error";

type AvatarContextProps = {
  imageStatus: ImageStatus;
  setImageStatus: (status: ImageStatus) => void;
};

const AvatarContext = React.createContext<AvatarContextProps | null>(null);

/** Hook helper untuk memastikan konteks digunakan di dalam provider */
const useAvatarContext = () => {
  const context = React.useContext(AvatarContext);
  if (!context) {
    throw new Error(
      "Avatar compound components cannot be rendered outside the Avatar provider"
    );
  }
  return context;
};

// --- 3. Komponen Avatar (Root / Provider) ---

// Menerjemahkan: "relative flex size-8 shrink-0 overflow-hidden rounded-full"
const avatarStyles = StyleSheet.create({
  root: {
    position: "relative", // 'relative'
    display: "flex", // 'flex' (default di RN)
    height: 32, // 'size-8' (8 * 4px)
    width: 32, // 'size-8'
    flexShrink: 0, // 'shrink-0'
    overflow: "hidden", // 'overflow-hidden'
    borderRadius: 16, // 'rounded-full' (setengah dari height/width)
  },
});

type AvatarProps = ViewProps; // Props View standar

const Avatar = React.forwardRef<View, AvatarProps>(
  ({ style, ...props }, ref) => {
    const [imageStatus, setImageStatus] = React.useState<ImageStatus>("idle");

    return (
      <AvatarContext.Provider value={{ imageStatus, setImageStatus }}>
        <View
          ref={ref}
          // Style digabungkan, style dari parent (props) diletakkan terakhir
          style={[avatarStyles.root, style]}
          {...props}
        />
      </AvatarContext.Provider>
    );
  }
);
Avatar.displayName = "Avatar";

// --- 4. Komponen AvatarImage ---

// Menerjemahkan: "aspect-square size-full"
const avatarImageStyles = StyleSheet.create({
  image: {
    width: "100%", // 'size-full'
    height: "100%", // 'size-full'
    // 'aspect-square' dicapai karena parent (Avatar) sudah persegi.
    // Jika tidak, kita bisa menambahkan `aspectRatio: 1`.
  },
});

type AvatarImageProps = ImageProps; // Props Image standar

const AvatarImage = React.forwardRef<Image, AvatarImageProps>(
  ({ style, onLoad, onError, ...props }, ref) => {
    const { imageStatus, setImageStatus } = useAvatarContext();

    // Memberi tahu provider saat status loading berubah
    React.useEffect(() => {
      if (props.source) {
        setImageStatus("loading");
      } else {
        setImageStatus("idle"); // Tidak ada source, jadi idle
      }
    }, [props.source, setImageStatus]);

    // Jika gambar gagal di-load, jangan render komponen Image sama sekali
    if (imageStatus === "error") {
      return null;
    }

    return (
      <Image
        ref={ref}
        style={[avatarImageStyles.image, style]}
        onLoad={(e) => {
          setImageStatus("success");
          onLoad?.(e); // Meneruskan event handler asli jika ada
        }}
        onError={(e) => {
          setImageStatus("error");
          onError?.(e); // Meneruskan event handler asli jika ada
        }}
        {...props}
      />
    );
  }
);
AvatarImage.displayName = "AvatarImage";

// --- 5. Komponen AvatarFallback ---

// Menerjemahkan: "bg-muted flex size-full items-center justify-center rounded-full"
const avatarFallbackStyles = StyleSheet.create({
  fallback: {
    backgroundColor: theme.colors.muted, // 'bg-muted'
    display: "flex", // 'flex'
    width: "100%", // 'size-full'
    height: "100%", // 'size-full'
    alignItems: "center", // 'items-center'
    justifyContent: "center", // 'justify-center'
    borderRadius: 16, // 'rounded-full' (menyesuaikan parent)
  },
});

type AvatarFallbackProps = ViewProps;

const AvatarFallback = React.forwardRef<View, AvatarFallbackProps>(
  ({ style, ...props }, ref) => {
    const { imageStatus } = useAvatarContext();

    // Hanya render fallback jika gambar TIDAK berhasil di-load
    // (Bisa 'idle', 'loading', atau 'error')
    if (imageStatus === "success") {
      return null;
    }

    return (
      <View
        ref={ref}
        style={[avatarFallbackStyles.fallback, style]}
        {...props}
      />
    );
  }
);
AvatarFallback.displayName = "AvatarFallback";

// --- 6. Ekspor ---
export { Avatar, AvatarFallback, AvatarImage };
