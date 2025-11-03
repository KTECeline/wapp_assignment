import React from 'react';
import ChartComponent from '../../components/ChartComponent';
import { Users, BookOpen, MessageSquare, TrendingUp, CheckCircle } from 'lucide-react';

const stats = [
  {
    title: 'Total Users',
    value: 3450,
    subtitle: 'Active pastry enthusiasts',
    icon: Users,
    color: 'bg-gradient-to-br from-[#D9433B] to-[#B13A33]',
    change: '+12%',
    trend: 'up'
  },
  {
    title: 'Active Courses',
    value: 28,
    subtitle: 'Baking adventures available',
    icon: BookOpen,
    color: 'bg-gradient-to-br from-[#EFBF71] to-[#D4A574]',
    change: '+3',
    trend: 'up'
  },
  {
    title: 'Feedback Pending',
    value: 12,
    subtitle: 'Awaiting your attention',
    icon: MessageSquare,
    color: 'bg-gradient-to-br from-[#FADADD] to-[#F2C2C7]',
    change: '-2',
    trend: 'down'
  },
];

const trend = [
  { name: 'Jan', value: 120 },
  { name: 'Feb', value: 160 },
  { name: 'Mar', value: 200 },
  { name: 'Apr', value: 240 },
  { name: 'May', value: 220 },
  { name: 'Jun', value: 280 },
];

const recentActivity = [
  {
    id: 1,
    type: 'user',
    title: 'New user registered',
    description: 'pastrylover@example.com',
    time: '2 minutes ago',
    icon: Users,
    color: 'text-[#D9433B]'
  },
  {
    id: 2,
    type: 'course',
    title: 'Course updated',
    description: 'Art of Sourdough',
    time: '1 hour ago',
    icon: BookOpen,
    color: 'text-[#EFBF71]'
  },
  {
    id: 3,
    type: 'feedback',
    title: 'Feedback resolved',
    description: 'Video playback issue',
    time: '3 hours ago',
    icon: CheckCircle,
    color: 'text-green-500'
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-8 p-4 md:p-6 bg-[#FFFDFB] min-h-screen">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-500 mb-1">{stat.title}</h3>
                <p className="text-3xl font-bold text-gray-900">{stat.value.toLocaleString()}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.subtitle}</p>
                <div className="flex items-center mt-2">
                  <span
                    className={`text-sm font-medium ${
                      stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {stat.change}
                  </span>
                  <span className="text-xs text-gray-500 ml-1">vs last month</span>
                </div>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enrollment Trend */}
        <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-1">Enrollment Trend</h2>
          <p className="text-sm text-gray-500 mb-4">Last 6 months</p>
          <ChartComponent data={trend} />
        </div>

        {/* Recent Activity */}
        <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-1">Recent Activity</h2>
          <p className="text-sm text-gray-500 mb-4">Latest updates from your kitchen</p>
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 bg-[#FAF6F1] rounded-xl hover:bg-[#FFF8F2] transition-colors"
              >
                <div
                  className={`w-9 h-9 rounded-lg bg-white flex items-center justify-center border border-gray-100 ${activity.color}`}
                >
                  <activity.icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">{activity.title}</p>
                  <p className="text-xs text-gray-600">{activity.description}</p>
                  <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-1">Quick Actions</h2>
        <p className="text-sm text-gray-500 mb-4">Common administrative tasks</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Users, label: 'Add User' },
            { icon: BookOpen, label: 'New Course' },
            { icon: MessageSquare, label: 'View Feedback' },
            { icon: TrendingUp, label: 'Reports' },
          ].map((btn) => (
            <button
              key={btn.label}
              className="p-4 rounded-xl bg-[#FFF0EE] hover:bg-[#FFE5E3] transition-colors text-center border border-[#FFE2DF]"
            >
              <btn.icon className="w-6 h-6 text-[#D9433B] mx-auto mb-2" />
              <span className="text-sm font-medium text-[#D9433B]">{btn.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
