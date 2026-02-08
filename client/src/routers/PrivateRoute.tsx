import React, { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState } from "../redux/store";
import { USER } from '../constants/nav-routes/userRoutes';

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute = ({children}: PrivateRouteProps) => {
    const user = useSelector((state: RootState) => state.auth.user);

    if (!user) return <Navigate to={USER.LOGIN} replace/>

    return children;
}

export default PrivateRoute;