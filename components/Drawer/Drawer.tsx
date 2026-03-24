"use client"

import { useState } from "react";
import { PanelLeftIcon } from "lucide-react";
import Link from "next/link";
import { MOTION_TOKENS } from "@lib/design/tokens";

const MIN_WIDTH = "55px";
const MAX_WIDTH = "250px";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/stats", label: "Stats" },
  { href: "/compare", label: "Compare" },
  { href: "/timeline", label: "Timeline" },
  { href: "/settings", label: "Settings" },
];

const Drawer = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleDrawer = () => setIsExpanded((prev) => !prev);
  const closeDrawer = () => setIsExpanded(false);

  const mobileTransitionStyle = {
    transitionDuration: `${MOTION_TOKENS.slideMs}ms`,
    transitionTimingFunction: MOTION_TOKENS.easeStandard,
  };

  return (
    <>
      <div
        style={{ width: isExpanded ? MAX_WIDTH : MIN_WIDTH }}
        className="hidden md:relative md:flex-none md:block md:transition-all md:duration-500"
      >
        <div className="bg-gray-100 h-full w-full bottom-0 left-0 right-0 outline-none transition-all">
          <div className="px-2 py-7 bg-white w-full h-dvh">
            <div className="flex items-center gap-3 h-8 mb-5 overflow-hidden">
              <button
                style={{ margin: 0, padding: "0.4rem", borderRadius: "0.5rem" }}
                onClick={toggleDrawer}
                aria-label={isExpanded ? "서랍 닫기" : "서랍 열기"}
              >
                <PanelLeftIcon />
              </button>
              <span className="text-lg font-bold overflow-hidden text-ellipsis whitespace-nowrap">Music Tracker</span>
            </div>
            <div className="flex flex-col gap-2">
              {NAV_LINKS.map((link) => (
                <Link key={link.href} href={link.href}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div
        style={{ height: MIN_WIDTH }}
        className="md:hidden flex-none sticky top-0 z-40 bg-white border-b border-gray-200"
      >
        <div className="h-full px-4 py-3 flex items-center gap-3">
          <button
            style={{ margin: 0, padding: "0.4rem", borderRadius: "0.5rem" }}
            onClick={toggleDrawer}
            aria-label={isExpanded ? "서랍 닫기" : "서랍 열기"}
          >
            <PanelLeftIcon />
          </button>
          <span className="text-lg font-bold">Music Tracker</span>
        </div>
      </div>

      <button
        className={`md:hidden fixed inset-0 z-40 bg-black transition-opacity ${isExpanded ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        style={{
          ...mobileTransitionStyle,
          opacity: isExpanded ? MOTION_TOKENS.drawerOverlayOpacity : 0,
        }}
        onClick={closeDrawer}
        aria-label="서랍 닫기"
      />
      <div
        className={`md:hidden fixed top-0 left-0 z-50 h-dvh w-[250px] bg-white px-4 py-6 shadow-xl transition-transform ${isExpanded ? "translate-x-0 pointer-events-auto" : "-translate-x-full pointer-events-none"}`}
        style={mobileTransitionStyle}
      >
        <div className="flex items-center gap-3 h-8 mb-5">
          <button
            style={{ margin: 0, padding: "0.4rem", borderRadius: "0.5rem" }}
            onClick={closeDrawer}
            aria-label="서랍 닫기"
          >
            <PanelLeftIcon />
          </button>
          <span className="text-lg font-bold">Music Tracker</span>
        </div>
        <div className="flex flex-col gap-2">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} onClick={closeDrawer}>
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </>

  );
};

export default Drawer