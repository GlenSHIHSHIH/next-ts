import { Grid, Theme, ThemeProvider, Typography } from '@mui/material';
import * as React from 'react';

interface PageTitle {
    url?: string,
    title?: string,
    icon?: string,
    theme: Theme,
    className?: string,
    gridColor?: string,
    fontColor?: string,
}

const PageTitle: React.FC<PageTitle> = (props) => {


    const {
        url,
        title = process.env.DEFAULT_TITLE,
        icon = process.env.DEFAULT_ICON,
        theme,
        className,
        gridColor = process.env.DEFAULT_PAGE_BACKGROUND_COLOR,
        fontColor = process.env.DEFAULT_PAGE_TITLE_FONT_COLOR
    } = props;


    return (
        <Grid container direction="row" justifyContent="center" alignItems="center" style={{ backgroundColor: gridColor }}>
            <ThemeProvider theme={theme} >
                {/* <Grid item md={1} xs={1} > */}
                <a href={url}>
                    <img src={icon} alt="" className={className} />
                </a>
                {/* </Grid> */}
                {/* <Grid container item md={11} xs={11} direction="column" justifyContent="center" alignItems="center"> */}
                <a href={url}>
                    <Typography marginBottom={1} marginTop={1} component="div" variant="h4" color={fontColor} className={className}>
                        <b> {title}</b>
                    </Typography>

                </a>
                {/* </Grid> */}
            </ThemeProvider>
        </Grid>
    );
}
export default PageTitle;
