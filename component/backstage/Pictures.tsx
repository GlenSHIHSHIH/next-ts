
import { FormControlLabel, Grid, Switch, TextField, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Input from '@mui/material/Input';
import * as React from 'react';

interface PicturesProp {
    id: number,
    name: string,
    pictureUrl: string,
    alt: string,
    url: string,
    status: boolean,
    weight: number,
}

const Pictures: React.FC<PicturesProp> = (props: any) => {
    var { id, name, pictureUrl, alt, url, status, weight } = props;

    return (
        <div>
            <Grid container direction="row" justifyContent="flex-start" alignItems="center" marginBottom={2}>
                <Grid item xs={2} md={2}>
                    <Typography align="right">id：</Typography>
                </Grid>
                <Grid item xs={9} md={9} marginLeft={2}>
                    <TextField fullWidth id="outlined-search" required label="id" value={id} disabled />
                </Grid>
            </Grid>
            <Grid container direction="row" justifyContent="space-between" alignItems="center" >
                <Grid item xs={9} md={9}>
                    <img src={pictureUrl} alt={alt} />
                </Grid>
                <Grid item xs={2} md={2} marginLeft={2}>
                    <label htmlFor="contained-button-file">
                        <Input accept="image/*" id="contained-button-file" multiple type="file" />
                        <Button variant="contained" component="span">
                            Upload
                        </Button>
                    </label>
                </Grid>
            </Grid>
            <Grid container direction="row" justifyContent="flex-start" alignItems="center" >
                <Grid item xs={2} md={2}>
                    <Typography align="right">狀態：</Typography>
                </Grid>
                <Grid item xs={9} md={9} marginLeft={2}>
                    <FormControlLabel label="狀態" control={<Switch defaultChecked={status}
                        onChange={(e, checked) => status= checked} />} />
                </Grid>
            </Grid>
            <Grid container direction="row" justifyContent="flex-start" alignItems="center" marginBottom={2}>
                <Grid item xs={2} md={2}>
                    <Typography align="right">名稱：</Typography>
                </Grid>
                <Grid item xs={9} md={9} marginLeft={2}>
                    <TextField fullWidth id="outlined-search" required label="名稱" value={name}
                        onChange={e => name = e.target.value} />
                </Grid>
            </Grid>
            <Grid container direction="row" justifyContent="flex-start" alignItems="center" marginBottom={2}>
                <Grid item xs={2} md={2}>
                    <Typography align="right">別名Alt：</Typography>
                </Grid>
                <Grid item xs={9} md={9} marginLeft={2}>
                    <TextField fullWidth id="outlined-search" required label="別名Alt" value={alt}
                        onChange={e => alt = e.target.value} />
                </Grid>
            </Grid>
            <Grid container direction="row" justifyContent="flex-start" alignItems="center" marginBottom={2}>
                <Grid item xs={2} md={2}>
                    <Typography align="right">網址：</Typography>
                </Grid>
                <Grid item xs={9} md={9} marginLeft={2}>
                    <TextField fullWidth id="outlined-search" required label="網址" value={url}
                        onChange={e => url = e.target.value} />
                </Grid>
            </Grid>
            <Grid container direction="row" justifyContent="flex-start" alignItems="center" marginBottom={2}>
                <Grid item xs={2} md={2}>
                    <Typography align="right">權重：</Typography>
                </Grid>
                <Grid item xs={9} md={9} marginLeft={2}>
                    <TextField fullWidth id="outlined-search" required label="權重" type="number" value={weight}
                        onChange={e => weight = e.target.value} />
                </Grid>
            </Grid>
        </div >
    );
}

export default Pictures;