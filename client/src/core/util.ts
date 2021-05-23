import { useEffect, useState } from "react";

export function sleep(timeout: number) {
  return new Promise<void>((resolve) => {
    setTimeout(() => resolve(), timeout);
  });
}

export function useImage(path: string) {
  const [img, setImg] = useState<HTMLImageElement | undefined>(undefined);
  useEffect(() => {
    const tempImg = new Image();
    tempImg.onload = () => setImg(tempImg);
    tempImg.src = path;
  }, []);
  return img;
}