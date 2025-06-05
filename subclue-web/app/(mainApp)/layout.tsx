// app/(mainApp)/layout.tsx
import React from 'react';
import Header from '@/components/Header'; // Seu Header global
import Footer from '@/components/Footer';   // Seu Footer global

export default function MainAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log('[MainAppLayout] Rendering layout for (mainApp) group routes...');
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
