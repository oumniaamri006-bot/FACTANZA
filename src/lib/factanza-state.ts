export type UserState = {
  onboarded: boolean;
  name: string;
  interests: string[];
  formats: string[];
  votes: Record<string, string>;
  reminders: string[];
  analytics: boolean;
  notifications: boolean;
};
export const storageKey = "factanza-user";
export const initialUser: UserState = {
  onboarded: false,
  name: "Facta Lover",
  interests: [],
  formats: [],
  votes: {},
  reminders: [],
  analytics: true,
  notifications: false,
};
export function parseUser(raw: string | null): UserState {
  if (!raw) return { ...initialUser };
  try {
    const data: unknown = JSON.parse(raw);
    if (!data || typeof data !== "object") return { ...initialUser };
    const d = data as Record<string, unknown>;
    return {
      onboarded: d["onboarded"] === true,
      name: typeof d["name"] === "string" ? d["name"] : initialUser.name,
      interests: Array.isArray(d["interests"])
        ? d["interests"].filter((v): v is string => typeof v === "string")
        : [],
      formats: Array.isArray(d["formats"])
        ? d["formats"].filter((v): v is string => typeof v === "string")
        : [],
      reminders: Array.isArray(d["reminders"])
        ? d["reminders"].filter((v): v is string => typeof v === "string")
        : [],
      votes:
        d["votes"] && typeof d["votes"] === "object"
          ? Object.fromEntries(Object.entries(d["votes"]).filter(([, v]) => typeof v === "string"))
          : {},
      analytics: d["analytics"] !== false,
      notifications: d["notifications"] === true,
    };
  } catch {
    return { ...initialUser };
  }
}
export function toggleValue(values: string[], value: string) {
  return values.includes(value) ? values.filter((v) => v !== value) : [...values, value];
}
export function hasChangedMind(before: string, after: string) {
  return before !== after;
}
