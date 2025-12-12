import React from 'react'
import {Routes, Route} from 'react-router-dom'

import { allRoutes , renderRouterElement } from '../Helper/routerHelper'

const RouteComponents = () => {
  return (
        <Routes>
            {
                allRoutes.map( (route) =>(
                    <Route
                        key = {route.path}
                        path= {route.path}
                        element= {renderRouterElement(route)}
                    />
                ))
            }
        </Routes>
  )
}

export default RouteComponents
