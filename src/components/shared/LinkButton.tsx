import { type ReactNode, type FC, HTMLAttributes, HTMLProps } from "react";

interface Props extends HTMLProps<HTMLAnchorElement> {
  children?: ReactNode;
}

const cls = (...args: Array<string | undefined>) => args.join(" ");

export const LinkButton: FC<Props> = ({ className, ...props }) => {
  return (
    <a
      className={cls(
        "border border-gray-200 transition-all w-fit bg-white py-4 px-6 rounded-xl text-xl flex items-center gap-4",
        className,
      )}
      {...props}
    />
  );
};
