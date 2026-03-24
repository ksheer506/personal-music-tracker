import { ReactNode } from "react";
import { MOTION_TOKENS } from "@/lib/design/tokens";
import { cn } from "@/lib/utils";

interface HoverCardProps {
  children: ReactNode;
}

interface SimpleCardProps {
  children: ReactNode;
  className?: string;
}

const BASE_CARD_CLASSNAME = "rounded-md border border-slate-200 bg-white";

const SimpleCard = ({ children, className = "" }: SimpleCardProps) => {
  const hasPadding = className.match(/\bp(x|y|s|e|t|r|b|l)?-/);

  return (
    <article className={cn(BASE_CARD_CLASSNAME, hasPadding ? "" : "p-4", className)}>
      {children}
    </article>
  )
}

const HoverCard = ({ children }: HoverCardProps) => {
  return (
    <SimpleCard className={`transition-all duration-${MOTION_TOKENS.hoverMs} ease-out hover:scale-[1.01] dark:border-slate-700 dark:bg-slate-900 hover:shadow-md`}>
      {children}
    </SimpleCard>
  )
}

const Card = Object.assign(SimpleCard, {
  Hover: HoverCard,
})

export default Card