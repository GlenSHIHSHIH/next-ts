
import DeleteIcon from '@mui/icons-material/Delete';
import { Divider, FormControlLabel, Grid, IconButton, Switch, TextField, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Input from '@mui/material/Input';
import * as React from 'react';

interface PicturesProp {
    id: number,
    index: number,
    name: string,
    pictureUrl: string,
    alt: string,
    url: string,
    status: boolean,
    weight: number,
    height: number,
    width: number,
    setAlertMsgData: (text: string) => void,
    delPicture: (pIndex: number) => void,
    setPictureData: (pIndex: number, name: any, data: any) => void,
}

const Pictures: React.FC<PicturesProp> = (props: any) => {
    const { id, index, name, pictureUrl, alt, url, status, weight, height, width, setAlertMsgData, delPicture, setPictureData } = props;
    const addImg = (event: React.ChangeEvent<HTMLInputElement>) => {
        var filter = /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)$/i;
        var reader = new FileReader();
        var file = event.target.files ? event.target.files[0] : null;
        if (file == null) {
            return;
        }

        if (!filter.test(file.type)) {
            setAlertMsgData("文件必須為圖片!");
            return;
        }
        reader.readAsDataURL(file);
        reader.onloadend = function (e) {
            setPictureData(index, "pictureUrl", reader.result);
            setPictureData(index, "name", "");
        };

    }

    return (
        <Grid container direction="column" justifyContent="center" alignItems="flex-start" marginTop={2}>
            <Grid container direction="row" justifyContent="flex-start" alignItems="center" marginBottom={2}>
                <Grid item xs={1.5} md={1.5} >
                    <IconButton aria-label="delete" sx={{ float: "right" }} size="large" onClick={e => delPicture(index)}>
                        <DeleteIcon />
                    </IconButton>
                </Grid>
                <Grid item xs={0.5} md={0.5} >
                    <Typography align="right" >id：</Typography>
                </Grid>
                <Grid item xs={6} md={6} marginLeft={2}>
                    <TextField fullWidth id="outlined-search" required label="id" value={id} disabled />
                </Grid>
            </Grid>
            <Grid container direction="row" justifyContent="flex-start" alignItems="center" marginBottom={2}>
                <Grid item xs={2} md={2}>
                    <Typography align="right">圖片：</Typography>
                </Grid>
                <Grid item xs={6} md={6} marginLeft={2}>
                    <img src={pictureUrl} height={pictureUrl ? height : 0} width={pictureUrl ? width : 0} />
                    <label >
                        <Input type="file" id="contained-button-file" onChange={addImg} sx={{ display: 'none' }} />
                        <Button variant="contained" component="div" size="medium">
                            Upload
                        </Button>
                    </label>
                </Grid>
            </Grid>
            {/* <Grid container direction="row" justifyContent="flex-start" alignItems="center" >
                <Grid item xs={2} md={2}>
                    <Typography align="right">狀態：</Typography>
                </Grid>
                <Grid item xs={6} md={6} marginLeft={2}>
                    <FormControlLabel label="狀態" control={<Switch defaultChecked={status}
                        onChange={(e, checked) => setPictureData(index, "status", checked)} />} />
                </Grid>
            </Grid> */}
            {/* <Grid container direction="row" justifyContent="flex-start" alignItems="center" marginBottom={2}>
                <Grid item xs={2} md={2}>
                    <Typography align="right">名稱：</Typography>
                </Grid>
                <Grid item xs={6} md={6} marginLeft={2}>
                    <TextField fullWidth id="outlined-search" required label="名稱" value={name}
                        onChange={e => setPictureData(index, "name", e.target.value)} />
                </Grid>
            </Grid> */}
            <Grid container direction="row" justifyContent="flex-start" alignItems="center" marginBottom={2}>
                <Grid item xs={2} md={2}>
                    <Typography align="right">替代名稱：</Typography>
                </Grid>
                <Grid item xs={6} md={6} marginLeft={2}>
                    <TextField fullWidth id="outlined-search" required label="別名Alt" value={alt}
                        onChange={e => setPictureData(index, "alt", e.target.value)} />
                </Grid>
            </Grid>
            <Grid container direction="row" justifyContent="flex-start" alignItems="center" marginBottom={2}>
                <Grid item xs={2} md={2}>
                    <Typography align="right">網址：</Typography>
                </Grid>
                <Grid item xs={6} md={6} marginLeft={2}>
                    <TextField fullWidth id="outlined-search" required label="網址" value={url}
                        onChange={e => setPictureData(index, "url", e.target.value)} />
                </Grid>
            </Grid>
            <Grid container direction="row" justifyContent="flex-start" alignItems="center" marginBottom={2}>
                <Grid item xs={2} md={2}>
                    <Typography align="right">權重：</Typography>
                </Grid>
                <Grid item xs={6} md={6} marginLeft={2}>
                    <TextField fullWidth id="outlined-search" required label="權重" type="number" value={weight}
                        onChange={e => setPictureData(index, "weight", e.target.value)} />
                </Grid>
            </Grid>
            <Grid container direction="row" justifyContent="flex-start" alignItems="center" >
                <Grid item xs={2} md={2}>
                    <Typography align="right">狀態：</Typography>
                </Grid>
                <Grid item xs={6} md={6} marginLeft={2}>
                    <FormControlLabel label="狀態" control={<Switch defaultChecked={status}
                        onChange={(e, checked) => setPictureData(index, "status", checked)} />} />
                </Grid>
            </Grid>
            <Grid container direction="row" justifyContent="center" alignItems="center" marginBottom={2} marginTop={2}>
                <Grid  item xs={10} md={10} >
                    <Divider ></Divider>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default Pictures;