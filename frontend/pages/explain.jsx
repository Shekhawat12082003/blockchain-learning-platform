import React from 'react';
import dynamic from 'next/dynamic';
import MainLayout from '../src/layouts/MainLayout';

const ConceptExplainer = dynamic(() => import('../src/components/ConceptExplainer'), {
  ssr: false
});

export default function ExplainPage() {
  return (
    <MainLayout>
      <ConceptExplainer />
    </MainLayout>
  );
}
