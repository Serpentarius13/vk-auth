"use client";

import { type ReactNode, type FC, useMemo } from "react";
import { CLIENT_ENV } from "../lib/client-env";
import { LinkButton } from "./shared/LinkButton";

interface Props {
  children?: ReactNode;
}

export const YandexOAuthButton: FC<Props> = ({}) => {
  const yandexLink = useMemo(() => {
    const link = new URL("https://oauth.yandex.ru/authorize");

    const params = {
      client_id: CLIENT_ENV.OAUTH.YANDEX_CLIENT_ID,
      response_type: "code",
      redirect_uri:
        (typeof window !== "undefined" ? window.location.origin : "") +
        "/api/auth/yandex",
    };

    for (const param in params) {
      link.searchParams.set(param, params[param as keyof typeof params]);
    }

    return link.toString();
  }, []);

  return (
    <LinkButton href={yandexLink} className="hover:bg-yellow-50 text-black">
      <svg
        viewBox="0 0 512 512"
        xmlns="http://www.w3.org/2000/svg"
        fill-rule="evenodd"
        clip-rule="evenodd"
        stroke-linejoin="round"
        stroke-miterlimit="2"
        width="32"
        height="32"
      >
        <path
          d="M455.999 6h-400C28.388 6 6 28.387 6 56v399.999c0 27.612 22.388 50 50 50h400c27.612 0 50-22.388 50-50v-400c0-27.612-22.388-50-50-50z"
          fill="#fc3f1d"
          fill-rule="nonzero"
        />
        <path
          d="M283.718 362.624v53.781h-55.062v-90.687L124.75 99.75h57.456l80.95 176.78c15.606 33.782 20.562 45.52 20.562 86.094zM387.249 99.75l-67.55 153.093h-55.981L331.262 99.75h55.987z"
          fill="#fff"
          fill-rule="nonzero"
        />
      </svg>
      <span>Продолжить с Yandex ID</span>
    </LinkButton>
  );
};
