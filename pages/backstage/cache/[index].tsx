import { useAuthStateContext } from "@context/context";
import { Auth } from "@context/reducer";
import { Delete, Refresh } from "@mui/icons-material";
import { Button, FormControl, Grid, InputLabel, Select, TextField } from "@mui/material";
import { cacheAnyDeleteApi, cacheDeleteApi, cacheKeyListApi } from "@pages/api/backstage/cache/cacheApi";
import { featureRole } from "@utils/base_fucntion";
import AlertFrame, { AlertMsg, setAlertAutoClose, setAlertData } from "component/backstage/AlertFrame";
import AuthLayout from "component/backstage/AuthLayout";
import Navigation from "component/backstage/Navigation";
import React, { useEffect, useState } from "react";

interface MenuViewList {
    id: number,
    name: string,
    key: string,
    url: string,
    feature: string,
    parent: string,
    weight: number,
    status: boolean,
    remark: string,
}

interface MenuParentList {
    id: number,
    name: string,
}

interface MenuSearch {
    name?: string,
    key?: string,
    url?: string,
    feature?: string,
    parent?: string,
}

interface DialogOption {
    title?: string,
    className?: string,
    data?: MenuViewList,
}

export default function Menu() {
    let title = "cache介面";

    const { state, dispatch } = useAuthStateContext();
    const auth: Auth = state;
    const [pDelete, setPDelete] = useState<boolean>(false);
    const [pAnyDelete, setPAnyDelete] = useState<boolean>(false);
    const [deleteKey, setDeleteKey] = useState<string>("");
    const [deleteKeyArr, setDeleteKeyArr] = useState<string[]>([]);
    const [cacheKeyList, setCacheKeyList] = useState<string[]>();
    const [sendCount, setSendCount] = useState<number>(0);
    const [alertMsg, setAlertMsg] = useState<AlertMsg>({ msg: "", show: false });


    //alert 關閉通知
    const setAlertClose = () => {
        let alertData = setAlertAutoClose(alertMsg);
        setAlertMsg(alertData);
    }

    //取資料
    useEffect(() => {
        getCacheKeyList();
        let fetchData = async () => {
            setPDelete(await featureRole(auth, "cache:delete"));
            setPAnyDelete(await featureRole(auth, "cache:delete:any"));
        };
        fetchData();
    }, [sendCount])

    const getCacheKeyList = () => {
        cacheKeyListApi(null, auth)?.then((resp: any) => {
            setCacheKeyList(resp.data.cacheName ?? []);
        }).catch(error => {
            var alertData = setAlertData(alertMsg, error.response?.data?.msg ?? "資料讀取錯誤", true, "error");
            setAlertMsg(alertData);
        });
    };

    const optionMapValue: string[] = ["carousel", "category", "production", "productionBank"];

    const deleteHandle = (key: string) => {
        cacheDeleteApi(key, auth)?.then((resp: any) => {
            var alertData = setAlertData(alertMsg, "cache key:" + key + "刪除成功", true, "success");
            setAlertMsg(alertData);
            setSendCount(sendCount + 1)
        }).catch(error => {
            var alertData = setAlertData(alertMsg, "cache key:" + key + "刪除失敗", true, "error");
            setAlertMsg(alertData);
        });
    };

    const deleteAnyHandleStr = (key: string) => {
        cacheAnyDeleteApi(key, auth)?.then((resp: any) => {
            var alertData = setAlertData(alertMsg, "cache key:" + key + "刪除成功", true, "success");
            setAlertMsg(alertData);
            setSendCount(sendCount + 1)
        }).catch(error => {
            var alertData = setAlertData(alertMsg, "cache key:" + key + "刪除失敗", true, "error");
            setAlertMsg(alertData);
        });
    }

    const deleteAnyHandle = () => {
        let key = deleteKey;
        deleteAnyHandleStr(key);
    };

    const deleteMultipleHandle = () => {
        deleteKeyArr.map((key: string) => {
            deleteAnyHandleStr(key);
        });

    };

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const { options } = event.target;
        const value: string[] = [];
        for (let i = 0, l = options.length; i < l; i += 1) {
            if (options[i].selected) {
                value.push(options[i].value);
            }
        }
        setDeleteKeyArr(value);
    };

    return (
        <AuthLayout>
            <Navigation title={title}>
                {alertMsg.show && <AlertFrame
                    strongContent={alertMsg.msg}
                    alertType={alertMsg.type ?? "error"}
                    isOpen={alertMsg.show}
                    setClose={setAlertClose}
                    autoHide={4000} />}
                <Grid container direction="column" justifyContent="center" alignItems="center">
                    <Grid container direction="row" spacing={2} marginBottom={2} justifyContent="center" alignItems="center" >
                        {pAnyDelete &&
                            <>
                                < Grid item >
                                    <TextField id="outlined-search" label="cacheKey" type="search" onChange={e => setDeleteKey(e.target.value)} />
                                </Grid>
                                < Grid item >
                                    <Button variant="contained" color="error" size="medium" style={{ height: '56px' }} endIcon={<Delete />}
                                        onClick={(event) => { deleteAnyHandle() }}>
                                        {"cache * 刪除"}
                                    </Button>
                                </Grid>
                            </>
                        }
                        {pDelete &&
                            optionMapValue.map((opt: string) => {
                                return (
                                    < Grid item >
                                        <Button variant="contained" color="error" size="medium" style={{ height: '56px' }} endIcon={<Delete />}
                                            onClick={(event) => { deleteHandle(opt) }}>
                                            {opt + "刪除"}
                                        </Button>
                                    </Grid>
                                );
                            })
                        }
                    </Grid>

                    <Grid container item direction="row" justifyContent="center" alignItems="flex-start" marginTop={2} xs={10} >
                        < Grid item >
                            <FormControl sx={{ m: 1, minWidth: 120, maxWidth: 300, minHeight: 300, maxHeight: 500 }}>
                                <InputLabel shrink htmlFor="select-multiple-native">
                                    CacheKey
                                </InputLabel>
                                <Select
                                    sx={{ height: '100%' }}
                                    native
                                    multiple
                                    // @ts-ignore Typings are not considering `native`
                                    onChange={handleChange}
                                    label="CacheKey"
                                    inputProps={{
                                        id: 'select-multiple-native',
                                    }}
                                >
                                    {cacheKeyList?.map((ck) => (
                                        <option key={ck} value={ck}>
                                            {ck}
                                        </option>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        < Grid item >
                            <Grid container item direction="column" justifyContent="center" alignItems="flex-start" marginTop={2} xs={10} >
                                < Grid item >
                                    <Button variant="contained" color="info" size="medium" style={{ height: '60px', minWidth: '120px' }} endIcon={<Refresh />}
                                        onClick={(event) => { setSendCount(sendCount + 1) }}>
                                        {"重新整理"}
                                    </Button>
                                </Grid>
                                < Grid item >
                                    <Button variant="contained" color="error" size="medium" style={{ height: '60px', minWidth: '120px' }} endIcon={<Delete />}
                                        onClick={(event) => { deleteMultipleHandle() }}>
                                        {"刪除選取"}
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>

                </Grid>
            </Navigation >
        </AuthLayout >
    )
}

