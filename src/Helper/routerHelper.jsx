import React from 'react'
import Homepage from '../pages/Homepage';
import DestinationExplorer from '../pages/DestinationExplorer.jsx';
import PrivateRoute from '../routes/PrivateRoute';

export const allRoutes = [
    {
        path : "/",
        element : Homepage,
        isPrivate : false
    },
    {
      path: "/destinations",
      element: DestinationExplorer,
      isPrivate: false,
    }
];

export const renderRouterElement = (route) => {
  const Component = route.element;
  if (route.isPrivate){
    return (
        <PrivateRoute role={route.role}>
            <Component />
        </PrivateRoute>
    )
  }
  return <Component />;
}

