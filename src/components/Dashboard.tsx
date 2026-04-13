import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { User } from '../types';
import { 
  TrendingUp, 
  AlertTriangle, 
  BookCheck, 
  Users,
  ArrowRight,
  BrainCircuit
} from 'lucide-react';
import { motion } from 'motion/react';
import AIFeatures from './AIFeatures';
import { cn } from '../lib/utils';

interface DashboardProps {
  profile: User | null;
}

export default function Dashboard({ profile }: DashboardProps) {
  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats', profile?.role],
    queryFn: async () => {
      // Mock stats for now, in real app we'd fetch from Supabase
      return {
        totalStudents: 124,
        averageScore: 78,
        atRiskStudents: 5,
        completedLessons: 42
      };
    }
  });

  const renderRoleDashboard = () => {
    switch (profile?.role) {
      case 'admin':
        return <AdminDashboard stats={stats} />;
      case 'teacher':
        return <TeacherDashboard stats={stats} />;
      case 'parent':
        return <ParentDashboard stats={stats} />;
      default:
        return <div className="text-center py-20 text-gray-500">Welcome to EduFlow Extension</div>;
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {profile?.username || 'User'}
        </h1>
        <p className="text-gray-500">Here's what's happening in your {profile?.role} dashboard.</p>
      </header>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          icon={Users} 
          label="Total Students" 
          value={stats?.totalStudents || 0} 
          color="bg-blue-500" 
        />
        <StatCard 
          icon={TrendingUp} 
          label="Avg. Performance" 
          value={`${stats?.averageScore || 0}%`} 
          color="bg-green-500" 
        />
        <StatCard 
          icon={AlertTriangle} 
          label="At Risk" 
          value={stats?.atRiskStudents || 0} 
          color="bg-red-500" 
        />
        <StatCard 
          icon={BookCheck} 
          label="Lessons Completed" 
          value={stats?.completedLessons || 0} 
          color="bg-purple-500" 
        />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <AIFeatures role={profile?.role} />
        </div>
        <div className="space-y-6">
          <RecentActivity />
          <UpcomingTasks />
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: any) {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="rounded-xl bg-white p-6 shadow-sm border border-gray-100"
    >
      <div className="flex items-center">
        <div className={cn("rounded-lg p-3 text-white", color)}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </motion.div>
  );
}

function AdminDashboard({ stats }: any) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">System Overview</h2>
      {/* Admin specific widgets */}
    </div>
  );
}

function TeacherDashboard({ stats }: any) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Class Performance</h2>
      {/* Teacher specific widgets */}
    </div>
  );
}

function ParentDashboard({ stats }: any) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Child Progress</h2>
      {/* Parent specific widgets */}
    </div>
  );
}

function RecentActivity() {
  const activities = [
    { id: 1, text: 'New test results for Grade 5 Math', time: '2h ago' },
    { id: 2, text: 'AI generated lesson plan for Chapter 4', time: '4h ago' },
    { id: 3, text: '3 students identified as at-risk', time: '1d ago' },
  ];

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map(activity => (
          <div key={activity.id} className="flex items-start space-x-3">
            <div className="mt-1 h-2 w-2 rounded-full bg-blue-500" />
            <div>
              <p className="text-sm text-gray-700">{activity.text}</p>
              <p className="text-xs text-gray-500">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function UpcomingTasks() {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Upcoming Tasks</h3>
        <button className="text-blue-600 hover:text-blue-700">
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
          <span className="text-sm font-medium">Grade Math Quiz</span>
          <span className="text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-700">Due Today</span>
        </div>
        <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
          <span className="text-sm font-medium">Parent Meeting</span>
          <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700">Tomorrow</span>
        </div>
      </div>
    </div>
  );
}


