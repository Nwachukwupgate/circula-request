import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import {
  useGetNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
  useDeleteNotificationMutation,
  useClearReadNotificationsMutation
} from 'api/apiSlice';
import { 
  Bell, 
  CheckCircle, 
  XCircle, 
  Trash2, 
  CheckCheck,
  RefreshCw,
  Filter,
  Clock,
  AlertTriangle,
  FileText,
  Target,
  MessageSquare,
  Brain,
  Flag,
  Info,
  Megaphone
} from 'lucide-react';

const getNotificationIcon = (type) => {
  const icons = {
    circular_published: Megaphone,
    request_submitted: FileText,
    request_approved: CheckCircle,
    request_rejected: XCircle,
    kpi_assigned: Target,
    kpi_report_submitted: FileText,
    kpi_feedback_received: MessageSquare,
    kpi_reminder: Clock,
    kpi_overdue: AlertTriangle,
    feedback_request: MessageSquare,
    feedback_reply: MessageSquare,
    ai_insight: Brain,
    milestone_set: Flag,
    system: Info
  };
  return icons[type] || Bell;
};

const getNotificationColor = (type, priority) => {
  if (priority === 'urgent') return { bg: 'bg-red-100', text: 'text-red-600', border: 'border-red-200' };
  if (priority === 'high') return { bg: 'bg-amber-100', text: 'text-amber-600', border: 'border-amber-200' };
  
  const colors = {
    circular_published: { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200' },
    request_submitted: { bg: 'bg-violet-100', text: 'text-violet-600', border: 'border-violet-200' },
    request_approved: { bg: 'bg-emerald-100', text: 'text-emerald-600', border: 'border-emerald-200' },
    request_rejected: { bg: 'bg-red-100', text: 'text-red-600', border: 'border-red-200' },
    kpi_assigned: { bg: 'bg-indigo-100', text: 'text-indigo-600', border: 'border-indigo-200' },
    kpi_report_submitted: { bg: 'bg-cyan-100', text: 'text-cyan-600', border: 'border-cyan-200' },
    kpi_feedback_received: { bg: 'bg-teal-100', text: 'text-teal-600', border: 'border-teal-200' },
    kpi_reminder: { bg: 'bg-amber-100', text: 'text-amber-600', border: 'border-amber-200' },
    kpi_overdue: { bg: 'bg-red-100', text: 'text-red-600', border: 'border-red-200' },
    feedback_request: { bg: 'bg-violet-100', text: 'text-violet-600', border: 'border-violet-200' },
    feedback_reply: { bg: 'bg-emerald-100', text: 'text-emerald-600', border: 'border-emerald-200' },
    ai_insight: { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-200' },
    milestone_set: { bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-200' },
    system: { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200' }
  };
  return colors[type] || { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200' };
};

const formatTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const NotificationsPage = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all'); // all, unread, read
  const [typeFilter, setTypeFilter] = useState('all');
  const [page, setPage] = useState(0);
  const limit = 20;

  const { data, isLoading, refetch } = useGetNotificationsQuery({
    limit,
    offset: page * limit,
    unreadOnly: filter === 'unread'
  });

  const [markAsRead] = useMarkNotificationAsReadMutation();
  const [markAllAsRead] = useMarkAllNotificationsAsReadMutation();
  const [deleteNotification] = useDeleteNotificationMutation();
  const [clearRead] = useClearReadNotificationsMutation();

  const notifications = data?.notifications || [];
  const totalCount = data?.total || 0;
  const unreadCount = data?.unreadCount || 0;

  // Filter notifications by type
  const filteredNotifications = typeFilter === 'all' 
    ? notifications 
    : notifications.filter(n => n.type === typeFilter);

  // Group notifications by date
  const groupedNotifications = filteredNotifications.reduce((groups, notification) => {
    const date = new Date(notification.createdAt);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let groupKey;
    if (date.toDateString() === today.toDateString()) {
      groupKey = 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      groupKey = 'Yesterday';
    } else {
      groupKey = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    }

    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(notification);
    return groups;
  }, {});

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      await markAsRead(notification.id);
    }
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };

  const handleDelete = async (e, notificationId) => {
    e.stopPropagation();
    await deleteNotification(notificationId);
    refetch();
  };

  const notificationTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'circular_published', label: 'Circulars' },
    { value: 'request_submitted', label: 'Requests Pending' },
    { value: 'request_approved', label: 'Requests Approved' },
    { value: 'request_rejected', label: 'Requests Rejected' },
    { value: 'kpi_assigned', label: 'KPI Assigned' },
    { value: 'kpi_reminder', label: 'KPI Reminders' },
    { value: 'kpi_overdue', label: 'KPI Overdue' },
    { value: 'kpi_feedback_received', label: 'Feedback Received' },
    { value: 'feedback_request', label: 'Feedback Requested' },
    { value: 'ai_insight', label: 'AI Insights' }
  ];

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <div className="max-w-5xl mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Bell className="w-7 h-7" />
                Notifications
              </h1>
              <p className="text-gray-500 mt-1">
                {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'} • {totalCount} total
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={refetch}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                title="Refresh"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              {unreadCount > 0 && (
                <button
                  onClick={() => markAllAsRead()}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                >
                  <CheckCheck className="w-4 h-4" />
                  Mark all read
                </button>
              )}
              <button
                onClick={() => clearRead()}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                <Trash2 className="w-4 h-4" />
                Clear read
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-600">Filter:</span>
            </div>
            <div className="flex gap-2">
              {['all', 'unread', 'read'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    filter === f
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
            <div className="h-6 w-px bg-gray-200" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-50 text-gray-600 border-0 focus:ring-2 focus:ring-indigo-500"
            >
              {notificationTypes.map((type) => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          {/* Notifications List */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
              <Bell className="w-16 h-16 text-gray-200 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No notifications</h3>
              <p className="text-gray-500">
                {filter === 'unread' 
                  ? "You've read all your notifications!"
                  : "You don't have any notifications yet."}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedNotifications).map(([date, dateNotifications]) => (
                <div key={date}>
                  <h3 className="text-sm font-semibold text-gray-500 mb-3 px-1">{date}</h3>
                  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                    {dateNotifications.map((notification, index) => {
                      const IconComponent = getNotificationIcon(notification.type);
                      const colors = getNotificationColor(notification.type, notification.priority);
                      
                      return (
                        <div
                          key={notification.id}
                          onClick={() => handleNotificationClick(notification)}
                          className={`
                            relative p-4 cursor-pointer transition-all
                            ${!notification.isRead ? 'bg-indigo-50/50' : 'hover:bg-gray-50'}
                            ${index !== dateNotifications.length - 1 ? 'border-b border-gray-100' : ''}
                          `}
                        >
                          {/* Unread indicator */}
                          {!notification.isRead && (
                            <div className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-indigo-600" />
                          )}
                          
                          <div className="flex items-start gap-4 pl-4">
                            {/* Icon */}
                            <div className={`
                              w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0
                              ${colors.bg} ${colors.text}
                            `}>
                              <IconComponent className="w-6 h-6" />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-4">
                                <div>
                                  <h4 className={`font-semibold text-gray-900 ${!notification.isRead ? 'font-bold' : ''}`}>
                                    {notification.title}
                                  </h4>
                                  <p className="text-gray-600 text-sm mt-0.5 line-clamp-2">
                                    {notification.message}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  {(notification.priority === 'urgent' || notification.priority === 'high') && (
                                    <span className={`
                                      px-2 py-0.5 rounded-full text-xs font-medium
                                      ${notification.priority === 'urgent' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}
                                    `}>
                                      {notification.priority}
                                    </span>
                                  )}
                                  <button
                                    onClick={(e) => handleDelete(e, notification.id)}
                                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                              <div className="flex items-center gap-3 mt-2">
                                <span className="text-xs text-gray-400">
                                  {formatTimeAgo(notification.createdAt)}
                                </span>
                                <span className={`
                                  px-2 py-0.5 rounded-full text-xs font-medium capitalize
                                  ${colors.bg} ${colors.text}
                                `}>
                                  {notification.type.replace(/_/g, ' ')}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalCount > limit && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-sm text-gray-500">
                Page {page + 1} of {Math.ceil(totalCount / limit)}
              </span>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={(page + 1) * limit >= totalCount}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
};

export default NotificationsPage;
