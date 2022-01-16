import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Paper, { PaperProps } from '@mui/material/Paper';
import Draggable from 'react-draggable';

function PaperComponent(props: PaperProps) {
    return (
        <Draggable
            handle="#draggable-dialog-title"
            cancel={'[class*="MuiDialogContent-root"]'}
        >
            <Paper {...props} />
        </Draggable>
    );
}

interface DialogProp {
    title: string,
    closeHandle: () => void,
    saveHandle: () => void,
    children?: any,
    open: boolean,
    className: string,
}

const DraggableDialog: React.FC<DialogProp> = (props: any) => {
    const { title, children, closeHandle, saveHandle, open, className } = props;

    return (
        <div>
            <Dialog
                open={open}
                onClose={closeHandle}
                PaperComponent={PaperComponent}
                aria-labelledby="draggable-dialog-title"
                fullWidth
            >
                <DialogTitle className={className} color='white' style={{ cursor: 'move' }} id="draggable-dialog-title">
                    {title}
                </DialogTitle>
                <form onSubmit={saveHandle}>
                    <DialogContent>
                        {/* <DialogContentText>
                    </DialogContentText> */}
                        {children}
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" type="submit" size="medium" color="primary" autoFocus >
                            Save
                        </Button>
                        <Button variant="contained" onClick={closeHandle} size="medium" color="error">
                            Cancel
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </div>
    );
}

export default DraggableDialog;