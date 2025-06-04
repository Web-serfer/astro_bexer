// src/env.d.ts
/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    user: {
      id: string;
      email: string;
      name: string | null;
    } | null;
    session: {
      id: string;
      expiresAt: Date;
    } | null;
  }
}
