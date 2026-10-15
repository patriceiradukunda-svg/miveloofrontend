"use client";
import { Component, type ReactNode } from 'react';
export class ErrorBoundary extends Component<{ children: ReactNode; label?: string }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (!this.state.failed) return this.props.children;
    return <div role="alert" className="rounded-2xl bg-red-tint p-6"><p className="font-bold">{this.props.label ?? 'This section'} could not be shown.</p><button type="button" className="mt-3 min-h-11 rounded-full border-2 border-red px-5 font-bold" onClick={() => this.setState({ failed: false })}>Try again</button></div>;
  }
}
