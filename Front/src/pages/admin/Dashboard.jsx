import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
 XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Users, BookOpen, MessageSquare, TrendingUp, ArrowUpRight, ArrowDownRight, BarChart3 } from 'lucide-react';

// initial placeholder while loading real data from server
const initialStats = [
  { title: 'Total Users', value: 0, subtitle: 'Active pastry enthusiasts', icon: Users, change: '', changeValue: '', trend: 'up' },
  { title: 'Active Courses', value: 0, subtitle: 'Baking adventures available', icon: BookOpen, change: '', changeValue: '', trend: 'up' },
  { title: 'Feedback Pending', value: 0, subtitle: 'Awaiting your attention', icon: MessageSquare, change: '', changeValue: '', trend: 'down' },
  { title: 'Completion Rate', value: '0%', subtitle: 'Average course completion', icon: TrendingUp, change: '', changeValue: '', trend: 'up' }
];

// enrollmentData will be loaded from reports; start empty while loading
const defaultEnrollment = [
  { name: 'Jan', value: 0, previous: 0 },
  { name: 'Feb', value: 0, previous: 0 },
  { name: 'Mar', value: 0, previous: 0 },
  { name: 'Apr', value: 0, previous: 0 },
  { name: 'May', value: 0, previous: 0 },
  { name: 'Jun', value: 0, previous: 0 },
];

// recent activity will be pulled from feedbacks (fallback to empty)

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
  const navigate = useNavigate();
  const [hoveredStat, setHoveredStat] = useState(null);

  const [stats, setStats] = useState(initialStats);
  const [enrollmentDataState, setEnrollmentDataState] = useState(defaultEnrollment);
  const [recentActivityState, setRecentActivityState] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [usersRes, coursesRes, feedbacksRes, completionRes, usersGrowth] = await Promise.all([
          fetch('/api/Users').then(r => r.ok ? r.json() : []),
          fetch('/api/Courses').then(r => r.ok ? r.json() : []),
          fetch('/api/UserFeedbacks').then(r => r.ok ? r.json() : []),
          fetch('/api/Reports/CompletionRate?months=1').then(r => r.ok ? r.json() : []),
          fetch('/api/Reports/UsersGrowth?weeks=6').then(r => r.ok ? r.json() : [])
        ]);

        const totalUsers = Array.isArray(usersRes) ? usersRes.length : 0;
        const activeCourses = Array.isArray(coursesRes) ? coursesRes.length : 0;
        const feedbackPending = Array.isArray(feedbacksRes) ? feedbacksRes.length : 0;
        const completionVal = Array.isArray(completionRes) && completionRes.length ? completionRes[completionRes.length - 1].value : 0;

        setStats([
          { title: 'Total Users', value: totalUsers, subtitle: 'Active pastry enthusiasts', icon: Users, change: '', changeValue: '', trend: 'up' },
          { title: 'Active Courses', value: activeCourses, subtitle: 'Baking adventures available', icon: BookOpen, change: '', changeValue: '', trend: 'up' },
          { title: 'Feedback Pending', value: feedbackPending, subtitle: 'Awaiting your attention', icon: MessageSquare, change: '', changeValue: '', trend: 'down' },
          { title: 'Completion Rate', value: `${completionVal}%`, subtitle: 'Average course completion', icon: TrendingUp, change: '', changeValue: '', trend: 'up' }
        ]);

        // usersGrowth -> map to enrollmentDataState (use value + previous placeholder)
        if (Array.isArray(usersGrowth) && usersGrowth.length > 0) {
          // Map weeks to chart points; create previous as zero for now
          const mapped = usersGrowth.map((g, idx) => ({ name: g.name || `W${idx+1}`, value: g.value || 0, previous: 0 }));
          setEnrollmentDataState(mapped.length ? mapped : defaultEnrollment);
        }

        // Recent activity: use latest feedbacks as activity entries
        if (Array.isArray(feedbacksRes)) {
          const recent = feedbacksRes.slice(0, 8).map((f) => ({
            id: f.id || f.feedbackId || f.FeedbackId,
            type: 'feedback',
            title: f.title || (f.courseTitle ? `Feedback on ${f.courseTitle}` : 'User feedback'),
            description: `${f.userName || f.userEmail || ''}${f.courseTitle ? ' — ' + f.courseTitle : ''}`,
            time: f.createdAt ? new Date(f.createdAt).toLocaleString() : '',
            icon: MessageSquare,
            color: 'var(--accent)',
            bgColor: 'var(--surface)',
            badge: ''
          }));
          setRecentActivityState(recent);
        }
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      }
    };
    load();
  }, []);

  return (
  <div className="min-h-screen">

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
              <AreaChart data={enrollmentDataState}>
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
                {recentActivityState.map((activity) => (
                  <div
                    key={activity.id}
                    className="group flex items-start gap-3 p-3 rounded-xl transition-all duration-200 cursor-pointer border"
                    style={{ borderColor: 'transparent' }}
                    onClick={() => {
                      // navigate to feedback detail if id present
                      if (activity.type === 'feedback' && activity.id) navigate(`/admin/feedback`);
                    }}
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
              { icon: Users, label: 'Add User', onClick: () => navigate('/admin/users') },
              { icon: BookOpen, label: 'New Course', onClick: () => navigate('/admin/courses/edit', { state: { mode: 'create' } }) },
              { icon: MessageSquare, label: 'View Feedback', onClick: () => navigate('/admin/feedback') },
              { icon: BarChart3, label: 'Reports', onClick: () => navigate('/admin/reports') },
            ].map((btn) => (
              <button
                key={btn.label}
                onClick={btn.onClick}
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