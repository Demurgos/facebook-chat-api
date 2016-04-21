export function getGetCurrentUserID (defaultFuncs, api, ctx) {
  return function getCurrentUserID() {
    return ctx.userID;
  };
}

export default getGetCurrentUserID;
