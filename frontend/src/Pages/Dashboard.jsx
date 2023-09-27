import React from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import Sidebar from "../Components/Core/Dashboard/Sidebar";

const Dashboard = () => {

    const {loading: authloading} = useSelector( (state) => state.auth);
    const {loading: profileLoading} = useSelector( (state) => state.profile);

    if(profileLoading || authloading) {
        return (
            <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
                Loading ...
            </div>
        )
    }

    return(
        <div className="relative flex min-h[clac(100vh-3.5rem)]">
            <Sidebar />
            <div className="h-[calc(100vh-3.5rem)] overflow-auto flex-1">
                <div className="mx-auto w-11/12 max-w-[1000px] py-10">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default Dashboard;