import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { allRoutes, renderRouterElement } from '../Helper/routerHelper';

const RouteComponents = () => {
  return (
    <Routes>
      {allRoutes.map((route) => {
        const Element = renderRouterElement(route);

        // If the route has children (like AdminLayout)
        if (route.children) {
          return (
            <Route key={route.path} path={route.path} element={Element}>
              {route.children.map((child) => (
                <Route
                  key={child.path}
                  path={child.path}
                  element={<child.element />}
                />
              ))}
            </Route>
          );
        }

        // Normal route
        return (
          <Route
            key={route.path}
            path={route.path}
            element={Element}
          />
        );
      })}
    </Routes>
  );
};

export default RouteComponents;
