const CATEGORY_IMAGE_MAP: Record<string, string> = {
  WELCOME: "/welcome_reward.png",
  PROFILE: "/profile_reward.png",
};

export function resolveRewardImage({
  image,
  category,
}: {
  image?: string | null;
  category?: string | null;
}) {
  if (image) {
    return image;
  }

  if (category) {
    const normalizedCategory = category.toUpperCase();
    if (CATEGORY_IMAGE_MAP[normalizedCategory]) {
      return CATEGORY_IMAGE_MAP[normalizedCategory];
    }
  }

  return "/reward.png";
}
