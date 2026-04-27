import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

type AdminPayload = {
  username: string;
  expiresAt: number;
};

const cookieName = "opencoco-admin";
const cookieDuration = 1000 * 60 * 60 * 24 * 7;

const getAdminConfig = () => ({
  username: process.env.ADMIN_USERNAME ?? "admin",
  password: process.env.ADMIN_PASSWORD ?? "opencoco123",
  secret: process.env.ADMIN_SESSION_SECRET ?? "opencoco-dev-secret",
});

const sign = (value: string) =>
  createHmac("sha256", getAdminConfig().secret).update(value).digest("hex");

const encode = (payload: AdminPayload) => {
  const raw = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${raw}.${sign(raw)}`;
};

const decode = (value: string): AdminPayload | null => {
  const [raw, signature] = value.split(".");

  if (!raw || !signature) {
    return null;
  }

  const expected = sign(raw);
  const valid = timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected),
  );

  if (!valid) {
    return null;
  }

  const payload = JSON.parse(
    Buffer.from(raw, "base64url").toString("utf8"),
  ) as AdminPayload;

  if (payload.expiresAt < Date.now()) {
    return null;
  }

  return payload;
};

export const validateAdminCredentials = (
  username: string,
  password: string,
) => {
  const config = getAdminConfig();
  return username === config.username && password === config.password;
};

export const createAdminCookieValue = (username: string) =>
  encode({
    username,
    expiresAt: Date.now() + cookieDuration,
  });

export const getAdminSession = async () => {
  const cookieStore = await cookies();
  const value = cookieStore.get(cookieName)?.value;
  if (!value) {
    return null;
  }
  return decode(value);
};

export const setAdminCookie = async (value: string) => {
  const cookieStore = await cookies();
  cookieStore.set(cookieName, value, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: cookieDuration / 1000,
    path: "/",
  });
};

export const clearAdminCookie = async () => {
  const cookieStore = await cookies();
  cookieStore.delete(cookieName);
};
