import React from "react"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface InteractiveHoverButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string
}

const InteractiveHoverButton = React.forwardRef<HTMLButtonElement, InteractiveHoverButtonProps>(
  ({ text = "Button", className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "group relative cursor-pointer overflow-hidden rounded-full border border-white bg-gray-900 py-3 font-semibold text-white flex items-center justify-center",
          className,
        )}
        {...props}
      >
        {/* This span will hold the text and the arrow, and remain centered */}
        <span className="relative z-20 flex items-center justify-center gap-2 w-full">
          {/* Text */}
          <span className="flex-1 text-center">{text}</span>
          {/* Arrow on hover */}
          <ArrowRight className="h-4 w-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex-shrink-0" />
        </span>

        {/* The expanding background circle that changes to red, also serving as the initial red dot */}
        <div className="absolute left-[20%] top-[40%] h-2 w-2 scale-[1] rounded-lg bg-red-700 transition-all duration-300 group-hover:left-[0%] group-hover:top-[0%] group-hover:h-full group-hover:w-full group-hover:scale-[1.8] group-hover:bg-red-700"></div>
      </button>
    )
  },
)

InteractiveHoverButton.displayName = "InteractiveHoverButton"

export { InteractiveHoverButton }
