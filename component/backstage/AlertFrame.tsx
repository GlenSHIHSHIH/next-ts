import { Alert, AlertTitle, Box, Snackbar, Stack } from "@mui/material";
import React from "react";

export interface AlertMsg {
    msg:string,
    count:number,
}

type AlertColor = 'success' | 'info' | 'warning' | 'error';
interface AlertProps {
    strongContent: string,
    alertType: AlertColor,
    isOpen: boolean,
    autoHide: number,
}

const AlertFrame: React.FC<AlertProps> = (props) => {
    let { strongContent, alertType, isOpen, autoHide } = props;

    const [open, setOpen] = React.useState(isOpen);

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };


    return (

        <Snackbar open={open} autoHideDuration={autoHide} onClose={handleClose} sx={{ width: '100%' }}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}>
            <Box sx={{ width: '100%' }} >
                {strongContent &&
                    <Stack sx={{ width: '100%' }} >
                        <Alert severity={alertType}>
                            <AlertTitle>{alertType}</AlertTitle>
                            <strong>{strongContent}</strong>
                        </Alert>
                    </Stack>
                }
            </Box>
        </Snackbar>
    )
}


export default AlertFrame;