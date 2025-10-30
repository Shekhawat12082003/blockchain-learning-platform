import React from 'react';
import dynamic from 'next/dynamic';
import MainLayout from '../src/layouts/MainLayout';

const VerifyCertificate = dynamic(() => import('../src/components/VerifyCertificate'), {
  ssr: false
});

export default function VerifyPage() {
  return (
    <MainLayout>
      <VerifyCertificate />
    </MainLayout>
  );
}
