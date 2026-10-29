'use client';
import { useSelectedLayoutSegment } from 'next/navigation';
import type { ReactNode } from 'react';
import { ErrorBoundary } from '@/components/feedback/ErrorBoundary';
import type { WsGroup } from '@/config/workspace-groups';
import { ModernShell, type ModernProps } from './ModernShell';

type Shared = Omit<ModernProps, 'groups' | 'children'>;
/** School and supplier get the new frame; every other workspace keeps the classic one. The segment updates on every navigation. */
export function ShellSwitch({ classicHeader, classicSidebar, schoolGroups, supplierGroups, children, ...shared }:
  Shared & { classicHeader: ReactNode; classicSidebar: ReactNode; schoolGroups: WsGroup[]; supplierGroups: WsGroup[]; children: ReactNode }) {
  const seg = useSelectedLayoutSegment();
  const groups = seg === 'school' ? schoolGroups : seg === 'supplier' ? supplierGroups : [];
  if (groups.length) return <ModernShell {...shared} groups={groups}>{children}</ModernShell>;
  return (
    <div className="min-h-screen">{classicHeader}
      <div className="lg:flex">{classicSidebar}
        <main id="main" tabIndex={-1} className="min-w-0 flex-1 p-4 sm:p-8"><ErrorBoundary>{children}</ErrorBoundary></main></div></div>
  );
}
