import { NATIONAL_RESOURCES } from "./nationalResources";

export const NATIONAL_FOOD = NATIONAL_RESOURCES.filter(resource => resource.category === "Food Assistance");
