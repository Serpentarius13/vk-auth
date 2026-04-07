import { NextRequest } from "next/server";
import axios from "axios";
import { SERVER_ENV } from "../../../../server/server-env";
import { redirect } from "next/navigation";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");

  if (!code) {
    return Response.json({ error: "No code provided" }, { status: 422 });
  }

  const { data } = await axios.post<YandexAuthResponse>(
    `https://oauth.yandex.ru/token`,
    new URLSearchParams({
      grant_type: "authorization_code",
      code,
    }),
    {
      responseType: "json",
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${SERVER_ENV.OAUTH.YANDEX_CLIENT_ID}:${SERVER_ENV.OAUTH.YANDEX_SECRET}`,
        ).toString("base64")}`,
      },
    },
  );

  const { data: yaUser } = await axios.get<YandexUser>(
    `https://login.yandex.ru/info?oauth_token=${data.access_token}&jwt_secret=${SERVER_ENV.OAUTH.YANDEX_SECRET}&format=json`,
  );

  console.log({
    id: yaUser.id,
    birthday: yaUser.birthday,
    sex: yaUser.sex,
    email: yaUser.default_email,
  });

  return redirect("/");
}

interface YandexAuthResponse {
  token_type: string;
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

interface YandexUser {
  id: number;
  login: string;
  client_id: string;
  default_email?: string;
  default_avatar_id?: string;
  real_name?: string;
  display_name?: string;
  first_name?: string;
  last_name?: string;
  birthday?: string;
  sex?: string;
  default_phone?: {
    id: number;
    number: string;
  };
}
