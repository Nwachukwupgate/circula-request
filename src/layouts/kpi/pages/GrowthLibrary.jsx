import React, { useState } from 'react';
import { Search, BookOpen, Play, GraduationCap, Clock, Users, Filter, Star, ChevronDown} from 'lucide-react';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MDBox from "components/MDBox";

const GrowthLibrary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const resources = [
    {
      id: 1,
      type: 'article',
      title: 'The 7 Habits of Highly Effective People',
      description: 'Learn the timeless principles of personal and professional effectiveness.',
      category: 'Personal Development',
      rating: 4.8,
      duration: '15 min read',
      recommended: true,
      color: 'bg-gradient-to-br from-teal-400 to-teal-600'
    },
    {
      id: 2,
      type: 'video',
      title: 'Effective Communication Strategies',
      description: 'Improve your communication skills with practical tips and techniques.',
      category: 'Communication',
      rating: 4.7,
      duration: '25 min',
      recommended: true,
      color: 'bg-gradient-to-br from-blue-500 to-indigo-600'
    },
    {
      id: 3,
      type: 'course',
      title: 'Project Management Fundamentals',
      description: 'Master the basics of project management, from planning to execution.',
      category: 'Management',
      rating: 4.9,
      duration: '2 hours',
      recommended: true,
      color: 'bg-gradient-to-br from-green-400 to-emerald-600'
    },
    {
      id: 4,
      type: 'article',
      title: 'Time Management Techniques',
      description: 'Learn how to prioritize tasks and manage your time effectively.',
      category: 'Productivity',
      rating: 4.6,
      duration: '12 min read',
      recommended: false,
      color: 'bg-gradient-to-br from-purple-400 to-purple-600'
    },
    {
      id: 5,
      type: 'video',
      title: 'Conflict Resolution Skills',
      description: 'Develop strategies for resolving conflicts in the workplace.',
      category: 'Leadership',
      rating: 4.5,
      duration: '30 min',
      recommended: false,
      color: 'bg-gradient-to-br from-orange-400 to-red-500'
    }
  ];

  const filterOptions = [
    { value: 'all', label: 'All Resources' },
    { value: 'article', label: 'Articles' },
    { value: 'video', label: 'Videos' },
    { value: 'course', label: 'Courses' }
  ];

  const getTypeIcon = (type) => {
    switch (type) {
      case 'article': return <BookOpen className="w-5 h-5" />;
      case 'video': return <Play className="w-5 h-5" />;
      case 'course': return <GraduationCap className="w-5 h-5" />;
      default: return <BookOpen className="w-5 h-5" />;
    }
  };

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || resource.type === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const recommendedResources = filteredResources.filter(resource => resource.recommended);
  const allResources = filteredResources.filter(resource => !resource.recommended);

  const ResourceCard = ({ resource }) => (
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
      <div className={`${resource.color} h-48 relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
          <div className="text-white text-center">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              {getTypeIcon(resource.type)}
            </div>
            <div className="text-xs uppercase tracking-wide font-medium opacity-90">
              {resource.type}
            </div>
          </div>
        </div>
        {resource.recommended && (
          <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
            <Star className="w-3 h-3 fill-current" />
            Recommended
          </div>
        )}
      </div>
      
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {resource.category}
          </span>
          <span className="text-sm text-gray-400 flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {resource.duration}
          </span>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          {resource.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {resource.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium text-gray-700">{resource.rating}</span>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            Start Learning
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
        <DashboardNavbar />
        <MDBox mb={2} />
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
            {/* Header */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="py-8">
                    <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Growth Library</h1>
                    <p className="text-xl text-gray-600">Explore resources to help you grow your skills and advance your career</p>
                    </div>
                    
                    {/* Search and Filters */}
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                        type="text"
                        placeholder="Search for resources..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    
                    <div className="relative">
                        <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                        <Filter className="w-5 h-5" />
                        <span>{filterOptions.find(opt => opt.value === selectedFilter)?.label}</span>
                        <ChevronDown className="w-4 h-4" />
                        </button>
                        
                        {showFilters && (
                        <div className="absolute top-full mt-2 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-40">
                            {filterOptions.map(option => (
                            <button
                                key={option.value}
                                onClick={() => {
                                setSelectedFilter(option.value);
                                setShowFilters(false);
                                }}
                                className={`w-full text-left px-4 py-2 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                                selectedFilter === option.value ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                                }`}
                            >
                                {option.label}
                            </button>
                            ))}
                        </div>
                        )}
                    </div>
                    </div>
                </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Recommended Section */}
                {recommendedResources.length > 0 && (
                <div className="mb-12">
                    <div className="flex items-center gap-2 mb-6">
                    <Star className="w-6 h-6 text-yellow-500 fill-current" />
                    <h2 className="text-2xl font-bold text-gray-900">Recommended for You</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recommendedResources.map(resource => (
                        <ResourceCard key={resource.id} resource={resource} />
                    ))}
                    </div>
                </div>
                )}

                {/* All Resources Section */}
                {allResources.length > 0 && (
                <div>
                    <div className="flex items-center gap-2 mb-6">
                    <Users className="w-6 h-6 text-gray-600" />
                    <h2 className="text-2xl font-bold text-gray-900">All Resources</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {allResources.map(resource => (
                        <ResourceCard key={resource.id} resource={resource} />
                    ))}
                    </div>
                </div>
                )}

                {/* No Results */}
                {filteredResources.length === 0 && (
                <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No resources found</h3>
                    <p className="text-gray-600">Try adjusting your search or filter criteria</p>
                </div>
                )}
            </div>
            </div>
        <Footer />
    </DashboardLayout>
  );
};

export default GrowthLibrary;