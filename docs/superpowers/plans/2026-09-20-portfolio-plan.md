# Portfolio Kreatif — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Membangun landing page portfolio kreatif multi halaman dengan Next.js, Tailwind CSS, Firebase, dan deploy ke Vercel.

**Architecture:** Proyek akan menggunakan Next.js App Router, Tailwind CSS untuk styling feminin/pastel, Firebase Firestore untuk data profil dan testimoni, serta Firebase Storage untuk upload foto karya desain dan bunga kawat bulu.

**Tech Stack:** Next.js 14, React 18, Tailwind CSS, Firebase (Firestore + Storage), Vercel.

**Spec:** docs/superpowers/specs/2026-09-20-portfolio-design.md

## Global Constraints
- Semua foto karya disimpan di Firebase Storage.
- Database menggunakan Firebase Firestore (koleksi: profiles, skills, projects, testimonials).
- Warna utama: Cream (#FDF6F0), Soft Pink (#F4C2C2), Beige (#EDE3D5), Dark Brown (#4A3F35).
- Struktur multi halaman: Home, About, Skills, Portfolio, Projects, Testimonials, Contact, Download.
- Deploy target: Vercel.
---
