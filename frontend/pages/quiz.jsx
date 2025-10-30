import React from 'react';
import dynamic from 'next/dynamic';
import MainLayout from '../src/layouts/MainLayout';

const QuizInterface = dynamic(() => import('../src/components/QuizInterface'), {
  ssr: false
});

export default function QuizPage() {
  return (
    <MainLayout>
      <QuizInterface />
    </MainLayout>
  );
}
