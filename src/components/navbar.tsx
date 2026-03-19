"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import * as React from "react";

export const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      {/* Navbar */}
      <nav className="sticky top-0 z-50 h-14 w-full border-b border-border-primary bg-bg-input">
        <div className="flex h-full items-center justify-between px-4 sm:px-6 md:px-10">
          {/* Logo */}
          <Link href="/home" className="flex items-center gap-2">
            <span className="font-mono text-xl font-bold text-accent-green">&gt;</span>
            <span className="font-mono text-lg font-medium text-text-primary">devroast</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-8">
            <Link
              href="/leaderboard"
              className="font-mono text-sm text-text-secondary transition-colors hover:text-text-primary"
            >
              leaderboard
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex md:hidden items-center justify-center w-10 h-10 text-text-primary hover:text-text-secondary transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="fixed inset-0 top-14 z-40 bg-bg-input md:hidden">
          <div className="flex flex-col gap-4 border-b border-border-primary p-4">
            <Link
              href="/leaderboard"
              className="font-mono text-sm text-text-secondary hover:text-text-primary"
              onClick={() => setIsOpen(false)}
            >
              leaderboard
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

Navbar.displayName = "Navbar";
