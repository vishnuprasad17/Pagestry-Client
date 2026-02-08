
import React, { ReactNode } from 'react'
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { RootState } from '../redux/store';

interface AdminRouteProps {
  children: ReactNode;
}
const AdminRoute = ({children}: AdminRouteProps) => {
  const admin = useSelector((state: RootState) => state.admin.isLoggedIn);
  if(!admin) {
    return <Navigate to="/admin/login"/>
  }
  return children ?  children : <Outlet/>;
}

export default AdminRoute;