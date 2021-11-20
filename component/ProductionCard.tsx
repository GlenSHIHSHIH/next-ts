import { Button, Card, CardActions, CardContent, CardHeader, CardMedia, Grid, IconButton, Typography } from "@mui/material";
import React from "react";
import cardStyle from "styles/component/ProductionCard.module.css";
import { createTheme, responsiveFontSizes, ThemeProvider } from '@mui/material/styles';


interface CardProps {
    productionName?: string;
    productionCategory?: string;
    productionIMG?: string;
    productionDescript?: string;
    productionPrice?: Number;
    shopeeUrl?: string;
    urlName?: string;
    alt: string;

}

const ProductionCard: React.FC<CardProps> = (props) => {

    const {
        productionName,
        productionCategory,
        productionIMG,
        productionDescript,
        productionPrice,
        shopeeUrl,
        urlName,
        alt,
    } = props;

    let theme = createTheme();
    theme = responsiveFontSizes(theme);

    return (
        <Card sx={{ maxWidth: 320 }}>
            <ThemeProvider theme={theme}>
                <CardHeader
                    action={
                        <IconButton aria-label="settings">
                            {/* <MoreVertIcon /> */}
                        </IconButton>
                    }
                    title={productionName}          //"商品名稱"
                    subheader={productionCategory}  //"分類"
                />
                <CardMedia
                    component="img"
                    height="320"
                    width="320"
                    image={productionIMG} //"圖片路徑"
                    alt={alt}
                />
                <CardContent className={cardStyle.cardContent} >
                    <Typography variant="h5" marginTop={1} marginBottom={1}>
                        ${productionPrice} <br />
                    </Typography>
                    <Typography variant="body1" color="text.secondary" minHeight={100}>
                        {productionDescript} {/*/敘述*/}
                    </Typography>
                </CardContent>
                <CardActions >
                    <Grid container item justifyContent="flex-end" alignItems="center">
                        <Button color="warning" size="large" variant="contained" href={shopeeUrl} >{urlName}</Button>
                    </Grid>
                </CardActions>
            </ThemeProvider>
        </Card>
    );
}
export default ProductionCard;