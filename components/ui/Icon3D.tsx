import Image from "next/image";

type Icon3DProps = {
  name:
    | "flash"
    | "target"
    | "money-bag"
    | "cube"
    | "bag"
    | "magic-trick"
    | "shield"
    | "star"
    | "painting-kit"
    | "bulb"
    | "pin"
    | "bookmark"
    | "pencil"
    | "mobile"
    | "coin"
    | "camera"
    | "video-cam";
  size?: number;
  bgColor?: string;
  className?: string;
};

export function Icon3D({ name, size = 40, bgColor, className = "" }: Icon3DProps) {
  const iconSize = Math.round(size * 0.72);
  const padding = Math.round(size * 0.14);

  if (bgColor) {
    return (
      <div
        className={`inline-flex items-center justify-center rounded-xl ${className}`}
        style={{
          width: size,
          height: size,
          backgroundColor: bgColor,
          padding: padding,
        }}
      >
        <Image
          src={`/icons/3d/${name}.webp`}
          alt=""
          width={iconSize}
          height={iconSize}
          unoptimized
        />
      </div>
    );
  }

  return (
    <Image
      src={`/icons/3d/${name}.webp`}
      alt=""
      width={size}
      height={size}
      className={className}
      unoptimized
    />
  );
}
