import { Image } from "@heroui/image";

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
  alt?: string;
}

export default function Logo({
  width = 350,
  height = 80,
  className = "p-3",
  alt = "Logo TODO App",
}: LogoProps) {
  return (
    <Image
      src="/next.svg"
      className={`color-inherit dark:invert ${className}`}
      alt={alt}
      width={width}
      height={height}
      style={{ maxWidth: "100%", height: "auto" }}
    />
  );
}