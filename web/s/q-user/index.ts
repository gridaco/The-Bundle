import type { User } from "@supabase/supabase-js";
import { app_metadata_subscription_id } from "@/k/userkey.json";

export const isProUser = (user: User) =>
  !!user.app_metadata[app_metadata_subscription_id];

export const isUserWelcomeFormRequired = (user: User) => {
  const requiredFields = ["instagram_username", "job_title", "team_size"];
  return !requiredFields.every((field) => !!user.user_metadata[field]);
};
