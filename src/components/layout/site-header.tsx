"use client";

import { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { StartAnalysisButton } from "@/components/ui/start-analysis-button";
import { CloseIcon, MenuIcon } from "@/components/ui/icons";
import { usePlaceholderToast } from "@/components/ui/placeholder-toast";

const navItems = [
  { label: "产品功能", href: "/#features" },
  { label: "使用流程", href: "/#steps" },
  { label: "为什么选择我们", href: "/#why" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const notify = usePlaceholderToast();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-6">
        <Logo />

        <nav className="hidden items-center gap-8 md:flex" aria-label="主导航">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() =>
              notify({
                title: "账号体系尚未开放",
                description: "当前为首页演示版本，登录与注册功能将在后续版本上线。",
              })
            }
            className="hidden h-9 items-center rounded-full px-4 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 sm:inline-flex"
          >
            登录
          </button>
          <StartAnalysisButton size="sm" withArrow={false} className="hidden sm:inline-flex">
            免费试用
          </StartAnalysisButton>

          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="grid size-10 place-items-center rounded-xl text-slate-700 transition-colors hover:bg-slate-100 md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "关闭菜单" : "打开菜单"}
          >
            {open ? <CloseIcon className="size-5" /> : <MenuIcon className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div id="mobile-menu" className="border-t border-slate-200/70 bg-white md:hidden">
          <nav className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-5 py-4" aria-label="移动端导航">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
              >
                {item.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                notify({
                  title: "账号体系尚未开放",
                  description: "当前为首页演示版本，登录与注册功能将在后续版本上线。",
                });
              }}
              className="rounded-xl px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              登录
            </button>
            <StartAnalysisButton className="mt-2 w-full" size="md" />
          </nav>
        </div>
      )}
    </header>
  );
}
