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
    <aside className="w-64 min-h-screen flex flex-col p-5" style={{background: 'rgba(12, 18, 38, 0.9)', borderRight: '1px solid rgba(100, 120, 180, 0.15)'}}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          🎓 AI Tutor
        </h1>
        <p className="text-sm mt-1" style={{color: 'rgba(232, 234, 246, 0.6)'}}>Blockchain Learning</p>
      </div>
      
      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => (
          <Link key={item.path} href={item.path} className={`sidebar-link ${router.pathname === item.path ? 'active' : ''}`}>
            <span className="text-xl">{item.icon}</span>
            <span className="text-sm">{item.label}</span>
          </Link>
        ))}
      </nav>
      
      <div className="mt-auto pt-5" style={{borderTop: '1px solid rgba(100, 120, 180, 0.15)'}}>
        <p className="text-xs text-center" style={{color: 'rgba(232, 234, 246, 0.5)'}}>
          Powered by Core Blockchain
        </p>
      </div>
    </aside>
  );
}

export default function MainLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <nav className="px-6 py-3" style={{background: 'rgba(12, 18, 38, 0.5)', borderBottom: '1px solid rgba(100, 120, 180, 0.15)'}}>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm" style={{color: 'rgba(232, 234, 246, 0.7)'}}>Learn anything with AI-powered tutoring</span>
            </div>
            <ConnectWallet />
          </div>
        </nav>
        
        <main className="flex-1 p-6 overflow-auto">{children}</main>
        
        <footer className="px-6 py-3" style={{background: 'rgba(12, 18, 38, 0.5)', borderTop: '1px solid rgba(100, 120, 180, 0.15)'}}>
          <p className="text-xs text-center" style={{color: 'rgba(232, 234, 246, 0.5)'}}>
            Smart Contract: 0xF5689...6322 • Core Testnet2
          </p>
        </footer>
      </div>
    </div>
  );
}
