import { ReactNode } from "react";
import { MOTION_TOKENS } from "@/lib/design/tokens";

interface HoverCardProps {
  children: ReactNode;
}

const HoverCard = ({ children }: HoverCardProps) => {
  return (
    <article className={`rounded-md border border-slate-200 bg-white p-4 transition-all duration-${MOTION_TOKENS.hoverMs} ease-out hover:scale-[1.01] dark:border-slate-700 dark:bg-slate-900 hover:shadow-md`}>
      {children}
    </article>
  )
}

export default HoverCard