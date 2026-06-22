import { NATIONAL_RESOURCES } from "./nationalResources";

export const NATIONAL_EDUCATION = NATIONAL_RESOURCES.filter(resource =>
  ["Education & College", "Youth Programs", "Libraries & Learning Spaces"].includes(resource.category)
);
