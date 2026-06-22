import { NATIONAL_RESOURCES } from "./nationalResources";

export const NATIONAL_EMERGENCY = NATIONAL_RESOURCES.filter(resource =>
  resource.emergency || resource.category === "Emergency & Crisis"
);
