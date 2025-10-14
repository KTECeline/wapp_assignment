import React, { useState } from 'react';
import Card from '../../components/Card';
import ChartComponent from '../../components/ChartComponent';
import { Filter, Download, Calendar, TrendingUp, Users, BookOpen } from 'lucide-react';

const usersGrowth = [
  { name: 'W1', value: 20 },
  { name: 'W2', value: 30 },
  { name: 'W3', value: 45 },
  { name: 'W4', value: 60 },
];

const coursePopularity = [
  { name: 'Sourdough', value: 120 },
  { name: 'Pastry', value: 95 },
  { name: 'Cake', value: 130 },
  { name: 'Pizza', value: 70 },
];

const engagementData = [
  { name: 'Jan', value: 85 },
  { name: 'Feb', value: 92 },
  { name: 'Mar', value: 78 },
  { name: 'Apr', value: 96 },
  { name: 'May', value: 88 },
  { name: 'Jun', value: 94 },
];

export default function Reports() {
  const [dateRange, setDateRange] = useState('Last 30 days');
  const [categoryFilter, setCategoryFilter] = useState('All');

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <Card>
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Date Range Filter */}
          <div className="flex-1 relative">
            <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full pl-12 pr-8 py-2 bg-white border border-[#EADCD2] rounded-xl focus:ring-2 focus:ring-[#D9433B] focus:border-transparent outline-none transition-all duration-200 appearance-none"
            >
              <option value="Last 7 days">Last 7 days</option>
              <option value="Last 30 days">Last 30 days</option>
              <option value="Last 3 months">Last 3 months</option>
              <option value="Last year">Last year</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="pl-12 pr-8 py-2 bg-white border border-[#EADCD2] rounded-xl focus:ring-2 focus:ring-[#D9433B] focus:border-transparent outline-none transition-all duration-200 appearance-none min-w-[160px]"
            >
              <option value="All">All Categories</option>
              <option value="Users">Users</option>
              <option value="Courses">Courses</option>
              <option value="Engagement">Engagement</option>
            </select>
          </div>

          {/* Export Button */}
          <button className="bg-[#D9433B] hover:bg-[#B13A33] text-white rounded-xl px-4 py-2 font-medium transition-all duration-200 flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </Card>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">Total Users</h3>
              <p className="text-2xl font-bold text-gray-900">3,450</p>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-1" />
                +12% vs last month
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D9433B] to-[#B13A33] flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">Active Courses</h3>
              <p className="text-2xl font-bold text-gray-900">28</p>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-1" />
                +3 new courses
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#EFBF71] to-[#D4A574] flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">Completion Rate</h3>
              <p className="text-2xl font-bold text-gray-900">78%</p>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-1" />
                +5% vs last month
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">Avg Rating</h3>
              <p className="text-2xl font-bold text-gray-900">4.6</p>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-1" />
                +0.2 vs last month
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FADADD] to-[#F2C2C7] flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="User Growth" subtitle="Weekly new registrations">
          <ChartComponent data={usersGrowth} />
        </Card>
        <Card title="Course Popularity" subtitle="Enrollment by course type">
          <ChartComponent data={coursePopularity} />
        </Card>
      </div>

      {/* Additional Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="User Engagement" subtitle="Monthly engagement score">
          <ChartComponent data={engagementData} />
        </Card>
        
        <Card title="Revenue Analytics" subtitle="Monthly revenue trends">
          <div className="h-64 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-sm">Revenue data visualization</p>
              <p className="text-xs text-gray-400 mt-1">Coming soon</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Summary Report */}
      <Card title="Executive Summary" subtitle="Key insights and recommendations">
        <div className="space-y-4">
          <div className="p-4 bg-[#FAF6F1] rounded-xl">
            <h4 className="font-semibold text-gray-900 mb-2">📈 Growth Highlights</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• User registrations increased by 12% this month</li>
              <li>• Course completion rates improved to 78%</li>
              <li>• Average user rating reached 4.6 stars</li>
            </ul>
          </div>
          
          <div className="p-4 bg-[#FFF0EE] rounded-xl">
            <h4 className="font-semibold text-gray-900 mb-2">🎯 Recommendations</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Focus on expanding advanced pastry courses</li>
              <li>• Consider adding more interactive elements</li>
              <li>• Implement user feedback collection system</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}