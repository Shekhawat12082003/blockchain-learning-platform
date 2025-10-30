import React from 'react';
import dynamic from 'next/dynamic';
import MainLayout from '../src/layouts/MainLayout';

const CertificateGallery = dynamic(() => import('../src/components/CertificateGallery'), {
  ssr: false
});

export default function GalleryPage() {
  return (
    <MainLayout>
      <CertificateGallery />
    </MainLayout>
  );
}
