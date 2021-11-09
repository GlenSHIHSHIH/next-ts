import { Button, Card, CardActions, CardContent, CardHeader, CardMedia, IconButton, Typography } from "@mui/material";
import React from "react";
import cardStyle from "styles/component/ProductionCard.module.css";


interface CardProps {
    productionName?: string;
    productionCategory?: string;
    productionIMG?: string;
    productionDescript?: string;
    productionPrice?: Number;
    shopeeUrl?: string;
    urlName?: string;
    alt:string;

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

    return (
        <Card sx={{ maxWidth: 320 }}>
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
            <CardContent className={cardStyle.cardContent}>
                <Typography variant="subtitle1" >
                    ${productionPrice} <br />
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {productionDescript} {/*/敘述*/}
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small" href={shopeeUrl} >{urlName}</Button>
            </CardActions>
        </Card>
    );
}
export default ProductionCard;