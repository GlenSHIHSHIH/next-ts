import React from "react";
import { Button, Card, CardActions, CardContent, CardHeader, CardMedia, IconButton, Typography } from "@mui/material";


interface CardProps {
    productionName?: string;
    productionCategory?: string;
    productionIMG?: string;
    productionDescript?: string;
    productionPrice?: Number;
    shopeeUrl?: string;
    urlName?: string;
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
    } = props;

    return (
        <Card sx={{ maxWidth: 345 }}>
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
                height="194"
                image={productionIMG} //"圖片路徑"
                alt="Paella dish"
            />
            <CardContent>
                <Typography variant="body2" color="text.secondary">
                    <div> ${productionPrice} </div>
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