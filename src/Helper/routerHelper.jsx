import React from 'react'
import NavBar from '../components/Layout-componets/NavBar.jsx'

export const allRoutes = [
    {
        path : "/",
        element : NavBar,
        isPrivate : false
    },
    {
        path : "/navbar",
        element : NavBar,
        isPrivate : true,
        role: "user"
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

