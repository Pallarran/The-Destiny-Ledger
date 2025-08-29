import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface SectionTitleProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  subtitle?: string
}

const SectionTitle = forwardRef<HTMLDivElement, SectionTitleProps>(
  ({ className, title, subtitle, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'relative flex items-center py-4 px-6',
          'bg-bg text-panel border-b border-gold/20',
          className
        )}
        {...props}
      >
        <div className="flex-1">
          <h2 className="font-serif text-lg font-semibold text-panel">
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm text-panel/70 mt-1">
              {subtitle}
            </p>
          )}
        </div>
        
        {/* Thin gold divider */}
        <div className="absolute bottom-0 left-6 right-6 h-px bg-gold/30" />
      </div>
    )
  }
)
SectionTitle.displayName = 'SectionTitle'

export { SectionTitle }