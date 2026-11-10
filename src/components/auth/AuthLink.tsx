import React from 'react';
import { navigateTo } from '../../utils/authRoute';

interface AuthLinkProps {
  to: string;
  className?: string;
  children: React.ReactNode;
}

/** Normal <a> link (right-click / open-in-new-tab still work) that navigates without a page reload. */
export const AuthLink: React.FC<AuthLinkProps> = ({ to, className, children }) => (
  <a
    href={to}
    className={className}
    onClick={(e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      e.preventDefault();
      navigateTo(to);
    }}
  >
    {children}
  </a>
);
