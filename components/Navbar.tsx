"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, User, Leaf, Menu, X } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Главная" },
  { href: "/meal-plan", label: "Рацион" },
  { href: "/about", label: "О проекте" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: "rgba(10,10,10,0.85)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 24px",
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            textDecoration: "none",
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              background: "var(--green-neon)",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Leaf size={16} color="#0a0a0a" strokeWidth={2.5} />
          </div>
          <span
            className="font-display"
            style={{ fontSize: 22, color: "var(--white)", letterSpacing: "0.08em" }}
          >
            NUTRIFLOW
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav style={{ display: "flex", alignItems: "center", gap: 8 }} className="hidden md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="link-underline"
              style={{
                padding: "8px 16px",
                fontSize: 14,
                fontWeight: 400,
                color:
                  pathname === link.href ? "var(--green-neon)" : "var(--text-muted)",
                textDecoration: "none",
                transition: "color 0.2s",
                letterSpacing: "0.02em",
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <Link
            href="/cart"
            style={{
              width: 40,
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 8,
              color: pathname === "/cart" ? "var(--green-neon)" : "var(--text-muted)",
              textDecoration: "none",
              position: "relative",
              transition: "color 0.2s",
            }}
          >
            <ShoppingCart size={18} />
            <span
              style={{
                position: "absolute",
                top: 6,
                right: 6,
                width: 8,
                height: 8,
                background: "var(--green-neon)",
                borderRadius: "50%",
                border: "2px solid var(--black)",
              }}
            />
          </Link>
          <Link
            href="/profile"
            style={{
              width: 40,
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 8,
              color: pathname === "/profile" ? "var(--green-neon)" : "var(--text-muted)",
              textDecoration: "none",
              transition: "color 0.2s",
            }}
          >
            <User size={18} />
          </Link>

          {/* Mobile burger */}
          <button
            className="md:hidden"
            onClick={() => setOpen(!open)}
            style={{
              width: 40,
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "none",
              border: "none",
              color: "var(--white)",
              cursor: "pointer",
            }}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          className="md:hidden"
          style={{
            background: "rgba(10,10,10,0.98)",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            padding: "16px 24px 24px",
          }}
        >
          {[...navLinks, { href: "/cart", label: "Корзина" }, { href: "/profile", label: "Профиль" }].map(
            (link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                style={{
                  display: "block",
                  padding: "14px 0",
                  fontSize: 15,
                  color:
                    pathname === link.href ? "var(--green-neon)" : "var(--text-muted)",
                  textDecoration: "none",
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                  fontWeight: 400,
                }}
              >
                {link.label}
              </Link>
            )
          )}
        </div>
      )}
    </header>
  );
}
