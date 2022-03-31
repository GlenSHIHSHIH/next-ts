import { useAuthStateContext } from "@context/context";
import { Auth } from "@context/reducer";
import { Add, Delete, Edit } from "@mui/icons-material";
import Search from "@mui/icons-material/Search";
import { Button, FormControlLabel, Grid, Pagination, Switch, TextField, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridSortModel } from "@mui/x-data-grid";
import { menuAddApi, menuApi, menuByIdApi, menuDeleteApi, menuEditByIdApi, menuParentListApi } from "@pages/api/backstage/menu/menuApi";
import { PageMutlSearchData } from "@pages/api/backstage/utilApi";
import BaseStyle from "@styles/page/backstage/Base.module.css";
import { featureRole, objArrtoMap, setValueToInterfaceProperty } from "@utils/base_fucntion";
import AlertFrame, { AlertMsg, setAlertAutoClose, setAlertData } from "component/backstage/AlertFrame";
import AuthLayout from "component/backstage/AuthLayout";
import DraggableDialog from "component/backstage/Dialogs";
import Navigation from "component/backstage/Navigation";
import SelectBox from "component/SelectBox";
import React, { ChangeEvent, useEffect, useState } from "react";

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
    let title = "菜單介面";

    const { state, dispatch } = useAuthStateContext();
    const auth: Auth = state;
    const [pAdd, setPAdd] = useState<boolean>(false);
    const [pEdit, setPEdit] = useState<boolean>(false);
    const [pDelete, setPDelete] = useState<boolean>(false);
    const [menuViewList, setMenuViewList] = useState<MenuViewList[]>([]);
    const [menuParentList, setMenuParentList] = useState<MenuParentList[]>([]);
    const [checkboxItem, setCheckboxItem] = useState<string>("");
    const [dialogOption, setDialogOption] = useState<DialogOption>({});
    const [sendCount, setSendCount] = useState<number>(0);
    const [menuSearch, setMenuSearch] = useState<MenuSearch>();
    const [alertMsg, setAlertMsg] = useState<AlertMsg>({ msg: "", show: false });
    const [pageMutlSearchData, setPageMutlSearchData] = useState<PageMutlSearchData>
        ({
            count: 0,
            page: 1,
            pageLimit: Number(process.env.BACKSTAGE_PAGE_SIZE_DEFAULT ?? 30),
            sort: "asc",
            sortColumn: "id",
        });

    //alert 關閉通知
    const setAlertClose = () => {
        let alertData = setAlertAutoClose(alertMsg);
        setAlertMsg(alertData);
    }

    //取資料
    useEffect(() => {
        getMenuList();
        getMenuParentList();
        let fetchData = async () => {
            setPAdd(await featureRole(auth, "menu:create"));
            setPEdit(await featureRole(auth, "menu:edit"));
            setPDelete(await featureRole(auth, "menu:delete"));
        };
        fetchData();
    }, [pageMutlSearchData.page, sendCount])

    //取表單資料 by 參數
    const getMenuList = () => {
        menuApi(pageMutlSearchData, auth)?.then((resp: any) => {
            setMenuViewList(resp.data.menuViewList ?? []);
            setPageMutlSearchData(resp.data.pageData);
        }).catch(error => {
            var alertData = setAlertData(alertMsg, error.response?.data?.msg ?? "資料讀取錯誤", true, "error");
            setAlertMsg(alertData);
        });
    }

    //取表單父類別資料
    const getMenuParentList = () => {
        menuParentListApi(null, auth)?.then((resp: any) => {
            setMenuParentList(resp.data.menuParentList);
        }).catch(error => {
            var alertData = setAlertData(alertMsg, error.response?.data?.msg ?? "父類別選項資料錯誤", true, "error");
            setAlertMsg(alertData);
        });
    }

    //設定搜尋參數 to object
    const setSearchData = (searchName: any, value: string) => {
        let search: MenuSearch;
        if (menuSearch == undefined) {
            search = {};
        } else {
            search = { ...menuSearch };
        }
        // search[searchName]=value;
        search = setValueToInterfaceProperty(search, searchName, value);
        setMenuSearch(search);
    }

    //頁碼刷新
    const pageHandle = (event: ChangeEvent<unknown>, page: number) => {
        console.log(page);
        let pageData = { ...pageMutlSearchData };
        pageData.page = page;
        setPageMutlSearchData(pageData);
    }


    //刪除功能
    const deleteItemHandle = (id: string) => {
        let ids = checkboxItem;
        if (id != "") {
            ids = id;
        }
        menuDeleteApi(ids, auth)?.then((resp: any) => {
            var alertData = setAlertData(alertMsg, "id:" + checkboxItem + " ,刪除成功", true, "success");
            setAlertMsg(alertData);
            sendHandle();
        }).catch(error => {
            var alertData = setAlertData(alertMsg, "id:" + checkboxItem + "," + error.response?.data?.msg ?? " 刪除失敗", true, "error");
            setAlertMsg(alertData);
        });

    }

    //送出相關搜尋參數，重整頁碼回第一頁
    function send() {
        //搜尋頁數
        sendHandle(1);
    }

    //送出搜尋資料參數
    function sendHandle(page?: number, sortModel?: GridSortModel) {
        let pageSearchData = { ...pageMutlSearchData };
        let menuSearchData = { ...menuSearch };

        if (sortModel != undefined) {
            pageSearchData.sortColumn = (sortModel[0]?.field) ?? ""
            pageSearchData.sort = (sortModel[0]?.sort) ?? ""
        }

        pageSearchData.search = menuSearchData;
        if (page != undefined) {
            pageSearchData.page = page;
        }
        setPageMutlSearchData(pageSearchData);
        let count: number = sendCount;
        setSendCount(++count);
    }

    const optionMapValue: Map<string, string> = new Map([["標題", "T"], ["頁面", "P"], ["按鍵功能", "F"]]);

    // 新增與修改彈跳視窗 dialog
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const saveHandle = (e: any) => {
        e.preventDefault();
        if (dialogOption?.title == "新增") {
            menuAddApi(dialogOption.data, auth)?.then((resp: any) => {
                var alertData = setAlertData(alertMsg, "新增成功", true, "success");
                setAlertMsg(alertData);
                sendHandle();
                handleClose();
            }).catch(error => {
                var alertData = setAlertData(alertMsg, error.response?.data?.msg ?? "新增失敗", true, "error");
                setAlertMsg(alertData);
            });

        } else {
            menuEditByIdApi(dialogOption.data, auth)?.then((resp: any) => {
                var alertData = setAlertData(alertMsg, "id" + dialogOption.data?.id + " 修改成功", true, "success");
                setAlertMsg(alertData);
                sendHandle();
                handleClose();
            }).catch(error => {
                var alertData = setAlertData(alertMsg, "id" + dialogOption.data?.id + "," + error.response?.data?.msg ?? "修改失敗", true, "error");
                setAlertMsg(alertData);
            });
        }

    };


    //add
    const addHandle = () => {
        handleClickOpen();
        var dialogOptionData: DialogOption = dialogOption;
        dialogOptionData.title = "新增";
        dialogOptionData.className = BaseStyle.dialogAddTitle;
        dialogOptionData.data = emptyInitial();
        setDialogOption(dialogOptionData)
    }

    const emptyInitial = () => {
        var data: MenuViewList = {
            id: 0,
            name: "",
            key: "",
            url: "",
            feature: "",
            parent: "",
            weight: 0,
            status: true,
            remark: "",
        };
        return data;
    }
    //edit
    const editHandle = (id: string) => {
        let ids = checkboxItem;
        if (id != "") {
            ids = id;
        }
        menuByIdApi(ids, auth)?.then((resp: any) => {
            // console.log("resp");
            // console.log(resp);
            var dialogOptionData: DialogOption = dialogOption;
            dialogOptionData.title = "修改";
            dialogOptionData.className = BaseStyle.dialogEditTitle;
            dialogOptionData.data = resp.data.menuById;
            setDialogOption(dialogOptionData);
            handleClickOpen();
        }).catch(error => {
            var alertData = setAlertData(alertMsg, error.response?.data?.msg ?? " 抓取資料錯誤", true, "error");
            setAlertMsg(alertData);
        });
    }

    //設定dialog 資料儲存
    const setdialogData = (name: any, value: any) => {
        let dialogOptionData: DialogOption;
        let diaData: MenuViewList;
        dialogOptionData = { ...dialogOption };
        if (dialogOptionData.data == undefined) {
            diaData = emptyInitial();
        } else {
            diaData = { ...dialogOptionData.data };
        }
        diaData = setValueToInterfaceProperty(diaData, name, value);
        dialogOptionData.data = diaData;
        setDialogOption(dialogOptionData);
        // console.log(dialogOptionData);
    }

    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: 'id',
            minWidth: 100
        },
        {
            field: 'name',
            headerName: '名稱',
            minWidth: 150,
        },
        {
            field: 'key',
            headerName: '識別碼',
            sortable: false,
            minWidth: 150,
        },
        {
            field: 'url',
            headerName: '網址',
            minWidth: 200,
        },
        {
            field: 'parent',
            headerName: '父類別',
            sortable: false,
            minWidth: 200,
        },
        {
            field: 'feature',
            headerName: '功能',
            sortable: false,
            minWidth: 160,
        },
        {
            field: 'weight',
            headerName: '排序權重',
            minWidth: 120,
        },
        {
            field: '',
            headerName: '功能',
            sortable: false,
            minWidth: 200,
            renderCell: (cellValues) => {
                return (
                    <div>
                        {pEdit &&
                            <Button variant="contained" color="success"
                                onClick={(event) => { editHandle(cellValues.id.toString()) }}
                            >
                                Edit
                            </Button>
                        }
                        {pDelete &&
                            <Button variant="contained" color="error"
                                onClick={(event) => { deleteItemHandle(cellValues.id.toString()) }}
                            >
                                Delete
                            </Button>
                        }
                    </div >
                );
            }
        },
        {
            field: 'status',
            headerName: '狀態',
            minWidth: 120,
            type: 'boolean',
        },
        {
            field: 'remark',
            headerName: '備註',
            sortable: false,
            minWidth: 200,
        },
    ];

    return (
        <AuthLayout>
            <Navigation title={title}>
                {alertMsg.show && <AlertFrame
                    strongContent={alertMsg.msg}
                    alertType={alertMsg.type ?? "error"}
                    isOpen={alertMsg.show}
                    setClose={setAlertClose}
                    autoHide={4000} />}
                <Grid container direction="column" justifyContent="flex-start" alignItems="center">
                    <Grid container direction="row" spacing={2} marginBottom={2} justifyContent="flex-start" alignItems="center" >
                        <Grid item >
                            <TextField id="outlined-search" label="名稱" type="search" value={menuSearch?.name} onChange={e => setSearchData("name", e.target.value)} />
                        </Grid>
                        <Grid item >
                            <TextField id="outlined-search" label="網址" type="search" value={menuSearch?.url} onChange={e => setSearchData("url", e.target.value)} />
                        </Grid>
                        <Grid item >
                            <TextField id="outlined-search" label="識別碼" type="search" value={menuSearch?.key} onChange={e => setSearchData("key", e.target.value)} />
                        </Grid>
                        <Grid item >
                            <SelectBox
                                className={BaseStyle.dropDownList}
                                selectName={'功能'}
                                optionMapValue={optionMapValue}
                                defaultValue={menuSearch?.feature}
                                selectSet={(selectValue: string) => { setSearchData("feature", selectValue) }}
                                optionAll={true}
                            />
                        </Grid>
                        <Grid item >
                            <SelectBox
                                className={BaseStyle.dropDownList}
                                selectName={'父類別'}
                                optionMapValue={new Map([...(objArrtoMap(menuParentList))])}
                                defaultValue={menuSearch?.parent}
                                selectSet={(selectValue: string) => { setSearchData("parent", selectValue) }}
                                optionAll={true}
                            />
                        </Grid>
                        <Grid item >
                            <Button variant="contained" color="warning" size="large" style={{ height: '56px' }} endIcon={<Search />} onClick={send}>
                                Search
                            </Button>
                        </Grid>
                    </Grid>
                    <Grid container direction="row" spacing={1} marginBottom={2} justifyContent="flex-start" alignItems="center" >
                        {pAdd
                            && <Grid item >
                                <Button variant="contained" color="primary" size="medium" style={{ height: '56px' }} endIcon={<Add />} onClick={addHandle}>
                                    Add
                                </Button>
                            </Grid>}
                        {pEdit
                            && <Grid item >
                                <Button variant="contained" color="success" size="medium" style={{ height: '56px' }} endIcon={<Edit />}
                                    onClick={(event) => { editHandle("") }}
                                    disabled={(checkboxItem.split(",").length != 1 || checkboxItem == "")}>
                                    Edit
                                </Button>
                            </Grid>}
                        {pDelete
                            && <Grid item >
                                <Button variant="contained" color="error" size="medium" style={{ height: '56px' }} endIcon={<Delete />}
                                    onClick={(event) => { deleteItemHandle("") }}
                                    disabled={(checkboxItem.split(",").length < 1 || checkboxItem == "")}>
                                    Delete
                                </Button>
                            </Grid>}
                    </Grid>
                    <Grid container item direction="row" xs={10} >
                        <DraggableDialog
                            title={dialogOption.title ?? ""}
                            open={open}
                            closeHandle={handleClose}
                            saveHandle={saveHandle}
                            className={dialogOption.className ?? ""}
                        >
                            <Grid container direction="column" justifyContent="center" alignItems="flex-start">
                                <Grid container direction="row" justifyContent="flex-start" alignItems="center" marginBottom={2}>
                                    <Grid item xs={2} md={2}>
                                        <Typography align="right">名稱：</Typography>
                                    </Grid>
                                    <Grid item xs={9} md={9} marginLeft={2}>
                                        <TextField fullWidth id="outlined-search" required label="名稱" value={dialogOption.data?.name}
                                            onChange={e => setdialogData("name", e.target.value)} />
                                    </Grid>
                                </Grid>
                                <Grid container direction="row" justifyContent="flex-start" alignItems="center" marginBottom={2}>
                                    <Grid item xs={2} md={2}>
                                        <Typography align="right">識別碼：</Typography>
                                    </Grid>
                                    <Grid item xs={9} md={9} marginLeft={2}>
                                        <TextField fullWidth id="outlined-search" required label="識別碼" value={dialogOption.data?.key}
                                            onChange={e => setdialogData("key", e.target.value)} />
                                    </Grid>
                                </Grid>
                                <Grid container direction="row" justifyContent="flex-start" alignItems="center" marginBottom={2}>
                                    <Grid item xs={2} md={2}>
                                        <Typography align="right">網址：</Typography>
                                    </Grid>
                                    <Grid item xs={9} md={9} marginLeft={2}>
                                        <TextField fullWidth id="outlined-search" label="網址" value={dialogOption.data?.url}
                                            onChange={e => setdialogData("url", e.target.value)} />
                                    </Grid>
                                </Grid>
                                <Grid container direction="row" justifyContent="flex-start" alignItems="center" marginBottom={2}>
                                    <Grid item xs={2} md={2}>
                                        <Typography align="right">權重：</Typography>
                                    </Grid>
                                    <Grid item xs={9} md={9} marginLeft={2}>
                                        <TextField fullWidth id="outlined-search" required label="權重" type="number" value={dialogOption.data?.weight}
                                            onChange={e => setdialogData("weight", Number(e.target.value))} />
                                    </Grid>
                                </Grid>
                                <Grid container direction="row" justifyContent="flex-start" alignItems="center" marginBottom={2}>
                                    <Grid item xs={2} md={2}>
                                        <Typography align="right">備註：</Typography>
                                    </Grid>
                                    <Grid item xs={9} md={9} marginLeft={2}>
                                        <TextField fullWidth id="outlined-multiline-static" label="備註" multiline rows={4} value={dialogOption.data?.remark}
                                            onChange={e => setdialogData("remark", e.target.value)} />
                                    </Grid>
                                </Grid>

                                <Grid container direction="row" justifyContent="flex-start" alignItems="center" marginBottom={2}>
                                    <Grid item xs={2} md={2}>
                                        <Typography align="right">父類別：</Typography>
                                    </Grid>
                                    <Grid item xs={9} md={9} marginLeft={2}>
                                        <SelectBox
                                            className={BaseStyle.dropDownList}
                                            selectName={'父類別'}
                                            optionMapValue={new Map([...(objArrtoMap(menuParentList))])}
                                            defaultValue={dialogOption.data?.parent}
                                            selectSet={(selectValue: string) => { setdialogData("parent", selectValue) }}
                                            optionAll={true}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container direction="row" justifyContent="flex-start" alignItems="center" marginBottom={2}>
                                    <Grid item xs={2} md={2}>
                                        <Typography align="right">功能：</Typography>
                                    </Grid>
                                    <Grid item xs={9} md={9} marginLeft={2}>
                                        <SelectBox
                                            className={BaseStyle.dropDownList}
                                            selectName={'功能'}
                                            optionMapValue={optionMapValue}
                                            defaultValue={dialogOption.data?.feature}
                                            selectSet={(selectValue: string) => { setdialogData("feature", selectValue) }}
                                            optionAll={true}
                                            required={true}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container direction="row" justifyContent="flex-start" alignItems="center" >
                                    <Grid item xs={2} md={2}>
                                        <Typography align="right">狀態：</Typography>
                                    </Grid>
                                    <Grid item xs={9} md={9} marginLeft={2}>
                                        <FormControlLabel label="狀態" control={<Switch defaultChecked={dialogOption.data?.status}
                                            onChange={(e, checked) => setdialogData("status", checked)} />} />
                                    </Grid>
                                </Grid>
                            </Grid>

                        </DraggableDialog>
                    </Grid>
                    <Grid container item direction="row" xs={10} >

                        <DataGrid
                            sx={{ width: '1600px', minHeight: '500px', textAlign: 'center' }}
                            autoHeight
                            rows={menuViewList}
                            columns={columns}
                            checkboxSelection
                            onSelectionModelChange={(selectionModel) => setCheckboxItem(selectionModel.join(','))}
                            disableSelectionOnClick
                            disableColumnMenu
                            pageSize={pageMutlSearchData.pageLimit}
                            // onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                            // rowsPerPageOptions={process.env.PAGE_SIZE?.split(',') as unknown as number[]}
                            // sortModel={sortModel}
                            sortingMode="server"
                            onSortModelChange={(model) => sendHandle(1, model)}
                            components={{
                                Pagination: Pagination,
                            }}
                            componentsProps={{
                                pagination: { count: Math.ceil(pageMutlSearchData.count / pageMutlSearchData.pageLimit), page: pageMutlSearchData.page, onChange: pageHandle, showFirstButton: true, showLastButton: true },
                            }}
                        />

                    </Grid>
                </Grid>
            </Navigation >
        </AuthLayout >
    )
}

