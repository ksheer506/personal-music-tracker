"use client"

import { useRef, useState } from "react";
import { PanelLeftIcon, UploadIcon, HistoryIcon } from "lucide-react";
import { LogOut } from "lucide-react";
import Link from "next/link";

const MIN_WIDTH = "55px"
const MAX_WIDTH = "250px"

const Drawer = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const container = useRef<HTMLDivElement>(null);

  return (
    <div
      style={{ width: isExpanded ? MAX_WIDTH : MIN_WIDTH }}
      className="relative flex-none transition-all duration-500"
      ref={container}
    >
      <div className="bg-gray-100 h-full w-full bottom-0 left-0 right-0 outline-none transition-all">
        <div className="px-2 py-7 bg-white w-full h-full">
          <div className="flex items-center gap-3 h-8 mb-5 overflow-hidden">
            <button
              /* size="2"
              variant="ghost" */
              style={{ margin: 0, padding: "0.4rem", borderRadius: "0.5rem" }}
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <PanelLeftIcon />
            </button>
            <span className="text-lg font-bold overflow-hidden text-ellipsis whitespace-nowrap">Music Tracker</span>
          </div>
          <div className="flex flex-col gap-2">
            <Link href="/">Home</Link>
            <Link href="/stats">Stats</Link>
            <Link href="/compare">Compare</Link>
            <Link href="/timeline">Timeline</Link>
            <Link href="/settings">Settings</Link>
          </div>
        </div>
      </div>
    </div>

  )
}

export default Drawer