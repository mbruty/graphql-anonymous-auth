export default (object: any, req: any) => {
  return {
    ...object,
    accessToken: req.accessToken,
    refreshToken: req.refreshToken,
  };
};
