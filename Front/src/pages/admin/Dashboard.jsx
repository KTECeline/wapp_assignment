import React, { useState } from 'react';
import { 
 XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Users, BookOpen, MessageSquare, TrendingUp, CheckCircle, ArrowUpRight, ArrowDownRight, BarChart3, Bell, Settings } from 'lucide-react';

const stats = [
  {
    title: 'Total Users',
    value: 3450,
    subtitle: 'Active pastry enthusiasts',
    icon: Users,
    change: '+12%',
    changeValue: '+382',
    trend: 'up'
  },
  {
    title: 'Active Courses',
    value: 28,
    subtitle: 'Baking adventures available',
    icon: BookOpen,
    change: '+10.7%',
    changeValue: '+3 courses',
    trend: 'up'
  },
  {
    title: 'Feedback Pending',
    value: 12,
    subtitle: 'Awaiting your attention',
    icon: MessageSquare,
    change: '-14.3%',
    changeValue: '-2 items',
    trend: 'down'
  },
  {
    title: 'Completion Rate',
    value: '87%',
    subtitle: 'Average course completion',
    icon: TrendingUp,
    change: '+5.2%',
    changeValue: '+4.5pts',
    trend: 'up'
  },
];

const enrollmentData = [
  { name: 'Jan', value: 120, previous: 95 },
  { name: 'Feb', value: 160, previous: 130 },
  { name: 'Mar', value: 200, previous: 165 },
  { name: 'Apr', value: 240, previous: 190 },
  { name: 'May', value: 220, previous: 200 },
  { name: 'Jun', value: 280, previous: 235 },
];

const recentActivity = [
  {
    id: 1,
    type: 'user',
    title: 'New user registered',
    description: 'pastrylover@example.com',
    time: '2 minutes ago',
    icon: Users,
    color: 'var(--accent)',
    bgColor: 'var(--surface)',
    badge: 'New'
  },
  {
    id: 2,
    type: 'course',
    title: 'Course updated',
    description: 'Art of Sourdough',
    time: '1 hour ago',
    icon: BookOpen,
    color: 'var(--accent)',
    bgColor: 'var(--surface)',
  },
  {
    id: 3,
    type: 'feedback',
    title: 'Feedback resolved',
    description: 'Video playback issue',
    time: '3 hours ago',
    icon: CheckCircle,
    color: 'var(--accent)',
    bgColor: 'var(--surface)',
    badge: 'Resolved'
  },
  {
    id: 4,
    type: 'user',
    title: 'Milestone achieved',
    description: '1000+ course completions',
    time: '5 hours ago',
    icon: TrendingUp,
    color: 'var(--accent)',
    bgColor: 'var(--surface)',
    badge: 'Milestone'
  },
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100">
        <p className="text-sm font-semibold text-gray-800">{payload[0].payload.name}</p>
        <p className="text-sm text-emerald-600 font-medium">Current: {payload[0].value}</p>
        {payload[1] && <p className="text-sm text-gray-400">Previous: {payload[1].value}</p>}
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const [hoveredStat, setHoveredStat] = useState(null);

  return (
  <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur border-b sticky top-0 z-10" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-500 mt-0.5">Welcome back! Here's what's happening today.</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-[var(--surface)] rounded-lg transition-colors relative">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2" style={{ backgroundColor: 'var(--accent)' }}></span>
              </button>
              <button className="p-2 hover:bg-[var(--surface)] rounded-lg transition-colors">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div
              key={stat.title}
              onMouseEnter={() => setHoveredStat(index)}
              onMouseLeave={() => setHoveredStat(null)}
              className="group relative bg-white rounded-2xl p-5 border transition-all duration-300 hover:shadow-md hover:-translate-y-1 cursor-pointer overflow-hidden"
              style={{ borderColor: 'var(--border)' }}
            >
              {/* Subtle surface hint */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300`} style={{ backgroundColor: 'transparent' }}></div>
              
              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-xl transition-transform duration-300 group-hover:scale-110" style={{ backgroundColor: 'var(--surface)' }}>
                    <stat.icon className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                  </div>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold`} style={{ backgroundColor: 'var(--surface)', color: 'var(--accent-dark)' }}>
                    {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {stat.change}
                  </div>
                </div>
                
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
                  <p className="text-3xl font-bold text-gray-900 tracking-tight">{typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}</p>
                  <p className="text-xs text-gray-400">{stat.subtitle}</p>
                  <p className="text-xs font-medium text-gray-600 mt-2">{stat.changeValue} vs last month</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts + Activity Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Enrollment Trend - Takes 2 columns */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border shadow-sm" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Enrollment Trend</h2>
                <p className="text-sm text-gray-500 mt-0.5">Comparing last 6 months performance</p>
              </div>
              <button className="px-3 py-1.5 text-sm font-medium text-[var(--accent-dark)] hover:bg-[var(--surface)] rounded-lg transition-colors flex items-center gap-1 border" style={{ borderColor: 'var(--border)' }}>
                <BarChart3 className="w-4 h-4" />
                View Report
              </button>
            </div>
            
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={enrollmentData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D9433B" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#D9433B" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPrevious" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d1d5db" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#d1d5db" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="name" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="previous" stroke="#d1d5db" strokeWidth={2} fill="url(#colorPrevious)" />
                <Area type="monotone" dataKey="value" stroke="#D9433B" strokeWidth={3} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl p-6 border shadow-sm" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
                <p className="text-sm text-gray-500 mt-0.5">Latest updates</p>
              </div>
            </div>
            
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="group flex items-start gap-3 p-3 rounded-xl transition-all duration-200 cursor-pointer border"
                  style={{ borderColor: 'transparent' }}
                >
                  <div className="p-2 rounded-lg group-hover:scale-110 transition-transform duration-200" style={{ backgroundColor: 'var(--surface)' }}>
                    <activity.icon className="w-4 h-4" style={{ color: activity.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-gray-900 truncate">{activity.title}</p>
                      {activity.badge && (
                        <span className="px-1.5 py-0.5 text-xs font-medium rounded border" style={{ backgroundColor: 'var(--surface)', color: 'var(--accent-dark)', borderColor: 'var(--border)' }}>
                          {activity.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 truncate">{activity.description}</p>
                    <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-6 border shadow-sm" style={{ borderColor: 'var(--border)' }}>
          <div className="mb-5">
            <h2 className="text-lg font-bold text-gray-900">Quick Actions</h2>
            <p className="text-sm text-gray-500 mt-0.5">Common administrative tasks at your fingertips</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: Users, label: 'Add User' },
              { icon: BookOpen, label: 'New Course' },
              { icon: MessageSquare, label: 'View Feedback' },
              { icon: BarChart3, label: 'Reports' },
            ].map((btn) => (
              <button
                key={btn.label}
                className="group relative p-5 rounded-xl bg-white border transition-all duration-300 hover:shadow-md hover:-translate-y-1 overflow-hidden hover:bg-[var(--surface)]"
                style={{ borderColor: 'var(--border)' }}
              >
                <div className="relative flex flex-col items-center gap-3">
                  <div className="p-3 rounded-xl group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: 'var(--surface)' }}>
                    <btn.icon className="w-6 h-6" style={{ color: 'var(--accent)' }} />
                  </div>
                  <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">{btn.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f3f4f6;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </div>
  );
}