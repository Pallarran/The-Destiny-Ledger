import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {}

const Panel = forwardRef<HTMLDivElement, PanelProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('panel', className)}
        {...props}
      />
    )
  }
)
Panel.displayName = 'Panel'

export { Panel }