import sign from "jwt-encode";

const apiKeyAuth = () => {
  const secret = process.env.PASSKIT_REST_SECRET;
  const now = +(new Date().valueOf() / 1000).toFixed(0);
  const data = {
    uid: process.env.PASSKIT_REST_KEY,
    iat: now,
    exp: now + 3600,
  };
  const jwt = sign(data, secret!, { alg: "HS256", typ: "JWT" });

  return jwt;
};

export default apiKeyAuth;
