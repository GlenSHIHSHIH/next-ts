import { Alert, AlertTitle, Box, Snackbar, Stack } from "@mui/material";
import React from "react";

export interface AlertMsg {
    msg: string,
    show: boolean,
    type?: AlertColor,
}

export function setAlertData(data: AlertMsg,msg:string,show:boolean,type:AlertColor){
    var alertData = { ...data };
    alertData.msg = msg;
    alertData.show = show;
    alertData.type = type;
    return alertData;
}

export function setAlertAutoClose(data: AlertMsg){
    var alertData = { ...data };
    alertData.show = false;
    return alertData;
}

type AlertColor = 'success' | 'info' | 'warning' | 'error';
interface AlertProps {
    strongContent: string,
    alertType: AlertColor,
    isOpen: boolean,
    setClose: () => void,
    autoHide: number,
}


const AlertFrame: React.FC<AlertProps> = (props) => {
    let { strongContent, alertType, isOpen, autoHide, setClose } = props;
    const [open, setOpen] = React.useState(isOpen);

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setClose();
        setOpen(false);
    };


    return (

        <Snackbar open={open} autoHideDuration={autoHide} onClose={handleClose} sx={{ width: '50%' }}
            anchorOrigin={{
                vertical: 'top',
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