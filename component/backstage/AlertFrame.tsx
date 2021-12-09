import { Alert, AlertTitle, Stack } from "@mui/material";
import React from "react";

type AlertColor = 'success' | 'info' | 'warning' | 'error';

interface AlertProps {
    content: string,
    strongContent: string,
    alertType: AlertColor
}

const AlertFrame: React.FC<AlertProps> = (props) => {
    const { content, strongContent, alertType } = props;
    var firstUpper = alertType.substring(0, 1).toUpperCase();
    var otherLower = alertType.substring(1, alertType.length+1).toLowerCase();
    var title = firstUpper + otherLower;
    console.log(title);
    return (
        <Stack sx={{ width: '100%' }} >
            <Alert severity={alertType}>
                <AlertTitle>{title}</AlertTitle>
                {content}<strong>{strongContent}</strong>
            </Alert>
        </Stack>
    )
}


export default AlertFrame;