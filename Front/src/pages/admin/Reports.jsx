import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import ChartComponent from '../../components/ChartComponent';
import { Filter, Download, Calendar, TrendingUp, Users, BookOpen } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

// use a red palette for pie charts per request
const RED_COLORS = ['#7f1d1d', '#b91c1c', '#ef4444', '#f87171', '#fecaca'];

export default function Reports() {
  const [dateRange, setDateRange] = useState('Last 30 days');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const [usersGrowth, setUsersGrowth] = useState([]);
  const [coursePopularity, setCoursePopularity] = useState([]);
  const [engagementData, setEngagementData] = useState([]);
  const [feedbackData, setFeedbackData] = useState([]);
  const [feedbackList, setFeedbackList] = useState([]);
  const [coursesList, setCoursesList] = useState([]);
  const [usersList, setUsersList] = useState([]);

  const [totalUsers, setTotalUsers] = useState(0);
  const [activeCourses, setActiveCourses] = useState(0);
  const [completionRate, setCompletionRate] = useState(0);
  const [avgRating, setAvgRating] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const [usersRes, coursesRes, growthRes, popRes, engageRes, feedbackRes, completionRes, avgRatingRes] = await Promise.all([
          fetch('/api/Users').then(r => r.ok ? r.json() : []),
          fetch('/api/Courses').then(r => r.ok ? r.json() : []),
          fetch('/api/Reports/UsersGrowth?weeks=6').then(r => r.ok ? r.json() : []),
          fetch('/api/Reports/CoursePopularity').then(r => r.ok ? r.json() : []),
          fetch('/api/Reports/Engagement?months=6').then(r => r.ok ? r.json() : []),
          // fetch full feedback list so we can compute rating distribution
          fetch('/api/UserFeedbacks').then(r => r.ok ? r.json() : []),
          fetch('/api/Reports/CompletionRate?months=1').then(r => r.ok ? r.json() : []),
          fetch('/api/Reports/AvgRating?months=1').then(r => r.ok ? r.json() : [])
        ]);

  setUsersList(Array.isArray(usersRes) ? usersRes : []);
  setCoursesList(Array.isArray(coursesRes) ? coursesRes : []);
  setTotalUsers(Array.isArray(usersRes) ? usersRes.length : 0);
  setActiveCourses(Array.isArray(coursesRes) ? coursesRes.length : 0);

        // Map growth response to {name, value}
        if (Array.isArray(growthRes)) setUsersGrowth(growthRes.map((g) => ({ name: g.name, value: g.value })));
        if (Array.isArray(popRes)) setCoursePopularity(popRes.map(p => ({ name: p.name, value: p.value })));
        if (Array.isArray(engageRes)) setEngagementData(engageRes.map(e => ({ name: e.name, value: e.value })));
        // feedbackRes is the array of feedback entries; compute rating buckets 1..5
        if (Array.isArray(feedbackRes)) {
          setFeedbackList(feedbackRes);
          const buckets = { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 };
          feedbackRes.forEach(f => {
            const r = Number(f.rating) || 0;
            if (r >= 1 && r <= 5) buckets[String(r)] += 1;
          });
          const ratingData = Object.keys(buckets).map(k => ({ name: `${k}★`, value: buckets[k] }));
          setFeedbackData(ratingData);
        }

        if (Array.isArray(completionRes) && completionRes.length) setCompletionRate(completionRes[completionRes.length - 1].value || 0);
        if (Array.isArray(avgRatingRes) && avgRatingRes.length) setAvgRating(avgRatingRes[avgRatingRes.length - 1].value || 0);
      } catch (err) {
        console.error('Failed to load reports data', err);
      }
    };
    load();
  }, []);

  const exportCsv = async () => {
    // Build a richer CSV client-side using already-fetched data so the downloaded file is actionable.
    try {
      const months = 6;

      const escape = (v) => {
        if (v === null || v === undefined) return '';
        const s = String(v);
        // escape double quotes
        const escaped = s.replace(/"/g, '""');
        // wrap in quotes if contains comma/newline/quote
        if (/[",\n]/.test(escaped)) return `"${escaped}"`;
        return escaped;
      };

      const rows = [];

      // Report header
      rows.push(['Report', `Admin Reports (${months} months)`]);
      rows.push([]);

      // Summary
      rows.push(['Summary']);
      rows.push(['Total Users', totalUsers]);
      rows.push(['Active Courses', activeCourses]);
      rows.push(['Completion Rate', `${completionRate}%`]);
      rows.push(['Avg Rating', avgRating]);
      rows.push([]);

      // Ratings distribution
      rows.push(['Ratings Distribution']);
      rows.push(['Rating', 'Count']);
      feedbackData.forEach(d => rows.push([d.name, d.value]));
      rows.push([]);

      // Top courses
      rows.push(['Top Courses (by enrollment)']);
      rows.push(['Course Name', 'Enrollments']);
      const topCourses = (Array.isArray(coursePopularity) ? coursePopularity : []).slice().sort((a,b) => b.value - a.value).slice(0, 20);
      topCourses.forEach(c => rows.push([c.name, c.value]));
      rows.push([]);

      // Detailed feedback rows
      rows.push(['Feedback Details']);
      rows.push(['FeedbackDate', 'UserId', 'UserName', 'CourseId', 'CourseName', 'Rating', 'Comment']);
      const userById = (Array.isArray(usersList) ? usersList.reduce((m,u)=>{ m[u.id||u.userId||u.userID||u._id] = u; return m; }, {}) : {});
      const courseById = (Array.isArray(coursesList) ? coursesList.reduce((m,c)=>{ m[c.id||c.courseId||c._id] = c; return m; }, {}) : {});
      (Array.isArray(feedbackList) ? feedbackList : []).forEach(f => {
        const userId = f.userId ?? f.userID ?? f.user?.id ?? f.user?.userId ?? '';
        const courseId = f.courseId ?? f.courseID ?? f.course?.id ?? '';
        const user = userById[userId] || {};
        const course = courseById[courseId] || {};
        const date = f.createdAt || f.date || f.timestamp || f.created || '';
        const userName = user.name || user.fullName || user.email || '';
        const courseName = course.title || course.name || course.courseName || '';
        rows.push([date, userId, userName, courseId, courseName, f.rating ?? '', f.comment ?? f.message ?? '']);
      });

      // Convert rows to CSV text
      const csvText = rows.map(r => r.map(escape).join(',')).join('\n');

      const blob = new Blob([csvText], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reports_${months}m.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed', err);
      alert('Failed to export CSV: ' + (err.message || err));
    }
  };

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
          <button onClick={exportCsv} className="bg-[#D9433B] hover:bg-[#B13A33] text-white rounded-xl px-4 py-2 font-medium transition-all duration-200 flex items-center gap-2">
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
              <p className="text-2xl font-bold text-gray-900">{totalUsers.toLocaleString()}</p>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-1" />
                {usersGrowth.length ? `${usersGrowth[usersGrowth.length-1].value || 0} new` : ''} vs last period
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
              <p className="text-2xl font-bold text-gray-900">{activeCourses}</p>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-1" />
                {coursePopularity.length ? `${coursePopularity.reduce((s,c)=>s+c.value,0)} enrollments` : ''}
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
              <p className="text-2xl font-bold text-gray-900">{completionRate}%</p>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-1" />
                {completionRate ? `Updated` : ''}
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
              <p className="text-2xl font-bold text-gray-900">{avgRating}</p>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-1" />
                {avgRating ? `Updated` : ''}
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
        <Card title="Course Popularity" subtitle="Top courses by enrollment">
          {/* Use a bar chart for course popularity (sorted, top 10) for better readability */}
          <div className="h-64">
            <ChartComponent data={coursePopularity} xKey="name" yKey="value" />
          </div>
        </Card>
      </div>

      {/* Additional Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="User Engagement" subtitle="Monthly engagement score">
          <ChartComponent data={engagementData} />
        </Card>
        
        <Card title="Ratings Distribution" subtitle="Feedback ratings breakdown (1-5 stars)">
          {/* Pie chart for ratings distribution, use red palette */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={feedbackData} dataKey="value" nameKey="name" outerRadius={90} fill="#ef4444" label />
                {feedbackData.map((entry, index) => (
                  <Cell key={`fcell-${index}`} fill={RED_COLORS[index % RED_COLORS.length]} />
                ))}
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

    </div>
  );
}