import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import ConnectWallet from '../components/ConnectWallet';

function Sidebar() {
  const router = useRouter();
  const menuItems = [
    { path: '/', icon: '💬', label: 'AI Chat' },
    { path: '/quiz', icon: '📝', label: 'Quiz' },
    { path: '/explain', icon: '💡', label: 'Concept Explainer' },
    { path: '/study-plan', icon: '📚', label: 'Study Planner' },
    { path: '/progress', icon: '📊', label: 'Progress' },
    { path: '/gallery', icon: '🖼️', label: 'Certificates' },
    { path: '/leaderboard', icon: '🏆', label: 'Leaderboard' },
    { path: '/verify', icon: '✓', label: 'Verify Certificate' },
  ];
  
  return (
    <aside className="w-72 glass min-h-screen flex flex-col p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold gradient-text flex items-center gap-2">
          🎓 AI Tutor
        </h1>
        <p className="text-white/70 text-sm mt-1">Web3 Learning</p>
      </div>
      
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <Link key={item.path} href={item.path} className={`sidebar-link ${router.pathname === item.path ? 'active' : ''}`}>
            <span className="text-2xl">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>
      
      <div className="mt-auto pt-6 border-t border-white/10">
        <p className="text-xs text-white/50 text-center">Built with AI & Blockchain</p>
      </div>
    </aside>
  );
}

export default function MainLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <nav className="glass border-b border-white/10 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-white/70 text-sm">Personalized Learning Platform</span>
            </div>
            <ConnectWallet />
          </div>
        </nav>
        
        <main className="flex-1 p-8 overflow-auto">{children}</main>
        
        <footer className="glass border-t border-white/10 px-8 py-4">
          <p className="text-xs text-white/50 text-center">
            Contract: 0xF5689A0B960b9fED8D40422676B580FD10Ed6322 on Core Testnet2
          </p>
        </footer>
      </div>
    </div>
  );
}
