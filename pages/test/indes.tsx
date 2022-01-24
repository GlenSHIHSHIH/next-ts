import { Grid, Typography } from "@mui/material";
import RecursiveTreeView, { RenderTree } from "component/backstage/TreeFrame";
import { useState } from "react";

export const data: RenderTree = {
    "id": 0,
    "name": "teeets",
    "child": [
        {
            "id": 1,
            "name": "系統管理",
            "child": [
                {
                    "id": 3,
                    "name": "使用者管理",
                    "child": [
                        {
                            "id": 4,
                            "name": "使用者介面",

                            "child": null
                        },
                        {
                            "id": 5,
                            "name": "使用者新增",

                            "child": null
                        },
                        {
                            "id": 6,
                            "name": "使用者刪除",

                            "child": null
                        },
                        {
                            "id": 7,
                            "name": "使用者修改",

                            "child": null
                        }
                    ]
                },
                {
                    "id": 8,
                    "name": "菜單管理",
                    "child": [
                        {
                            "id": 9,
                            "name": "菜單介面",

                            "child": null
                        },
                        {
                            "id": 10,
                            "name": "菜單新增",

                            "child": null
                        },
                        {
                            "id": 11,
                            "name": "菜單刪除",

                            "child": null
                        },
                        {
                            "id": 12,
                            "name": "菜單修改",

                            "child": null
                        }
                    ]
                },
                {
                    "id": 13,
                    "name": "角色管理",
                    "child": [
                        {
                            "id": 14,
                            "name": "角色介面",

                            "child": null
                        },
                        {
                            "id": 15,
                            "name": "角色新增",

                            "child": null
                        },
                        {
                            "id": 16,
                            "name": "角色刪除",

                            "child": null
                        },
                        {
                            "id": 17,
                            "name": "角色修改",

                            "child": null
                        }
                    ]
                }
            ]
        },
        {
            "id": 2,
            "name": "商品管理",
            "child": [
                {
                    "id": 18,
                    "name": "商品管理",
                    "child": [
                        {
                            "id": 19,
                            "name": "商品介面",

                            "child": null
                        },
                        {
                            "id": 20,
                            "name": "商品新增",

                            "child": null
                        },
                        {
                            "id": 21,
                            "name": "商品刪除",

                            "child": null
                        },
                        {
                            "id": 22,
                            "name": "商品修改",

                            "child": null
                        }
                    ]
                },
                {
                    "id": 23,
                    "name": "圖片管理",
                    "child": [
                        {
                            "id": 24,
                            "name": "圖片介面",

                            "child": null
                        },
                        {
                            "id": 25,
                            "name": "圖片新增",

                            "child": null
                        },
                        {
                            "id": 26,
                            "name": "圖片刪除",

                            "child": null
                        },
                        {
                            "id": 27,
                            "name": "圖片修改",

                            "child": null
                        }
                    ]
                }
            ]
        }
    ]
}


export default function Test() {
    // 樹狀資料關聯
    const [selected, setSelected] = useState<string[]>([]);

    const setSelect = (value: string[]) => {
        setSelected(value);
        console.log(selected);
        console.log("selected");
        console.log(value);
    }

    return (
        <div>
            <Grid container direction="row" justifyContent="flex-start" alignItems="center" >
                <Grid item xs={2} md={2} >
                    <Typography align="right">權限圖：</Typography>
                </Grid >
                <Grid item xs={9} md={9} marginLeft={2}>
                    {RecursiveTreeView(data, selected, setSelect)}

                </Grid>
            </Grid >
        </div>
    )
}