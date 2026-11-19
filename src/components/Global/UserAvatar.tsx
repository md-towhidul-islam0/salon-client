import Image from "next/image";

type UserAvatarProps = {
  image?: string | null;
  name?: string | null;
  size?: number;
  className?: string;
};

export default function UserAvatar({
  image,
  name,
  size = 32,
  className = "",
}: UserAvatarProps) {
  const label = name?.trim() || "Salon member";
  const initials =
    label
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "HS";

  if (image) {
    return (
      <Image
        src={image}
        alt={label}
        width={size}
        height={size}
        unoptimized
        style={{ width: size, height: size }}
        className={`shrink-0 rounded-full object-cover ${className}`}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      style={{ width: size, height: size }}
      className={`flex shrink-0 items-center justify-center rounded-full bg-accent/15 font-semibold text-accent ${
        size >= 40 ? "text-sm" : "text-xs"
      } ${className}`}
    >
      {initials}
    </span>
  );
}
