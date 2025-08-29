import { useMemo } from 'react';
import { useGetProfileQuery } from 'api/apiSlice';
import routes from 'routes';

export const useFilteredRoutes = () => {
  const { data: profile, isLoading } = useGetProfileQuery();
  
  const filteredRoutes = useMemo(() => {
    if (isLoading || !profile) {
      return routes;
    }
    
    const userDepartment = profile?.department?.name;
    const userRole = profile?.role?.name;
    
    return routes.filter(route => {
      // Filter out "Create" route if user is not in ICT department
      if (route.key === 'create' && userDepartment !== 'ICT') {
        return false;
      }

       if (route.key === 'team' && (
        userRole !== 'HOD' && 
        userRole !== 'MD' && 
        userRole !== 'COO' && 
        userRole !== 'CFO'
        )) {
        return false;
        }
    
      // Add more filtering rules here if needed
      // For example, you could also hide other routes based on roles:
      // if (route.key === 'some-admin-route' && !profile.isAdmin) {
      //   return false;
      // }
      
      return true;
    });
  }, [profile, isLoading]);
  
  return { routes: filteredRoutes, profile, isLoading };
};