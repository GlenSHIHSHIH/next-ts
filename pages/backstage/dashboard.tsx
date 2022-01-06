import AuthLayout from "component/backstage/AuthLayout";
import Navigation from "component/backstage/Navigation";
import React from "react";

export default function DashBoard() {
 let children="dashboard test";
    return (
        <AuthLayout>
            <Navigation>
                {children}
            </Navigation>
        </AuthLayout>
    )
}