import Cookie from "js-cookie";

const COOKIE_KEY = "oauth_pixie";

export const pkceService = {
  generatePkceCodes,
  saveCodeVerifier(codeVerifier: string) {
    Cookie.set(COOKIE_KEY, codeVerifier, {
      expires: new Date(new Date().getTime() + 15 * 60 * 1000), // 15 minutes after now
    });
  },
};

async function generatePkceCodes() {
  const codeVerifier = randomString(64);
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  return {
    codeVerifier,
    codeChallenge,
  };
}

async function generateCodeChallenge(codeVerifier: string) {
  const encoder = new TextEncoder();

  const data = encoder.encode(codeVerifier);

  const digest = await window.crypto.subtle.digest("SHA-256", data);
  const base64Digest = arrayBufferToBase64(digest);

  return base64Digest.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

function randomString(length: number): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  const array = new Uint32Array(length);
  crypto.getRandomValues(array);

  return Array.from(array, (x) => chars[x % chars.length]).join("");
}

function arrayBufferToBase64(arrayBuffer: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
}
