import sign from "jwt-encode";

const apiKeyAuth = (
  secret: string | undefined = process.env.PASSKIT_REST_SECRET,
  key: string | undefined = process.env.PASSKIT_REST_KEY
) => {
  const iat = Math.floor(Date.now() / 1000); // Current time in seconds since epoch
  const data = {
    uid: key,
    iat,
    exp: iat + 3600,
  };
  const jwt = sign(data, secret!, { alg: "HS256", typ: "JWT" });

  return jwt;
};

export default apiKeyAuth;
