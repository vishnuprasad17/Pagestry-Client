import React from 'react'
import { Outlet } from 'react-router-dom'

const UserDashboard: React.FC = () => {
  return (
    <>
      <Outlet />
    </>
  )
}

export default UserDashboard;
