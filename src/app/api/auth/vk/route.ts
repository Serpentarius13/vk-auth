import { NextRequest } from "next/server";
import { SERVER_ENV } from "../../../../server/server-env";
import axios from "axios";
import { redirect } from "next/navigation";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const deviceId = req.nextUrl.searchParams.get("device_id");
  const pixie = req.cookies.get("oauth_pixie")?.value;
  const state = req.nextUrl.searchParams.get("state");

  if (!code) {
    return Response.json({ error: "No code provided" }, { status: 422 });
  }

  if (!deviceId) {
    return Response.json({ error: "No deviceId provided" }, { status: 422 });
  }

  if (!pixie) {
    return Response.json({ error: "No pkce provided" }, { status: 422 });
  }

  if (!state) {
    return Response.json({ error: "No state provided" }, { status: 422 });
  }

  let redirectUri = "";

  try {
    const stateParsed = JSON.parse(atob(state));
    if (!stateParsed.redirectUri) {
      throw new Error("No redirectUri in state");
    }
    redirectUri = stateParsed.redirectUri;
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Wrong state" }, { status: 422 });
  }

  const url = new URL("https://id.vk.com/oauth2/auth");

  const params = {
    client_id: SERVER_ENV.OAUTH.VK_CLIENT_ID,
    redirect_uri: redirectUri,
    device_id: deviceId,
    code_verifier: pixie,
    grant_type: "authorization_code",
  };

  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }

  const { data: vkTokenRes } = await axios.post<VkAuthResponse>(
    url.toString(),
    {
      code,
    },
  );

  if ("error" in vkTokenRes) {
    console.error(vkTokenRes);

    return Response.json({ error: "Vk auth error" }, { status: 400 });
  }

  const { data: vkUser } = await axios.get<VkUserGetResponse>(
    `https://api.vk.com/method/users.get?fields=photo_200,verified,has_mobile,status&access_token=${vkTokenRes.access_token}&v=5.199`,
  );

  console.log(vkUser.response[0].id);

  return redirect("/");
}

export interface VKUser {
  id: number;
  photo_200?: string;
  first_name: string;
  last_name: string;
  can_access_closed: boolean;
  is_closed: boolean;
  has_mobile: number;
  verified: number;
  status: string;
}

export interface VkUserGetResponse {
  response: VKUser[];
}

export interface VkAuthResponse {
  access_token: string;
  expires_in: number;
  user_id: number;
  email?: string;
  phone?: string;
}
