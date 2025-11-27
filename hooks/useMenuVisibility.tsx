import { useState } from "react";

export default function useMenuVisibility() {
  const [visible, setVisible] = useState(false);
  const open = () => setVisible(true);
  const close = () => setVisible(false);
  return { visible, open, close };
}
