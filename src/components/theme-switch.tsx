"use client";

import { FC } from "react";
import React, { forwardRef } from "react";
import { VisuallyHidden } from "@react-aria/visually-hidden";
import { SwitchProps, useSwitch } from "@heroui/switch";
import { useTheme } from "next-themes";
import { useIsSSR } from "@react-aria/ssr";
import clsx from "clsx";
import { SunFilledIcon, MoonFilledIcon } from "@/components/icons";

export interface ThemeSwitchProps {
  className?: string;
  classNames?: SwitchProps["classNames"];
}

export const ThemeSwitch = forwardRef<HTMLButtonElement, ThemeSwitchProps>(
  ({ className, classNames }, ref) => {
    const { theme, setTheme } = useTheme();
    const isSSR = useIsSSR();

    const isLight = theme === "light" || isSSR;
    const nextTheme = isLight ? "dark" : "light";

    const onChange = () => setTheme(nextTheme);

    const {
      Component,
      slots,
      isSelected,
      getBaseProps,
      getInputProps,
      getWrapperProps,
    } = useSwitch({
      isSelected: isLight,
      "aria-label": `Switch to ${nextTheme} mode`,
      onChange,
    });

    return (
      <Component
        ref={ref}
        {...getBaseProps({
          className: clsx(
            "px-px transition-opacity hover:opacity-80 cursor-pointer",
            className,
            classNames?.base,
          ),
        })}
      >
        <VisuallyHidden>
          <input {...getInputProps()} />
        </VisuallyHidden>
        <div
          {...getWrapperProps()}
          className={slots.wrapper({
            class: clsx(
              [
                "w-auto h-auto",
                "bg-transparent",
                "rounded-lg",
                "flex items-center justify-center",
                "group-data-[selected=true]:bg-transparent",
                "!text-default-500",
                "pt-px",
                "px-0",
                "mx-0",
              ],
              classNames?.wrapper,
            ),
          })}
        >
          {isLight ? <SunFilledIcon size={22} /> : <MoonFilledIcon size={22} />}
        </div>
      </Component>
    );
  },
);

export function toggleTheme(currentTheme: string, setTheme: (theme: string) => void) {
  const nextTheme = currentTheme === "light" ? "dark" : "light";
  setTheme(nextTheme);
}
