import React from 'react';
import dynamic from 'next/dynamic';
import MainLayout from '../src/layouts/MainLayout';

const ProgressDashboard = dynamic(() => import('../src/components/ProgressDashboard'), {
  ssr: false
});

export default function ProgressPage() {
  return (
    <MainLayout>
      <ProgressDashboard />
    </MainLayout>
  );
}
