import React from 'react';
import dynamic from 'next/dynamic';
import MainLayout from '../src/layouts/MainLayout';

const Leaderboard = dynamic(() => import('../src/components/Leaderboard'), {
  ssr: false
});

export default function LeaderboardPage() {
  return (
    <MainLayout>
      <Leaderboard />
    </MainLayout>
  );
}
