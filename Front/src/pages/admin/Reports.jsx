import React, { useState, useEffect, useRef } from 'react';
import Card from '../../components/Card';
import ChartComponent from '../../components/ChartComponent';
import { Download, Calendar, TrendingUp, Users, BookOpen, FileText, FileSpreadsheet, ChevronDown } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';

// Red color palette for rating distribution - 5 stars (darkest red) to 1 star (lightest red)
// Map: 5★ → darkest, 4★ → slightly lighter, 3★ → medium, 2★ → light, 1★ → lightest
const RATING_COLORS = {
  '5★': '#7f1d1d', // Darkest red (5 stars)
  '4★': '#b91c1c', // Dark red (4 stars)
  '3★': '#ef4444', // Medium red (3 stars)
  '2★': '#f87171', // Light red (2 stars)
  '1★': '#fecaca'  // Lightest red (1 star)
};

export default function Reports() {
  const [dateRange, setDateRange] = useState('Last 30 days');
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Refs for chart elements to capture for PDF
  const userGrowthChartRef = useRef(null);
  const coursePopularityChartRef = useRef(null);
  const engagementChartRef = useRef(null);
  const ratingsChartRef = useRef(null);

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

  const exportPdf = async () => {
    setIsExporting(true);
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Import autoTable to extend jsPDF
      const doc = pdf;
      
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      let yPos = 20;

      // Header
      doc.setFontSize(22);
      doc.setTextColor(217, 67, 59); // Red theme
      doc.text('Admin Analytics Report', pageWidth / 2, yPos, { align: 'center' });
      
      yPos += 10;
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth / 2, yPos, { align: 'center' });
      doc.text(`Period: ${dateRange}`, pageWidth / 2, yPos + 5, { align: 'center' });

      yPos += 15;

      // Summary Section
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text('Executive Summary', 14, yPos);
      yPos += 8;

      const summaryData = [
        ['Total Users', totalUsers.toLocaleString()],
        ['Active Courses', activeCourses.toString()],
        ['Completion Rate', `${completionRate}%`],
        ['Average Rating', avgRating.toString()],
        ['Total Enrollments', coursePopularity.reduce((s, c) => s + c.value, 0).toLocaleString()],
        ['Total Feedback', feedbackList.length.toLocaleString()]
      ];

      autoTable(doc, {
        startY: yPos,
        head: [['Metric', 'Value']],
        body: summaryData,
        theme: 'grid',
        headStyles: { fillColor: [217, 67, 59], textColor: [255, 255, 255] },
        margin: { left: 14, right: 14 },
        styles: { fontSize: 10 }
      });

      yPos = doc.lastAutoTable.finalY + 10;

      // Capture and add charts
      const addChartToPdf = async (chartRef, title, newPage = false) => {
        if (newPage) {
          doc.addPage();
          yPos = 20;
        }

        if (yPos > pageHeight - 80) {
          doc.addPage();
          yPos = 20;
        }

        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(title, 14, yPos);
        yPos += 5;

        if (chartRef.current) {
          try {
            const canvas = await html2canvas(chartRef.current, {
              backgroundColor: '#ffffff',
              scale: 2
            });
            const imgData = canvas.toDataURL('image/png');
            const imgWidth = pageWidth - 28;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            
            if (yPos + imgHeight > pageHeight - 20) {
              doc.addPage();
              yPos = 20;
              doc.text(title, 14, yPos);
              yPos += 5;
            }

            doc.addImage(imgData, 'PNG', 14, yPos, imgWidth, Math.min(imgHeight, 70));
            yPos += Math.min(imgHeight, 70) + 10;
          } catch (err) {
            console.error(`Failed to capture ${title}:`, err);
          }
        }
      };

      // Add all charts
      await addChartToPdf(userGrowthChartRef, 'User Growth Over Time');
      await addChartToPdf(coursePopularityChartRef, 'Course Popularity', yPos > pageHeight - 100);
      await addChartToPdf(engagementChartRef, 'User Engagement Trends', true);
      await addChartToPdf(ratingsChartRef, 'Ratings Distribution');

      // Top Courses Detail Table
      if (yPos > pageHeight - 60) {
        doc.addPage();
        yPos = 20;
      } else {
        yPos += 5;
      }

      doc.setFontSize(12);
      doc.text('Top 15 Courses by Enrollment', 14, yPos);
      yPos += 5;

      const topCourses = coursePopularity.slice().sort((a, b) => b.value - a.value).slice(0, 15);
      const courseTableData = topCourses.map((c, idx) => [
        (idx + 1).toString(),
        c.name,
        c.value.toLocaleString()
      ]);

      autoTable(doc, {
        startY: yPos,
        head: [['Rank', 'Course Name', 'Enrollments']],
        body: courseTableData,
        theme: 'striped',
        headStyles: { fillColor: [217, 67, 59], textColor: [255, 255, 255] },
        margin: { left: 14, right: 14 },
        styles: { fontSize: 9 }
      });

      yPos = doc.lastAutoTable.finalY + 10;

      // Feedback Summary
      if (yPos > pageHeight - 60) {
        doc.addPage();
        yPos = 20;
      } else {
        yPos += 5;
      }

      doc.setFontSize(12);
      doc.text('Feedback Ratings Breakdown', 14, yPos);
      yPos += 5;

      const ratingsTableData = feedbackData.map(r => [r.name, r.value.toString()]);
      
      autoTable(doc, {
        startY: yPos,
        head: [['Rating', 'Count']],
        body: ratingsTableData,
        theme: 'striped',
        headStyles: { fillColor: [217, 67, 59], textColor: [255, 255, 255] },
        margin: { left: 14, right: 14 },
        styles: { fontSize: 10 }
      });

      // Recent Feedback Details (last 20)
      if (feedbackList.length > 0) {
        doc.addPage();
        yPos = 20;

        doc.setFontSize(12);
        doc.text('Recent Feedback (Last 20)', 14, yPos);
        yPos += 5;

        const userById = usersList.reduce((m, u) => {
          m[u.id || u.userId || u.userID || u._id] = u;
          return m;
        }, {});
        const courseById = coursesList.reduce((m, c) => {
          m[c.id || c.courseId || c._id] = c;
          return m;
        }, {});

        const recentFeedback = feedbackList.slice(-20).reverse();
        const feedbackTableData = recentFeedback.map(f => {
          const userId = f.userId ?? f.userID ?? f.user?.id ?? '';
          const courseId = f.courseId ?? f.courseID ?? f.course?.id ?? '';
          const user = userById[userId] || {};
          const course = courseById[courseId] || {};
          const userName = user.username || user.name || user.email || 'Unknown';
          const courseName = course.title || course.name || 'N/A';
          const rating = '★'.repeat(f.rating || 0);
          const comment = (f.comment || f.message || '').substring(0, 60) + (((f.comment || f.message || '').length > 60) ? '...' : '');
          
          return [userName, courseName, rating, comment];
        });

        autoTable(doc, {
          startY: yPos,
          head: [['User', 'Course', 'Rating', 'Comment']],
          body: feedbackTableData,
          theme: 'striped',
          headStyles: { fillColor: [217, 67, 59], textColor: [255, 255, 255] },
          margin: { left: 14, right: 14 },
          styles: { fontSize: 8, cellPadding: 2 },
          columnStyles: {
            0: { cellWidth: 35 },
            1: { cellWidth: 45 },
            2: { cellWidth: 25 },
            3: { cellWidth: 75 }
          }
        });
      }

      // Footer on every page
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(
          `Page ${i} of ${pageCount}`,
          pageWidth / 2,
          pageHeight - 10,
          { align: 'center' }
        );
      }

      // Save PDF
      doc.save(`admin_report_${new Date().toISOString().split('T')[0]}.pdf`);
      
    } catch (err) {
      console.error('PDF export failed:', err);
      alert('Failed to export PDF: ' + (err.message || err));
    } finally {
      setIsExporting(false);
      setShowExportMenu(false);
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

          {/* Export Dropdown Button */}
          <div className="relative">
            <button 
              onClick={() => setShowExportMenu(!showExportMenu)}
              disabled={isExporting}
              className={`rounded-xl px-4 py-2 font-medium transition-all duration-200 flex items-center gap-2 ${
                isExporting 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-[#D9433B] hover:bg-[#B13A33] text-white'
              }`}
            >
              <Download className="w-4 h-4" />
              {isExporting ? 'Exporting...' : 'Export'}
              <ChevronDown className={`w-4 h-4 transition-transform ${showExportMenu ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {showExportMenu && !isExporting && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 z-10 overflow-hidden">
                <button
                  onClick={() => {
                    setShowExportMenu(false);
                    exportPdf();
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors border-b border-gray-100"
                >
                  <FileText className="w-4 h-4 text-red-600" />
                  <div>
                    <div className="font-medium text-gray-900 text-sm">Export as PDF</div>
                    <div className="text-xs text-gray-500">With charts & visuals</div>
                  </div>
                </button>
                <button
                  onClick={() => {
                    setShowExportMenu(false);
                    exportCsv();
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors"
                >
                  <FileSpreadsheet className="w-4 h-4 text-green-600" />
                  <div>
                    <div className="font-medium text-gray-900 text-sm">Export as CSV</div>
                    <div className="text-xs text-gray-500">Raw data for analysis</div>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Click outside to close dropdown */}
        {showExportMenu && (
          <div 
            className="fixed inset-0 z-0" 
            onClick={() => setShowExportMenu(false)}
          />
        )}
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
          <div ref={userGrowthChartRef}>
            <ChartComponent data={usersGrowth} />
          </div>
        </Card>
        <Card title="Course Popularity" subtitle="Top courses by enrollment">
          {/* Use a bar chart for course popularity (sorted, top 10) for better readability */}
          <div className="h-64" ref={coursePopularityChartRef}>
            <ChartComponent data={coursePopularity} xKey="name" yKey="value" />
          </div>
        </Card>
      </div>

      {/* Additional Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="User Engagement" subtitle="Monthly engagement score">
          <div ref={engagementChartRef}>
            <ChartComponent data={engagementData} />
          </div>
        </Card>
        
        <Card title="Ratings Distribution" subtitle="Feedback ratings breakdown (1-5 stars)">
          {/* Pie chart for ratings distribution, use red palette - 5 stars = darkest red */}
          <div className="h-64" ref={ratingsChartRef}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={feedbackData} 
                  dataKey="value" 
                  nameKey="name" 
                  outerRadius={90} 
                  label
                >
                  {feedbackData.map((entry) => (
                    <Cell key={`cell-${entry.name}`} fill={RATING_COLORS[entry.name] || '#ef4444'} />
                  ))}
                </Pie>
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