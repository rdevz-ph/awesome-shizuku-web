"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Download, Sun, Moon, ExternalLink, Menu, X } from "lucide-react";
import { GithubIcon } from "./Icons";
import { useTheme } from "./ThemeProvider";

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs tracking-wider">
            S
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm tracking-tight text-foreground">
              ShizuPortal
            </span>
            <span className="hidden sm:inline-flex items-center rounded bg-muted/50 px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
              Catalog
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium">
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            All Apps
          </Link>
          <a
            href="https://shizuku.rikka.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
          >
            <span>About Shizuku</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>
          <a
            href="https://github.com/timschneeb/awesome-shizuku"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
          >
            <GithubIcon className="w-3.5 h-3.5" />
            <span>awesome-shizuku</span>
          </a>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="h-8 w-8 rounded-md bg-muted/40 flex items-center justify-center text-foreground hover:bg-muted transition-colors"
          >
            {theme === "dark" ? (
              <Sun className="w-3.5 h-3.5 text-foreground" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-foreground" />
            )}
          </button>

          {/* Download ShizuStore */}
          <a
            href="https://github.com/timschneeb/ShizuStore/releases/latest"
            target="_blank"
            rel="noopener noreferrer"
            className="h-8 hidden sm:inline-flex items-center gap-1.5 px-3 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Get ShizuStore</span>
          </a>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="md:hidden h-8 w-8 rounded-md bg-muted/40 flex items-center justify-center text-foreground hover:bg-muted transition-colors"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/40 bg-background px-4 py-3 space-y-2.5">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-xs font-medium text-muted-foreground hover:text-foreground py-1"
          >
            All Apps
          </Link>
          <a
            href="https://shizuku.rikka.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between text-xs font-medium text-muted-foreground hover:text-foreground py-1"
          >
            <span>About Shizuku</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>
          <a
            href="https://github.com/timschneeb/awesome-shizuku"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between text-xs font-medium text-muted-foreground hover:text-foreground py-1"
          >
            <span>awesome-shizuku upstream</span>
            <GithubIcon className="w-3.5 h-3.5" />
          </a>
          <div className="pt-2">
            <a
              href="https://github.com/timschneeb/ShizuStore/releases/latest"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-1.5 h-8 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity"
            >
              <Download className="w-3.5 h-3.5" />
              Download ShizuStore APK
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
