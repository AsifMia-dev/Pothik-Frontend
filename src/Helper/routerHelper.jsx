import React from 'react'
import Homepage from '../pages/Homepage';
import PrivateRoute from '../routes/PrivateRoute';

export const allRoutes = [
    {
        path : "/",
        element : Homepage,
        isPrivate : false
    }
]

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

