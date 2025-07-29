import { User, MessageSquare, Code, BookOpen, Play, GraduationCap, TrendingUp, TrendingDown, Calendar, CheckCircle, Target, Award, Brain, Zap, Users, Home, BarChart3 } from 'lucide-react';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MDBox from "components/MDBox";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);


const PerformanceFeedbackPage = () => {
  const value = 65

  const filled = (value / 100) * 180;
  const empty = 180 - filled;

  const data = {
    labels: ['Filled', 'Remaining'],
    datasets: [
      {
        data: [filled, empty],
        backgroundColor: ['#1d4ed8', '#f3f4f6'],
        borderWidth: 0,
        cutout: '75%',
        circumference: 180,
        rotation: -90,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
  };

  const navigationItems = [
    { name: 'Home', icon: Home, active: true },
    { name: 'My Team', icon: Users, active: false },
    { name: 'Reviews', icon: BarChart3, active: false },
    { name: 'Goals', icon: Target, active: false },
  ];

  const aiFeedback = [
    {
      id: 1,
      category: 'Communication Skills',
      icon: MessageSquare,
      type: 'AI Feedback',
      description: 'The system suggests focusing on enhancing your communication skills, particularly in team meetings and presentations. Consider practicing active listening and structuring your thoughts more clearly.',
      severity: 'medium',
      color: 'bg-blue-500'
    },
    {
      id: 2,
      category: 'Technical Proficiency',
      icon: Code,
      type: 'AI Feedback',
      description: 'The system recommends exploring new technologies and methodologies relevant to your role. Staying updated with industry trends can significantly boost your project contributions.',
      severity: 'high',
      color: 'bg-purple-500'
    }
  ];

  const learningResources = [
    {
      id: 1,
      title: 'Effective Communication Strategies',
      type: 'Article',
      icon: BookOpen,
      color: 'bg-green-500'
    },
    {
      id: 2,
      title: 'Mastering Presentation Skills',
      type: 'Video',
      icon: Play,
      color: 'bg-red-500'
    },
    {
      id: 3,
      title: 'Advanced Project Management Techniques',
      type: 'Course',
      icon: GraduationCap,
      color: 'bg-indigo-500'
    }
  ];

  const goals = [
    { id: 1, title: 'Complete Project Alpha', completed: true },
    { id: 2, title: 'Improve Code Quality', completed: true },
    { id: 3, title: 'Attend Tech Conference', completed: true }
  ];

  const performanceMetrics = [
    { label: 'Overall Rating', value: '4.5/5', change: '+10%', positive: true },
    { label: 'Projects Completed', value: '12', change: '+5%', positive: true },
    { label: 'Feedback Received', value: '3', change: '+20%', positive: true }
  ];

  return (
    <DashboardLayout>
        <DashboardNavbar />
        <MDBox mb={2} />
            <div className="min-h-screen">
            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Page Title */}
                    <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">Performance Feedback</h1>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 rounded-full overflow-hidden">
                            <img 
                                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" 
                                alt="Alex Uwoke" 
                                className="w-full h-full object-cover"
                            />
                            </div>
                            <div>
                            <h2 className="text-xl font-bold text-gray-900">Alex Uwoke</h2>
                            <p className="text-gray-600 text-base p-1 bg-[#F4F4F4] rounded-xl">Software Engineer</p>
                            <p className="text-sm text-gray-500">Joined 2 years ago</p>
                            </div>
                        </div>
                        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-3 rounded-xl flex items-center space-x-2 min-w-[290px] w-[290px]">
                            <Award className="w-16 h-16" />
                            <div className="text-sm">
                            <div className="font-bold text-center text-lg">Top Performer</div>
                            <div className="text-xs opacity-90 text-center">Congratulations on your outstanding performance this quarter!</div>
                            </div>
                        </div>
                        </div>
                    </div>

                    {/* Manager Comments */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center">
                        <MessageSquare className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900">Manager Comments</h2>
                    </div>

                    <div className="mb-4">
                        <p className="text-gray-600 mb-4">Your manager, Sarah, has provided the following feedback:</p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-5">
                        <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-red-400 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                            <span className="font-medium text-gray-900">Sarah</span>
                            <span className="text-xs text-gray-500 flex items-center">
                                <Calendar className="w-3 h-3 mr-1" />
                                2 weeks ago
                            </span>
                            </div>
                            <p className="text-gray-700 text-sm leading-relaxed">
                            "I've noticed a significant improvement in your project management skills. Keep up the great work! However, let's work on refining your presentation style to make it more engaging."
                            </p>
                        </div>
                        </div>
                    </div>
                    </div>

                    {/* AI-Generated Feedback */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                        <Brain className="w-6 h-6 text-white" />
                        </div>
                        <div>
                        <h2 className="text-xl font-semibold text-gray-900">AI-Generated Feedback</h2>
                        <p className="text-gray-600 text-sm">Based on your recent performance data, the system has identified the following areas for improvement and growth:</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {aiFeedback.map((feedback) => (
                        <div key={feedback.id} className="border border-gray-100 rounded-xl p-5 hover:shadow-md transition-shadow">
                            <div className="flex items-start space-x-4">
                            <div className={`w-10 h-10 ${feedback.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                                <feedback.icon className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                <h3 className="font-semibold text-gray-900">{feedback.category}</h3>
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                                    {feedback.type}
                                </span>
                                </div>
                                <p className="text-gray-600 text-sm leading-relaxed">{feedback.description}</p>
                            </div>
                            </div>
                        </div>
                        ))}
                    </div>
                    </div>                    

                    {/* Recommended Learning Resources */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                        <Zap className="w-6 h-6 text-white" />
                        </div>
                        <div>
                        <h2 className="text-xl font-semibold text-gray-900">Recommended Learning Resources</h2>
                        <p className="text-gray-600 text-sm">To support your development, we've curated a list of resources tailored to your feedback:</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {learningResources.map((resource) => (
                        <div key={resource.id} className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer">
                            <div className="flex items-start space-x-3">
                            <div className={`w-10 h-10 ${resource.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                                <resource.icon className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-medium text-gray-900 mb-1">{resource.title}</h3>
                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{resource.type}</span>
                            </div>
                            </div>
                        </div>
                        ))}
                    </div>
                    </div>
                </div>

                {/* Right Column - Sidebar */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl p-6 shadow-sm">
                        <h3 className="text-xl font-bold text-gray-900 mb-6">Performance Summary</h3>
                        
                        {/* Overall Rating Circle */}
                        <div className="flex flex-col items-center mb-8">
                        <div className="relative w-64 h-64">
                            <Doughnut data={data} options={options} />
                            <div className="absolute inset-0 top-16 flex flex-col items-center justify-center">
                            <span className="text-2xl font-bold text-gray-900">65%</span>
                            <span className="text-sm text-gray-600">Overall Rating</span>
                            </div>
                        </div>
                        </div>

                        {/* Metrics */}
                        <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                            <p className="text-gray-600 text-sm">Projects Completed</p>
                            <p className="text-2xl font-bold text-gray-900">12</p>
                            </div>
                            <div className="flex items-center space-x-1 text-green-500">
                            <span className="text-sm font-medium">+10%</span>
                            <TrendingUp className="w-4 h-4" />
                            </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                            <div>
                            <p className="text-gray-600 text-sm">Feedback received</p>
                            <p className="text-2xl font-bold text-gray-900">18</p>
                            </div>
                            <div className="flex items-center space-x-1 text-red-500">
                            <span className="text-sm font-medium">-10%</span>
                            <TrendingDown className="w-4 h-4" />
                            </div>
                        </div>
                        </div>
                    </div>

                    {/* Employee Profile */}
                    {/* <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 text-center">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <User className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">Alex</h3>
                    <p className="text-gray-600 mb-2">Software Engineer</p>
                    <p className="text-sm text-gray-500">Joined 2 years ago</p>
                    </div> */}

                    {/* Performance Summary */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Summary</h3>
                    <div className="space-y-4">
                        {performanceMetrics.map((metric, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                            <p className="text-sm font-medium text-gray-900">{metric.label}</p>
                            <p className="text-lg font-bold text-gray-900">{metric.value}</p>
                            </div>
                            <div className={`flex items-center text-sm font-medium ${
                            metric.positive ? 'text-green-600' : 'text-red-600'
                            }`}>
                            <TrendingUp className="w-4 h-4 mr-1" />
                            {metric.change}
                            </div>
                        </div>
                        ))}
                    </div>
                    </div>

                    {/* Recent Goals */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Goals</h3>
                    <div className="space-y-3">
                        {goals.map((goal) => (
                        <div key={goal.id} className="flex items-center space-x-3">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <span className="text-sm text-gray-700">{goal.title}</span>
                        </div>
                        ))}
                    </div>
                    </div>

                    {/* Achievement Badge */}
                    {/* <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-6 text-center text-white">
                    <Award className="w-12 h-12 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold mb-2">Top Performer</h3>
                    <p className="text-sm opacity-90">Congratulations on your outstanding performance this quarter!</p>
                    </div> */}
                </div>
                </div>
            </main>
            </div>
        <Footer />
    </DashboardLayout>
  );
};

export default PerformanceFeedbackPage;