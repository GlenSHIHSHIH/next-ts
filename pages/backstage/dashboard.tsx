import AuthLayout from "component/backstage/AuthLayout";
import Navigation from "component/backstage/Navigation";
import React from "react";

export default function DashBoard() {
let title ="dashboard";
 let children="dashboard test";
    return (
        <AuthLayout>
            <Navigation title={title}>
                {children}
            </Navigation>
        </AuthLayout>
    )
}