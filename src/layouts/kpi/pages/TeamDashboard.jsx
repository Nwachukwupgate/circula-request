import {useState} from 'react';
import { TrendingUp, TrendingDown, Users, Target, Calendar, Award, BarChart3, Plus, Loader } from 'lucide-react';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MDBox from "components/MDBox";
import { Link } from 'react-router-dom';
import { useGetKpiTemplatesQuery, useGetKpiDashboardQuery } from 'api/apiSlice';


const PerformanceDashboard = () => {
  const [kpiSearch, setKpiSearch] = useState('');
  const [employeeSearch, setEmployeeSearch] = useState('');
  const [kpiPage, setKpiPage] = useState(1);
  const [teamPage, setTeamPage] = useState(1);
  const pageSize = 20;

  const { data: filteredKpis,  isLoading: kpiLoading } = useGetKpiTemplatesQuery({
      search: kpiSearch,
      page: kpiPage,
      limit: pageSize,
  });

  const { data: kpiDashboardData, isLoading: kpiDashboardLoading } = useGetKpiDashboardQuery({
    search: "",
    page: 1,
    limit: 20,
  });

  const teamData = [
    {
      name: 'Sophia Carter',
      department: 'Marketing',
      performance: 'Exceeds Expectations',
      kpis: 80,
      lastReview: '2023-11-15',
      color: 'success',
      avatar: 'SC'
    },
    {
      name: 'Ethan Bennett',
      department: 'Sales',
      performance: 'Meets Expectations',
      kpis: 60,
      lastReview: '2023-10-20',
      color: 'info',
      avatar: 'EB'
    },
    {
      name: 'Olivia Hayes',
      department: 'Product',
      performance: 'Needs Improvement',
      kpis: 40,
      lastReview: '2023-09-25',
      color: 'warning',
      avatar: 'OH'
    },
    {
      name: 'Liam Foster',
      department: 'Engineering',
      performance: 'Exceeds Expectations',
      kpis: 90,
      lastReview: '2023-12-01',
      color: 'success',
      avatar: 'LF'
    },
    {
      name: 'Ava Morgan',
      department: 'Design',
      performance: 'Meets Expectations',
      kpis: 70,
      lastReview: '2023-11-05',
      color: 'info',
      avatar: 'AM'
    }
  ];

  const allKPITemplates = Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    title: `KPI Template ${i + 1}`,
    description: `Description for KPI Template ${i + 1}`,
  }));

  

  // Filtered and Paginated KPI Data
  const filteredKPIs = allKPITemplates.filter(kpi =>
    kpi.title.toLowerCase().includes(kpiSearch.toLowerCase())
  );
  const paginatedKPIs = filteredKPIs.slice((kpiPage - 1) * pageSize, kpiPage * pageSize);

  // Filtered and Paginated Team Data
  const filteredTeam = teamData.filter(member =>
    member.name.toLowerCase().includes(employeeSearch.toLowerCase()) ||
    member.department.toLowerCase().includes(employeeSearch.toLowerCase())
  );
  const paginatedTeam = filteredTeam.slice((teamPage - 1) * pageSize, teamPage * pageSize);

  const getPerformanceColors = (performance) => {
    switch (performance) {
      case 'Exceeds Expectations':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Meets Expectations':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Needs Improvement':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDepartmentColor = (department) => {
    const colors = {
      Marketing: 'bg-purple-100 text-purple-800',
      Sales: 'bg-blue-100 text-blue-800',
      Product: 'bg-green-100 text-green-800',
      Engineering: 'bg-orange-100 text-orange-800',
      Design: 'bg-pink-100 text-pink-800'
    };
    return colors[department] || 'bg-gray-100 text-gray-800';
  };

  const getProgressBarColor = (kpis) => {
    if (kpis >= 80) return 'bg-green-500';
    if (kpis >= 60) return 'bg-blue-500';
    return 'bg-yellow-500';
  };

  const kpiData = [
    { month: 'Jan', value: 65 },
    { month: 'Feb', value: 72 },
    { month: 'Mar', value: 68 },
    { month: 'Apr', value: 58 },
    { month: 'May', value: 78 },
    { month: 'Jun', value: 75 }
  ];

  const performanceData = [
    { month: 'Jan', value: 3.2 },
    { month: 'Feb', value: 4.1 },
    { month: 'Mar', value: 3.8 },
    { month: 'Apr', value: 3.5 },
    { month: 'May', value: 3.9 },
    { month: 'Jun', value: 3.8 }
  ];

  

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mb={2} />
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900">My Team</h1>
            </div>
            <p className="text-gray-600 text-lg">Here's a summary of your team's performance</p>
          </div>

          {/* KPI Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* KPI Completion Rate */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">KPI Completion Rate</h3>
              </div>
              <div className="flex items-end gap-2 mb-2">
                <span className="text-4xl font-bold text-gray-900">75%</span>
                <div className="flex items-center gap-1 text-green-600 mb-2">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm font-medium">+5%</span>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4">Last 6 Months</p>
              <div className="h-20 flex items-end gap-1">
                {kpiData.map((item, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-blue-200 rounded-t transition-all duration-300 hover:bg-blue-300"
                      style={{ height: `${(item.value / 100) * 80}px` }}
                    />
                    <span className="text-xs text-gray-500 mt-1">{item.month}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Average Performance */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Award className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Average Performance</h3>
              </div>
              <div className="flex items-end gap-2 mb-2">
                <span className="text-4xl font-bold text-gray-900">3.8</span>
                <div className="flex items-center gap-1 text-red-600 mb-2">
                  <TrendingDown className="h-4 w-4" />
                  <span className="text-sm font-medium">-2%</span>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4">Last 6 Months</p>
              <div className="h-20 flex items-end gap-1">
                {performanceData.map((item, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-green-200 rounded-t transition-all duration-300 hover:bg-green-300"
                      style={{ height: `${(item.value / 5) * 80}px` }}
                    />
                    <span className="text-xs text-gray-500 mt-1">{item.month}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Team Overview */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Team Overview</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Members</span>
                  <span className="text-xl font-bold text-gray-900">5</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Exceeds Expectations</span>
                  <span className="text-xl font-bold text-green-600">2</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Meets Expectations</span>
                  <span className="text-xl font-bold text-blue-600">2</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Needs Improvement</span>
                  <span className="text-xl font-bold text-yellow-600">1</span>
                </div>
              </div>
            </div>
          </div>

          {/* Team Performance Table */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Performance Summary</h2>
                <Link to={"/team/assignment"}>
                <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                  <Plus className="h-4 w-4" />
                  Assign New KPIs
                </button>
                </Link>
              </div>
            </div>

            <div className='py-2 px-6 border-t border-gray-100'>
              <input
                type="text"
                placeholder="Search employees..."
                className="border border-gray-300 rounded-lg px-4 py-2 w-80"
                value={employeeSearch}
                onChange={(e) => setEmployeeSearch(e.target.value)}
              />
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {paginatedTeam.map((member, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-all duration-200 hover:border-blue-200">
                    <Link to={"/team/viewTeam"}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {member.avatar}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDepartmentColor(member.department)}`}>
                              {member.department}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPerformanceColors(member.performance)}`}>
                              {member.performance}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-8">
                        <div className="text-center">
                          <p className="text-gray-600 text-sm mb-2">KPIs Completed</p>
                          <div className="flex items-center gap-3">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${getProgressBarColor(member.kpis)} transition-all duration-500`}
                                style={{ width: `${member.kpis}%` }}
                              />
                            </div>
                            <span className="text-lg font-bold text-gray-900 w-8">{member.kpis}%</span>
                          </div>
                        </div>
                        
                        <div className="text-center">
                          <p className="text-gray-600 text-sm mb-2">Last Review</p>
                          <div className="flex items-center gap-2 text-gray-700">
                            <Calendar className="h-4 w-4" />
                            <span className="font-medium">
                              {new Date(member.lastReview).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <Link to={"/team/viewTeam"}>
                          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm">
                            View KPIs
                          </button>
                        </Link>
                      </div>
                    </div>
                    </Link>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-end items-center gap-2 mt-4">
                <button
                  className="px-3 py-1 border rounded disabled:opacity-50"
                  onClick={() => setTeamPage((p) => Math.max(p - 1, 1))}
                  disabled={teamPage === 1}
                >
                  Prev
                </button>
                <span>{teamPage}</span>
                <button
                  className="px-3 py-1 border rounded disabled:opacity-50"
                  onClick={() => setTeamPage((p) => (p * pageSize < filteredTeam.length ? p + 1 : p))}
                  disabled={teamPage * pageSize >= filteredTeam.length}
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          {/* KPI Template Section */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 mt-10 py-8 px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">All KPI Templates</h2>
            <div className="flex items-center justify-between mb-4">
              <div>               
                <input
                  type="text"
                  placeholder="Search by title..."
                  className="border border-gray-300 rounded-lg px-4 py-2 w-80"
                  value={kpiSearch}
                  onChange={(e) => setKpiSearch(e.target.value)}
                />
              </div>
              <Link to="/team/createkpi">
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-all">
                  <Plus className="h-4 w-4" />
                  Create KPI
                </button>
              </Link>              
            </div>

            <div className="p-6">
              {kpiLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader className="w-8 h-8 animate-spin text-blue-600" />
                    <span className="ml-2 text-gray-600">Loading KPIs...</span>
                  </div>
              ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto text-sm text-left text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th className="px-4 py-3">Title</th>
                      <th className="px-4 py-3">Description</th>
                      <th className="px-4 py-3">Department</th>
                      <th className="px-4 py-3 whitespace-nowrap">Metric Type</th>
                      <th className="px-4 py-3 whitespace-nowrap">Created By</th>
                      <th className="px-4 py-3">
                        View
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Replace this mock data with dynamic data from backend */}
                    {filteredKpis?.data?.map((kpi, index) => (
                      <tr key={index} className="bg-white border-b hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900">{kpi?.title}</td>
                        <td className="px-4 py-3">{kpi?.description?.split(' ').slice(0, 10).join(' ')}...</td>
                        <td className="px-4 py-3">{kpi?.departmentName}</td>
                        <td className="px-4 py-3 capitalize">{kpi?.metricType}</td>
                        <td className="px-4 py-3 whitespace-nowrap">{kpi?.createdByName}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <Link to={`/team/viewDetails/${kpi?.id}`}>
                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm">
                              View KPI Details
                            </button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination */}
                <div className="flex justify-end items-center gap-2 mt-4">
                  <button
                    className="px-3 py-1 border rounded disabled:opacity-50"
                    onClick={() => setKpiPage((p) => Math.max(p - 1, 1))}
                    disabled={kpiPage === 1}
                  >
                    Prev
                  </button>
                  <span>{kpiPage}</span>
                  <button
                    className="px-3 py-1 border rounded disabled:opacity-50"
                    onClick={() => setKpiPage((p) => (p * pageSize < filteredKpis?.data?.length ? p + 1 : p))}
                    disabled={kpiPage * pageSize >= filteredKpis?.data?.length}
                  >
                    Next
                  </button>
                </div>
              </div>
              )}
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </DashboardLayout>
  );
};

export default PerformanceDashboard;