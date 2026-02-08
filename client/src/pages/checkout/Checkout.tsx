import React from "react";
import { Outlet } from "react-router-dom";

const Checkout: React.FC = () => {
    return (
        <>
            <Outlet />
        </>
    );
};

export default Checkout;