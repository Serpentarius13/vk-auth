import Image from "next/image";
import { YandexOAuthButton } from "../components/YandexOAuthButton";
import { VkOAuthButton } from "../components/VkOAuthButton";

export default function Home() {
  return (
    <div className="flex flex-col gap-2 w-fit m-4 p-4 rounded-sm bg-gray-50 border-2 border-gray-300">
      <YandexOAuthButton />
      <VkOAuthButton />
    </div>
  );
}
