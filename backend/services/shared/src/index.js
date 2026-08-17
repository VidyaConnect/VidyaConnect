import responseModule from "./utils/response.js";

export { logger } from "./utils/logger.js";
export { getSigningKey } from "./config/keycloak.js";
export const successResponse = responseModule.successResponse;
export const errorResponse = responseModule.errorResponse;
export const error = responseModule.error;
export const response = responseModule;
export { errorHandler } from "./middleware/errorHandler.js";
export { default as auth } from "./middleware/auth.js";
export { default as rbac } from "./middleware/rbac.js";
export default responseModule;
