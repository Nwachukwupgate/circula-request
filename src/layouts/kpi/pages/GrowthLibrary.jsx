import React, { useState } from 'react';
import { Search, BookOpen, Play, GraduationCap, Clock, Users, Filter, Star, ChevronDown, ExternalLink, RefreshCw, Zap, Target, TrendingUp, AlertCircle } from 'lucide-react';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MDBox from "components/MDBox";
import { useGetGrowthLibraryResourcesQuery, useTrackResourceUsageMutation } from 'api/apiSlice';
import { toast } from 'react-toastify';

const GrowthLibrary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  // Fetch resources from API
  const { 
    data: libraryData, 
    isLoading, 
    error, 
    refetch 
  } = useGetGrowthLibraryResourcesQuery({
    search: searchTerm,
    type: selectedFilter,
    category: selectedCategory,
    limit: 20
  });

  const [trackUsage] = useTrackResourceUsageMutation();

  const filterOptions = [
    { value: 'all', label: 'All Resources' },
    { value: 'article', label: 'Articles' },
    { value: 'video', label: 'Videos' },
    { value: 'course', label: 'Courses' },
    { value: 'book', label: 'Books' },
    { value: 'tool', label: 'Tools' },
    { value: 'podcast', label: 'Podcasts' },
    { value: 'tutorial', label: 'Tutorials' },
    { value: 'webinar', label: 'Webinars' }
  ];

  const getTypeIcon = (type) => {
    switch (type) {
      case 'article': return <BookOpen className="w-5 h-5" />;
      case 'video': return <Play className="w-5 h-5" />;
      case 'course': return <GraduationCap className="w-5 h-5" />;
      case 'book': return <BookOpen className="w-5 h-5" />;
      case 'tool': return <Zap className="w-5 h-5" />;
      case 'podcast': return <Play className="w-5 h-5" />;
      case 'tutorial': return <GraduationCap className="w-5 h-5" />;
      case 'webinar': return <Users className="w-5 h-5" />;
      default: return <BookOpen className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'article': return 'bg-gradient-to-br from-teal-400 to-teal-600';
      case 'video': return 'bg-gradient-to-br from-blue-500 to-indigo-600';
      case 'course': return 'bg-gradient-to-br from-green-400 to-emerald-600';
      case 'book': return 'bg-gradient-to-br from-amber-400 to-orange-500';
      case 'tool': return 'bg-gradient-to-br from-purple-400 to-purple-600';
      case 'podcast': return 'bg-gradient-to-br from-pink-400 to-rose-500';
      case 'tutorial': return 'bg-gradient-to-br from-cyan-400 to-blue-500';
      case 'webinar': return 'bg-gradient-to-br from-indigo-400 to-violet-600';
      default: return 'bg-gradient-to-br from-gray-400 to-gray-600';
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStartLearning = async (resource) => {
    try {
      await trackUsage({ resourceId: resource.id }).unwrap();
      if (resource.url && resource.url !== '#') {
        window.open(resource.url, '_blank');
      } else {
        toast.info('Resource link not available yet');
      }
    } catch (err) {
      console.error('Error tracking resource usage:', err);
      // Still open the resource even if tracking fails
      if (resource.url && resource.url !== '#') {
        window.open(resource.url, '_blank');
      }
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    refetch();
  };

  const ResourceCard = ({ resource }) => (
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
      <div className={`${getTypeColor(resource.type)} h-40 relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
          <div className="text-white text-center">
            <div className="w-14 h-14 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
              {getTypeIcon(resource.type)}
            </div>
            <div className="text-xs uppercase tracking-wide font-medium opacity-90">
              {resource.type}
            </div>
          </div>
        </div>
        {resource.recommended && (
          <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
            <Star className="w-3 h-3 fill-current" />
            Recommended
          </div>
        )}
        {resource.aiGenerated && (
          <div className="absolute top-3 left-3 bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
            <Zap className="w-3 h-3" />
            AI Suggested
          </div>
        )}
      </div>
      
      <div className="p-5">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {resource.category}
          </span>
          {resource.estimatedDuration && (
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {resource.estimatedDuration}
            </span>
          )}
          {resource.priority && (
            <span className={`text-xs px-2 py-1 rounded-full ${getPriorityBadge(resource.priority)}`}>
              {resource.priority}
            </span>
          )}
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
          {resource.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {resource.description}
        </p>

        {resource.tags && resource.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {resource.tags.slice(0, 3).map((tag, idx) => (
              <span key={idx} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded">
                {tag}
              </span>
            ))}
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {resource.rating > 0 && (
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium text-gray-700">{resource.rating.toFixed(1)}</span>
              </div>
            )}
            {resource.usageCount > 0 && (
              <span className="text-xs text-gray-500">{resource.usageCount} views</span>
            )}
          </div>
          <button 
            onClick={() => handleStartLearning(resource)}
            className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Start
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );

  // Loading State
  if (isLoading) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox mb={2} />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading Growth Library...</p>
          </div>
        </div>
        <Footer />
      </DashboardLayout>
    );
  }

  // Error State
  if (error) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox mb={2} />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
          <div className="text-center bg-white p-8 rounded-xl shadow-lg">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Failed to Load Resources</h3>
            <p className="text-gray-600 mb-4">We couldn't load the growth library. Please try again.</p>
            <button 
              onClick={() => refetch()}
              className="flex items-center gap-2 mx-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </DashboardLayout>
    );
  }

  const { user, resources, categories } = libraryData || { user: {}, resources: { recommended: [], general: [] }, categories: [] };
  const recommendedResources = resources?.recommended || [];
  const generalResources = resources?.general || [];
  const allResources = [...recommendedResources, ...generalResources];

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mb={2} />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-8">
              {/* User Stats Banner */}
              {user && (
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 mb-8 text-white">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-bold mb-1">Welcome, {user.name || 'Learner'}!</h2>
                      <p className="text-blue-100">
                        {user.department} • {user.role}
                      </p>
                    </div>
                    <div className="flex gap-6">
                      <div className="text-center">
                        <div className="flex items-center gap-2 justify-center">
                          <Target className="w-5 h-5 text-blue-200" />
                          <span className="text-2xl font-bold">{user.activeKPIs || 0}</span>
                        </div>
                        <p className="text-xs text-blue-200">Active KPIs</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center gap-2 justify-center">
                          <TrendingUp className="w-5 h-5 text-blue-200" />
                          <span className="text-2xl font-bold">{user.averageProgress || 0}%</span>
                        </div>
                        <p className="text-xs text-blue-200">Avg Progress</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Growth Library</h1>
                <p className="text-xl text-gray-600">Explore resources tailored to your department and KPIs</p>
              </div>
              
              {/* Search and Filters */}
              <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-4 items-center justify-center">
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
                
                {/* Type Filter */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setShowFilters(!showFilters);
                      setShowCategoryDropdown(false);
                    }}
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
                          type="button"
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

                {/* Category Filter */}
                {categories && categories.length > 0 && (
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        setShowCategoryDropdown(!showCategoryDropdown);
                        setShowFilters(false);
                      }}
                      className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <BookOpen className="w-5 h-5" />
                      <span>{selectedCategory || 'All Categories'}</span>
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    
                    {showCategoryDropdown && (
                      <div className="absolute top-full mt-2 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-40 max-h-60 overflow-y-auto">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedCategory('');
                            setShowCategoryDropdown(false);
                          }}
                          className={`w-full text-left px-4 py-2 hover:bg-gray-50 first:rounded-t-lg ${
                            !selectedCategory ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                          }`}
                        >
                          All Categories
                        </button>
                        {categories.map(cat => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => {
                              setSelectedCategory(cat);
                              setShowCategoryDropdown(false);
                            }}
                            className={`w-full text-left px-4 py-2 hover:bg-gray-50 last:rounded-b-lg ${
                              selectedCategory === cat ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => refetch()}
                  className="p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  title="Refresh"
                >
                  <RefreshCw className="w-5 h-5 text-gray-600" />
                </button>
              </form>
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
                <span className="text-sm text-gray-500 ml-2">
                  Based on your department, role & KPIs
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendedResources.map(resource => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
              </div>
            </div>
          )}

          {/* General Resources Section */}
          {generalResources.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center gap-2 mb-6">
                <Users className="w-6 h-6 text-gray-600" />
                <h2 className="text-2xl font-bold text-gray-900">All Resources</h2>
                <span className="text-sm text-gray-500 ml-2">
                  General learning materials
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {generalResources.map(resource => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {allResources.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No resources found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || selectedFilter !== 'all' || selectedCategory
                  ? 'Try adjusting your search or filter criteria'
                  : 'Resources will appear here as they are added to the system'}
              </p>
              {(searchTerm || selectedFilter !== 'all' || selectedCategory) && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedFilter('all');
                    setSelectedCategory('');
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </DashboardLayout>
  );
};

export default GrowthLibrary;
