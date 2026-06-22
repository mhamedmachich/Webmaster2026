import { NATIONAL_RESOURCES } from "./nationalResources";

export const NATIONAL_JOBS = NATIONAL_RESOURCES.filter(resource => resource.category === "Jobs & Career");
