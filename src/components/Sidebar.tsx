import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  BrainCircuit, 
  Settings, 
  LogOut,
  GraduationCap
} from 'lucide-react';
import { User } from '../types';
import { supabase } from '../lib/supabase';
import { cn } from '../lib/utils';

interface SidebarProps {
  profile: User | null;
}

export default function Sidebar({ profile }: SidebarProps) {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', role: ['admin', 'center', 'teacher', 'parent'] },
    { icon: BookOpen, label: 'Books & Content', role: ['admin', 'center', 'teacher'] },
    { icon: BrainCircuit, label: 'AI Insights', role: ['admin', 'teacher', 'parent'] },
    { icon: Users, label: 'Students', role: ['admin', 'center', 'teacher'] },
    { icon: Settings, label: 'Settings', role: ['admin', 'center', 'teacher', 'parent'] },
  ];

  const filteredMenu = menuItems.filter(item => 
    !profile || item.role.includes(profile.role)
  );

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="flex h-screen w-64 flex-col bg-white border-r border-gray-200">
      <div className="flex h-20 items-center px-6 border-b border-gray-100">
        <GraduationCap className="h-8 w-8 text-blue-600" />
        <span className="ml-3 text-xl font-bold text-gray-900">EduFlow</span>
      </div>

      <nav className="flex-1 space-y-1 px-4 py-6">
        {filteredMenu.map((item) => (
          <button
            key={item.label}
            className={cn(
              "group flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              item.label === 'Dashboard' 
                ? "bg-blue-50 text-blue-700" 
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            )}
          >
            <item.icon className={cn(
              "mr-3 h-5 w-5",
              item.label === 'Dashboard' ? "text-blue-600" : "text-gray-400 group-hover:text-gray-500"
            )} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center px-2 py-3">
          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
            {profile?.username?.[0].toUpperCase() || 'U'}
          </div>
          <div className="ml-3 min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-gray-900">{profile?.username || 'User'}</p>
            <p className="truncate text-xs text-gray-500 capitalize">{profile?.role || 'Guest'}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="mt-2 flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );
}
