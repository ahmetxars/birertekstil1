'use client'

import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { trackLeadClick } from '@/lib/analytics'

interface TrackedExternalLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode
  leadType?: 'whatsapp' | 'phone' | 'location'
  leadLabel?: string
}

export default function TrackedExternalLink({
  children,
  leadType,
  leadLabel,
  onClick,
  ...props
}: TrackedExternalLinkProps) {
  return (
    <a
      {...props}
      onClick={(event) => {
        if (leadType && leadLabel) {
          trackLeadClick(leadType, leadLabel)
        }
        onClick?.(event)
      }}
    >
      {children}
    </a>
  )
}
