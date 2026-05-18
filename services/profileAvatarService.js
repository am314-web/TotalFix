import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "profile_avatar_map_v1";

export const getDefaultAvatar = (role = "client", uid = "") => {
  const seed = encodeURIComponent(`${role}-${uid || "guest"}`);
  if (role === "professional") {
    return `https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}`;
  }
  return `https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=${seed}`;
};

export const getAvatarMap = async () => {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
};

export const getUserAvatar = async (uid, role = "client") => {
  if (!uid) return getDefaultAvatar(role, uid);
  const map = await getAvatarMap();
  return map[uid] || getDefaultAvatar(role, uid);
};

export const setUserAvatar = async (uid, uri) => {
  if (!uid || !uri) return;
  const map = await getAvatarMap();
  map[uid] = uri;
  await AsyncStorage.setItem(KEY, JSON.stringify(map));
};
