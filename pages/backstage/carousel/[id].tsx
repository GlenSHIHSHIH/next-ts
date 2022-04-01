import { useAuthStateContext } from '@context/context';
import { Auth } from '@context/reducer';
import Addicon from '@mui/icons-material/Add';
import { DateTimePicker } from '@mui/lab';
import { Button, FormControlLabel, Grid, IconButton, Switch, TextField, Typography } from "@mui/material";
import { carouselByIdApi, carouselEditByIdApi } from '@pages/api/backstage/carousel/carouselApi';
import { setValueToInterfaceProperty } from '@utils/base_fucntion';
import AlertFrame, { AlertMsg, setAlertAutoClose, setAlertData } from "component/backstage/AlertFrame";
import AuthLayout from 'component/backstage/AuthLayout';
import Navigation from "component/backstage/Navigation";
import Pictures from "component/backstage/Pictures";
import { useRouter } from 'next/router';
import { useEffect, useState } from "react";

interface CarouselData {
    id: number,
    name: string,
    weight: number,
    status: boolean,
    startTime: Date,
    endTime: Date,
    picture?: Picture[],
}

interface Picture {
    id: number,
    name: string,
    pictureUrl: string,
    alt: string,
    url: string,
    status: boolean,
    weight: number,
    height?: number,
    width?: number,
}

export default function CarouselFeature() {

    const StructInitial = () => {
        var data: CarouselData = {
            id: 0,
            name: "",
            weight: 0,
            status: true,
            startTime: new Date(),
            endTime: new Date(),
            picture: [],
        };
        return data;
    }

    const { state, dispatch } = useAuthStateContext();
    const auth: Auth = state;
    const [alertMsg, setAlertMsg] = useState<AlertMsg>({ msg: "", show: false });
    const [picture, setPicture] = useState<Picture[]>([]);
    const [carousel, setCarousel] = useState<CarouselData>(StructInitial());
    const [title, setTitle] = useState<string>("");
    const [pId, setPId] = useState<string | string[] | undefined>(useRouter().query['id']);

    useEffect(() => {
        var sId: string = pId?.toString() ?? "";
        if (isNaN(Number(sId))) {
            setTitle("新增");
        } else if (sId.length > 0) {
            setTitle("修改");
            getDataListForEdit(sId);
        }
    }, []);

    useEffect(() => {
    }, [carousel, picture]);

    //切換成 edit
    const getDataListForEdit = (id: string) => {
        carouselByIdApi(id, auth)?.then((resp: any) => {
            setCarousel(resp.data.carousel);
            setPicture(resp.data.picture);
        }).catch(error => {
            var alertData = setAlertData(alertMsg, error.response?.data?.msg ?? "抓取資料錯誤", true, "error");
            setAlertMsg(alertData);
        });
    }

    //alert 關閉通知
    const setAlertClose = () => {
        let alertData = setAlertAutoClose(alertMsg);
        setAlertMsg(alertData);
    }

    const setAlertMsgData = (text: string) => {
        var alertData = setAlertData(alertMsg, text, true, "error");
        setAlertMsg(alertData);
    }

    const addPictureStruct = () => {
        var data: Picture = {
            id: 0,
            name: "",
            pictureUrl: "",
            alt: "",
            url: "",
            status: true,
            weight: 0,
        }
        setPicture(picture => picture.concat(data));
    }

    const deletePicture = (pIndex: number) => {
        var pData: Picture[] = [...picture];
        // delete pData[pIndex];
        pData = pData.filter((value: Picture, index: number) => { return index != pIndex });
        setPicture([...pData]);
    }

    const setPictureData = (pIndex: number, name: any, data: any) => {
        var pData: Picture[] = [...picture];
        setValueToInterfaceProperty(pData[pIndex], name, data);
        setPicture([...pData]);
    }

    const sned = () => {
        var cData: CarouselData = { ...carousel };
        var pData: Picture[] = [...picture];
        cData.picture = pData;
        carouselEditByIdApi(cData, auth)?.then((resp: any) => {
            console.log(resp);
        }).catch(error => {
            var alertData = setAlertData(alertMsg, error.response?.data?.msg ?? "抓取資料錯誤", true, "error");
            setAlertMsg(alertData);
        });
        console.log(cData);
    }

    //資料儲存
    const setStructData = (name: any, value: any) => {
        var cData: CarouselData = { ...carousel };
        cData = setValueToInterfaceProperty(cData, name, value);
        setCarousel({ ...cData });
    }


    return (
        <AuthLayout>
            <Navigation title={"輪詢圖" + title + "任務"}>
                {alertMsg.show && <AlertFrame
                    strongContent={alertMsg.msg}
                    alertType={alertMsg.type ?? "error"}
                    isOpen={alertMsg.show}
                    setClose={setAlertClose}
                    autoHide={4000} />}
                <Grid container direction="column" justifyContent="center" alignItems="flex-start">
                    <Grid container direction="row" justifyContent="flex-start" alignItems="center" marginBottom={2}>
                        <Grid item xs={1} md={1}>
                        </Grid>
                        <Grid item xs={3} md={3}>
                            <Typography variant="h5">{title}輪詢圖任務</Typography>
                        </Grid>
                    </Grid>
                    <Grid container direction="row" justifyContent="flex-start" alignItems="center" marginBottom={2}>
                        <Grid item xs={2} md={2}>
                            <Typography align="right">名稱：</Typography>
                        </Grid>
                        <Grid item xs={6} md={6} marginLeft={2}>
                            <TextField fullWidth id="outlined-search" required label="名稱" value={carousel.name}
                                onChange={e => setStructData("name", e.target.value)} />
                        </Grid>
                    </Grid>
                    <Grid container direction="row" justifyContent="flex-start" alignItems="center" marginBottom={2}>
                        <Grid item xs={2} md={2}>
                            <Typography align="right">權重：</Typography>
                        </Grid>
                        <Grid item xs={6} md={6} marginLeft={2}>
                            <TextField fullWidth id="outlined-search" required label="權重" type="number" value={carousel.weight}
                                onChange={e => setStructData("weight", Number(e.target.value))} />
                        </Grid>
                    </Grid>
                    <Grid container direction="row" justifyContent="flex-start" alignItems="center" marginBottom={2}>
                        <Grid item xs={2} md={2}>
                            <Typography align="right">開始時間：</Typography>
                        </Grid>
                        <Grid item xs={9} md={9} marginLeft={2}>
                            <DateTimePicker
                                label="開始時間："
                                value={carousel.startTime}
                                onChange={date => setStructData("startTime", date)}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </Grid>
                    </Grid>
                    <Grid container direction="row" justifyContent="flex-start" alignItems="center" marginBottom={2}>
                        <Grid item xs={2} md={2}>
                            <Typography align="right">結束時間：</Typography>
                        </Grid>
                        <Grid item xs={9} md={9} marginLeft={2}>
                            <DateTimePicker
                                label="結束時間"
                                value={carousel.endTime}
                                onChange={date => setStructData("endTime", date)}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </Grid>
                    </Grid>
                    <Grid container direction="row" justifyContent="flex-start" alignItems="center" >
                        <Grid item xs={2} md={2}>
                            <Typography align="right">狀態：</Typography>
                        </Grid>
                        <Grid item xs={9} md={9} marginLeft={2}>
                            <FormControlLabel label="狀態" control={<Switch defaultChecked={carousel.status}
                                onChange={(e, checked) => setStructData("status", checked)} />} />
                        </Grid>
                    </Grid>
                    <Grid container direction="row" justifyContent="flex-start" alignItems="center" marginBottom={2} marginTop={3}>
                        <Grid item xs={1} md={1}>
                        </Grid>
                        <Grid item xs={3} md={3}>
                            <Typography variant="h5">任務圖片</Typography>
                        </Grid>
                    </Grid>
                </Grid>

                {picture.map((p: Picture, index: number) => {
                    return (
                        <div key={index}>
                            <Pictures id={p.id} index={index} name={p.name} pictureUrl={p.pictureUrl}
                                alt={p.alt} url={p.url} status={p.status} weight={p.weight}
                                height={175} width={300} setAlertMsgData={setAlertMsgData}
                                delPicture={deletePicture}
                                setPictureData={setPictureData}
                            >
                            </Pictures>
                        </div>
                    );
                })
                }
                <Grid container direction="row" justifyContent="flex-start" alignItems="center" marginBottom={2}>
                    <Grid item xs={2} md={2}>
                        <IconButton aria-label="delete" size="large" style={{ float: "right" }} onClick={addPictureStruct}>
                            <Addicon fontSize="inherit" />
                        </IconButton>
                    </Grid>
                    <Grid item xs={6} md={6} marginLeft={2}>
                        <Button style={{ float: "right" }} variant="contained" onClick={sned}>Save</Button>
                    </Grid>
                </Grid>

            </Navigation>
        </AuthLayout >
    )
}