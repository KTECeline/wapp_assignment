import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
 XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Users, BookOpen, MessageSquare, TrendingUp, ArrowUpRight, ArrowDownRight, BarChart3 } from 'lucide-react';

// initial placeholder while loading real data from server
const initialStats = [
  { title: 'Total Users', value: 0, subtitle: 'Active pastry enthusiasts', icon: Users, change: '', changeValue: '', trend: 'up' },
  { title: 'Active Courses', value: 0, subtitle: 'Baking adventures available', icon: BookOpen, change: '', changeValue: '', trend: 'up' },
  { title: 'Feedback', value: 0, subtitle: 'Feedbacks submitted', icon: MessageSquare, change: '', changeValue: '', trend: 'down' },
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
        <p className="text-sm text-emerald-600 font-medium">Current: {payload[1].value}</p>
        
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [hoveredStat, setHoveredStat] = useState(null);
  const [enrollmentPeriod, setEnrollmentPeriod] = useState('week'); // 'week', 'month', 'year'

  const [stats, setStats] = useState(initialStats);
  const [enrollmentDataState, setEnrollmentDataState] = useState(defaultEnrollment);
  const [recentActivityState, setRecentActivityState] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        // Determine API parameters based on selected period
        let growthEndpoint = '/api/Reports/UsersGrowth?weeks=6';
        if (enrollmentPeriod === 'month') {
          growthEndpoint = '/api/Reports/UsersGrowth?months=12';
        } else if (enrollmentPeriod === 'year') {
          growthEndpoint = '/api/Reports/UsersGrowth?years=5';
        }

        const [usersRes, coursesRes, feedbacksRes, completionRes, usersGrowth, courseActivitiesRes, postsRes] = await Promise.all([
          fetch('/api/Users').then(r => r.ok ? r.json() : []),
          fetch('/api/Courses').then(r => r.ok ? r.json() : []),
          fetch('/api/UserFeedbacks').then(r => r.ok ? r.json() : []),
          fetch('/api/Reports/CompletionRate?months=1').then(r => r.ok ? r.json() : []),
          fetch(growthEndpoint).then(r => r.ok ? r.json() : []),
          fetch('/api/CourseUserActivities/all').then(r => r.ok ? r.json() : []),
          fetch('/api/UserPosts').then(r => r.ok ? r.json() : [])
        ]);

        const totalUsers = Array.isArray(usersRes) ? usersRes.length : 0;
        const activeCourses = Array.isArray(coursesRes) ? coursesRes.length : 0;
        const feedbackPending = Array.isArray(feedbacksRes) ? feedbacksRes.length : 0;
        const completionVal = Array.isArray(completionRes) && completionRes.length ? completionRes[completionRes.length - 1].value : 0;

        // Calculate enrollment trend from usersGrowth data
        let enrollmentTrend = 'up';
        let enrollmentChange = '';
        let enrollmentChangeValue = '';
        
        if (Array.isArray(usersGrowth) && usersGrowth.length >= 2) {
          const current = usersGrowth[usersGrowth.length - 1].value || 0;
          const previous = usersGrowth[usersGrowth.length - 2].value || 0;
          
          if (previous > 0) {
            const percentChange = ((current - previous) / previous) * 100;
            enrollmentTrend = percentChange >= 0 ? 'up' : 'down';
            enrollmentChange = `${percentChange >= 0 ? '+' : ''}${percentChange.toFixed(1)}%`;
            enrollmentChangeValue = `vs last period`;
          } else if (current > 0) {
            enrollmentTrend = 'up';
            enrollmentChange = `+${current}`;
            enrollmentChangeValue = 'new enrollments';
          }
        }

        // Calculate completion rate trend (compare last two periods)
        let completionTrend = 'up';
        let completionChange = '';
        let completionChangeValue = '';
        
        if (Array.isArray(completionRes) && completionRes.length >= 2) {
          const currentComp = completionRes[completionRes.length - 1].value || 0;
          const previousComp = completionRes[completionRes.length - 2].value || 0;
          const diff = currentComp - previousComp;
          completionTrend = diff >= 0 ? 'up' : 'down';
          completionChange = `${diff >= 0 ? '+' : ''}${diff.toFixed(1)}%`;
          completionChangeValue = 'vs last month';
        }

        setStats([
          { title: 'Total Users', value: totalUsers, subtitle: 'Active pastry enthusiasts', icon: Users, change: enrollmentChange, changeValue: enrollmentChangeValue, trend: enrollmentTrend },
          { title: 'Active Courses', value: activeCourses, subtitle: 'Baking adventures available', icon: BookOpen, change: `${activeCourses}`, changeValue: 'courses live', trend: 'up' },
          { title: 'Feedback', value: feedbackPending, subtitle: 'Feedbacks Submitted', icon: MessageSquare, change: `${feedbackPending}`, changeValue: 'Reviews live', trend: feedbackPending > 0 ? 'down' : 'up' },
          { title: 'Completion Rate', value: `${completionVal}%`, subtitle: 'Average course completion', icon: TrendingUp, change: completionChange || `${completionVal}%`, changeValue: completionChangeValue || 'current rate', trend: completionTrend }
        ]);

        // usersGrowth -> map to enrollmentDataState (use value + previous placeholder)
        if (Array.isArray(usersGrowth) && usersGrowth.length > 0) {
          // Map weeks to chart points; create previous as zero for now
          const mapped = usersGrowth.map((g, idx) => ({ name: g.name || `W${idx+1}`, value: g.value || 0, previous: 0 }));
          setEnrollmentDataState(mapped.length ? mapped : defaultEnrollment);
        }

        // Recent activity: combine feedbacks, course activities, and posts
        const recentActivities = [];

        // Add feedbacks
        if (Array.isArray(feedbacksRes)) {
          feedbacksRes.forEach((f) => {
            // Parse date and ensure it's treated as UTC, then convert to local
            let createdDate = new Date();
            if (f.createdAt) {
              createdDate = new Date(f.createdAt);
              // If the date string doesn't have timezone info, treat it as UTC
              if (!f.createdAt.includes('Z') && !f.createdAt.includes('+')) {
                createdDate = new Date(f.createdAt + 'Z');
              }
            }
            recentActivities.push({
              id: `feedback-${f.id || f.feedbackId || f.FeedbackId}`,
              type: 'feedback',
              title: f.title || (f.courseTitle ? `Feedback on ${f.courseTitle}` : 'User feedback'),
              description: `${f.userName || f.userEmail || ''}${f.courseTitle ? ' — ' + f.courseTitle : ''}`,
              time: createdDate.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
              timestamp: createdDate.getTime(),
              icon: MessageSquare,
              color: '#D9433B',
              bgColor: 'var(--surface)',
              badge: 'Feedback'
            });
          });
        }

        // Add course activities (enrollments) - match with user and course data
        if (Array.isArray(courseActivitiesRes) && Array.isArray(usersRes) && Array.isArray(coursesRes)) {
          const registeredActivities = courseActivitiesRes.filter(a => a.registered);
          
          registeredActivities.forEach((a, index) => {
            const user = usersRes.find(u => u.userId === a.userId);
            const course = coursesRes.find(c => c.courseId === a.courseId);
            
            // Since we don't have a real timestamp, use ActivityId as proxy for recency
            // Spread enrollments over the last 7 days so they mix with posts/feedbacks
            const estimatedTime = new Date(Date.now() - (registeredActivities.length - index) * 60000);
            
            recentActivities.push({
              id: `activity-${a.activityId}`,
              type: 'enrollment',
              title: `New enrollment${course?.title ? `: ${course.title}` : ''}`,
              description: `${user?.username || user?.firstName || 'User'} enrolled in a course`,
              time: estimatedTime.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
              timestamp: estimatedTime.getTime(),
              activityId: a.activityId, // Keep original ID for proper sorting
              icon: BookOpen,
              color: '#10b981',
              bgColor: 'var(--surface)',
              badge: 'Enrollment'
            });
          });
        }

        // Add posts
        if (Array.isArray(postsRes)) {
          postsRes.forEach((p) => {
            // Parse date and ensure it's treated as UTC, then convert to local
            let createdDate = new Date();
            if (p.createdAt) {
              createdDate = new Date(p.createdAt);
              // If the date string doesn't have timezone info, treat it as UTC
              if (!p.createdAt.includes('Z') && !p.createdAt.includes('+')) {
                createdDate = new Date(p.createdAt + 'Z');
              }
            }
            recentActivities.push({
              id: `post-${p.postId || p.id}`,
              type: 'post',
              title: p.title || 'New post',
              description: `${p.userName || 'User'} posted${p.courseTitle ? ' in ' + p.courseTitle : ''}`,
              time: createdDate.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
              timestamp: createdDate.getTime(),
              icon: MessageSquare,
              color: '#3b82f6',
              bgColor: 'var(--surface)',
              badge: p.type === 'question' ? 'Question' : 'Post'
            });
          });
        }

        // Sort by timestamp (most recent first) and take top 10
        recentActivities.sort((a, b) => b.timestamp - a.timestamp);
        setRecentActivityState(recentActivities.slice(0, 10));
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      }
    };
    load();
  }, [enrollmentPeriod]);

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
                  {stat.changeValue && <p className="text-xs font-medium text-gray-600 mt-2">{stat.changeValue}</p>}
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
                <p className="text-sm text-gray-500 mt-0.5">
                  {enrollmentPeriod === 'week' && 'Last 6 weeks performance'}
                  {enrollmentPeriod === 'month' && 'Last 12 months performance'}
                  {enrollmentPeriod === 'year' && 'Last 5 years performance'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="inline-flex rounded-lg border p-1" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
                  <button
                    onClick={() => setEnrollmentPeriod('week')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                      enrollmentPeriod === 'week'
                        ? 'bg-[#D9433B] text-white shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Week
                  </button>
                  <button
                    onClick={() => setEnrollmentPeriod('month')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                      enrollmentPeriod === 'month'
                        ? 'bg-[#D9433B] text-white shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Month
                  </button>
                  <button
                    onClick={() => setEnrollmentPeriod('year')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                      enrollmentPeriod === 'year'
                        ? 'bg-[#D9433B] text-white shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Year
                  </button>
                </div>
              </div>
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
                {recentActivityState.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-sm">No recent activity</p>
                  </div>
                ) : (
                  recentActivityState.map((activity) => (
                    <div
                      key={activity.id}
                      className="group flex items-start gap-3 p-3 rounded-xl transition-all duration-200 cursor-pointer border hover:border-gray-200 hover:shadow-sm"
                      style={{ borderColor: 'transparent' }}
                      onClick={() => {
                        // Navigate based on activity type
                        if (activity.type === 'feedback') {
                          navigate(`/admin/feedback`);
                        } else if (activity.type === 'post') {
                          navigate(`/admin/posts`);
                        } else if (activity.type === 'enrollment') {
                          navigate(`/admin/course-management`);
                        }
                      }}
                    >
                      <div className="p-2 rounded-lg group-hover:scale-110 transition-transform duration-200" style={{ backgroundColor: activity.bgColor }}>
                        <activity.icon className="w-4 h-4" style={{ color: activity.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-gray-900 truncate">{activity.title}</p>
                          {activity.badge && (
                            <span 
                              className="px-2 py-0.5 text-xs font-medium rounded-full flex-shrink-0"
                              style={{ 
                                backgroundColor: activity.type === 'feedback' ? '#FEF3C7' : activity.type === 'enrollment' ? '#D1FAE5' : '#DBEAFE',
                                color: activity.type === 'feedback' ? '#92400E' : activity.type === 'enrollment' ? '#065F46' : '#1E40AF'
                              }}
                            >
                              {activity.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 truncate mt-0.5">{activity.description}</p>
                        <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))
                )}
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