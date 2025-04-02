import { useLocation } from 'react-router-dom';

export const useActiveRoute = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    // Exact match for root path
    if (path === '/' && location.pathname === '/') {
      return true;
    }
    // Handle calculator category routes
    if (path.startsWith('/calculators') && location.pathname.startsWith('/calculators')) {
      // If it's exactly /calculators, only match that
      if (path === '/calculators') {
        return location.pathname === '/calculators';
      }
      // Otherwise check if the paths match
      return location.pathname.startsWith(path);
    }
    // For other routes, check if the pathname starts with the given path
    // but only if it's not the root path
    if (path !== '/') {
      return location.pathname.startsWith(path);
    }
    return false;
  };

  return { isActive };
};
