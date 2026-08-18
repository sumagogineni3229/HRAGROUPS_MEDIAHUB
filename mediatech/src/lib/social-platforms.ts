export interface SocialPlatformOption {
  value: string;
  label: string;
  iconName?: string;
  baseUrlPrefix?: string;
}

export const SOCIAL_PLATFORMS: SocialPlatformOption[] = [
  { value: "INSTAGRAM", label: "Instagram", baseUrlPrefix: "https://instagram.com/" },
  { value: "FACEBOOK", label: "Facebook", baseUrlPrefix: "https://facebook.com/" },
  { value: "LINKEDIN", label: "LinkedIn", baseUrlPrefix: "https://linkedin.com/in/" },
  { value: "X", label: "X (Twitter)", baseUrlPrefix: "https://x.com/" },
  { value: "THREADS", label: "Threads", baseUrlPrefix: "https://threads.net/@" },
  { value: "WHATSAPP", label: "WhatsApp", baseUrlPrefix: "https://wa.me/" },
  { value: "TELEGRAM", label: "Telegram", baseUrlPrefix: "https://t.me/" },
  { value: "SNAPCHAT", label: "Snapchat", baseUrlPrefix: "https://snapchat.com/add/" },
  { value: "DISCORD", label: "Discord", baseUrlPrefix: "https://discord.gg/" },
  { value: "REDDIT", label: "Reddit", baseUrlPrefix: "https://reddit.com/u/" },
  { value: "QUORA", label: "Quora", baseUrlPrefix: "https://quora.com/profile/" },
  { value: "MEETUP", label: "Meetup", baseUrlPrefix: "https://meetup.com/members/" },
  { value: "NEXTDOOR", label: "Nextdoor", baseUrlPrefix: "https://nextdoor.com/profile/" },
  { value: "WECHAT", label: "WeChat", baseUrlPrefix: "https://weixin.qq.com/" },
  { value: "VK", label: "VK", baseUrlPrefix: "https://vk.com/" },
  { value: "YOUTUBE", label: "YouTube", baseUrlPrefix: "https://youtube.com/@" },
  { value: "TIKTOK", label: "TikTok", baseUrlPrefix: "https://tiktok.com/@" },
  { value: "PODCAST", label: "Podcast", baseUrlPrefix: "" },
];

export function getSocialPlatformLabel(platform: string): string {
  const found = SOCIAL_PLATFORMS.find(
    (p) => p.value.toUpperCase() === platform.toUpperCase()
  );
  if (found) return found.label;
  if (platform === "TWITTER") return "X (Twitter)";
  return platform;
}

export function getSocialProfileUrl(platform: string, handle: string, profileUrl?: string | null): string {
  if (profileUrl && profileUrl.trim()) return profileUrl;
  const cleanHandle = handle.replace(/^@/, "").trim();
  if (!cleanHandle) return "#";

  const p = platform.toUpperCase();
  switch (p) {
    case "INSTAGRAM":
      return `https://instagram.com/${cleanHandle}`;
    case "FACEBOOK":
      return `https://facebook.com/${cleanHandle}`;
    case "LINKEDIN":
      return `https://linkedin.com/in/${cleanHandle}`;
    case "X":
    case "TWITTER":
      return `https://x.com/${cleanHandle}`;
    case "THREADS":
      return `https://threads.net/@${cleanHandle}`;
    case "WHATSAPP":
      return cleanHandle.startsWith("http") ? cleanHandle : `https://wa.me/${cleanHandle.replace(/[^0-9]/g, "")}`;
    case "TELEGRAM":
      return `https://t.me/${cleanHandle}`;
    case "SNAPCHAT":
      return `https://snapchat.com/add/${cleanHandle}`;
    case "DISCORD":
      return cleanHandle.startsWith("http") ? cleanHandle : `https://discord.com/users/${cleanHandle}`;
    case "REDDIT":
      return `https://reddit.com/u/${cleanHandle}`;
    case "QUORA":
      return `https://quora.com/profile/${cleanHandle}`;
    case "MEETUP":
      return `https://meetup.com/members/${cleanHandle}`;
    case "NEXTDOOR":
      return `https://nextdoor.com/profile/${cleanHandle}`;
    case "WECHAT":
      return `https://weixin.qq.com/`;
    case "VK":
      return `https://vk.com/${cleanHandle}`;
    case "YOUTUBE":
      return `https://youtube.com/@${cleanHandle}`;
    case "TIKTOK":
      return `https://tiktok.com/@${cleanHandle}`;
    default:
      return cleanHandle.startsWith("http") ? cleanHandle : "#";
  }
}
