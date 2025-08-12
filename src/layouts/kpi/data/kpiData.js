// data/kpiData.js
import { TrendingUp, Users, CheckCircle, Target, DollarSign, Award } from 'lucide-react';

// Sample KPI data for Sarah
export const sarahKpis = [
  {
    id: 1,
    name: 'Sales Growth',
    dueDate: '2024-12-31',
    status: 'In Progress',
    progress: 75,
    icon: <TrendingUp className="w-6 h-6" />,
    color: 'bg-blue-500',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-600',
    progressColor: 'bg-blue-500'
  },
  {
    id: 2,
    name: 'Customer Satisfaction',
    dueDate: '2024-11-15',
    status: 'Completed',
    progress: 100,
    icon: <Users className="w-6 h-6" />,
    color: 'bg-green-500',
    bgColor: 'bg-green-50',
    textColor: 'text-green-600',
    progressColor: 'bg-green-500'
  },
  {
    id: 3,
    name: 'Project Completion Rate',
    dueDate: '2024-12-31',
    status: 'In Progress',
    progress: 50,
    icon: <CheckCircle className="w-6 h-6" />,
    color: 'bg-orange-500',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-600',
    progressColor: 'bg-orange-500'
  }
];

// Sample KPI data for different teams/users
export const teamKpis = [
  {
    id: 4,
    name: 'Revenue Target',
    dueDate: '2024-12-31',
    status: 'In Progress',
    progress: 85,
    icon: <DollarSign className="w-6 h-6" />,
    color: 'bg-green-500',
    bgColor: 'bg-green-50',
    textColor: 'text-green-600',
    progressColor: 'bg-green-500'
  },
  {
    id: 5,
    name: 'Quality Score',
    dueDate: '2024-11-30',
    status: 'Completed',
    progress: 100,
    icon: <Award className="w-6 h-6" />,
    color: 'bg-purple-500',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-600',
    progressColor: 'bg-purple-500'
  },
  {
    id: 6,
    name: 'Team Productivity',
    dueDate: '2025-01-15',
    status: 'Not Started',
    progress: 0,
    icon: <Target className="w-6 h-6" />,
    color: 'bg-gray-500',
    bgColor: 'bg-gray-50',
    textColor: 'text-gray-600',
    progressColor: 'bg-gray-500'
  }
];

// Personal KPIs
export const personalKpis = [
  {
    id: 7,
    name: 'Learning Goals',
    dueDate: '2024-12-31',
    status: 'In Progress',
    progress: 60,
    icon: <Award className="w-6 h-6" />,
    color: 'bg-indigo-500',
    bgColor: 'bg-indigo-50',
    textColor: 'text-indigo-600',
    progressColor: 'bg-indigo-500'
  }
];

// Default KPI template
export const createDefaultKpi = (overrides = {}) => ({
  id: Date.now(),
  name: 'New KPI',
  dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
  status: 'Not Started',
  progress: 0,
  icon: <Target className="w-6 h-6" />,
  color: 'bg-blue-500',
  bgColor: 'bg-blue-50',
  textColor: 'text-blue-600',
  progressColor: 'bg-blue-500',
  ...overrides
});