import { NATIONAL_RESOURCES } from "./nationalResources";

export const NATIONAL_HEALTH = NATIONAL_RESOURCES.filter(resource =>
  ["Health Care", "Mental Health", "Emergency & Crisis"].includes(resource.category)
);
