import React from 'react';
import dynamic from 'next/dynamic';
import MainLayout from '../src/layouts/MainLayout';

const StudyPlanner = dynamic(() => import('../src/components/StudyPlanner'), {
  ssr: false
});

export default function StudyPlanPage() {
  return (
    <MainLayout>
      <StudyPlanner />
    </MainLayout>
  );
}
