import { UserButton } from '@clerk/clerk-react';
import { LayoutDashboard, Layers, GitBranch, HelpCircle, Settings, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function CustomUserButton() {
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <UserButton 
      afterSignOutUrl="/" 
      appearance={{ 
        variables: {
          colorPrimary: '#3b82f6',
        },
        elements: { 
          userButtonAvatarBox: "w-8 h-8 md:w-9 md:h-9 ring-2 ring-slate-100 dark:ring-zinc-800 hover:ring-blue-500/50 transition-all",
          userButtonPopoverCard: "bg-white/80 dark:bg-[#0f0f0f]/80 backdrop-blur-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-[0_16px_40px_rgb(0,0,0,0.1)] dark:shadow-[0_16px_40px_rgb(0,0,0,0.5)] rounded-2xl min-w-[260px]",
          userPreview: "px-6 py-5 border-b border-slate-200/50 dark:border-slate-800/50",
          userPreviewAvatarBox: "w-11 h-11 ring-2 ring-blue-500/20",
          userPreviewMainIdentifier: "font-display font-semibold text-slate-900 dark:text-white text-base tracking-tight mb-0.5",
          userPreviewSecondaryIdentifier: "text-slate-500 dark:text-slate-400 text-xs font-medium font-display",
          userButtonPopoverActions: "p-2 flex flex-col gap-0.5",
          userButtonPopoverActionButton: "hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 rounded-xl px-4 py-3",
          userButtonPopoverActionButtonText: "font-medium font-display text-slate-700 dark:text-slate-300 text-[15px] tracking-tight",
          userButtonPopoverActionButtonIconBox: "text-slate-400 dark:text-slate-500 flex items-center justify-center w-6 h-6",
          userButtonPopoverFooter: "hidden"
        } 
      }}
    >
      <UserButton.MenuItems>
        <UserButton.Action 
          label="manageAccount" 
          labelIcon={<Settings className="w-[18px] h-[18px]" />} 
        />
        <UserButton.Link 
          label="Dashboard" 
          labelIcon={<LayoutDashboard className="w-[18px] h-[18px]" />} 
          href="/dashboard" 
        />
        {isMobile && (
          <UserButton.Link 
            label="Models" 
            labelIcon={<Layers className="w-[18px] h-[18px]" />} 
            href="/models" 
          />
        )}
        {isMobile && (
          <UserButton.Link 
            label="Workflow" 
            labelIcon={<GitBranch className="w-[18px] h-[18px]" />} 
            href="/workflow" 
          />
        )}
        {isMobile && (
          <UserButton.Link 
            label="How it works" 
            labelIcon={<HelpCircle className="w-[18px] h-[18px]" />} 
            href="/how-it-works" 
          />
        )}
        <UserButton.Action 
          label="signOut" 
          labelIcon={<LogOut className="w-[18px] h-[18px]" />} 
        />
      </UserButton.MenuItems>
    </UserButton>
  );
}
