import { useAuthStateContext } from "@context/context";
import { Auth } from "@context/reducer";
import { Add, Delete, Edit } from "@mui/icons-material";
import Search from "@mui/icons-material/Search";
import { Button, FormControlLabel, Grid, Pagination, Switch, TextField, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridSortModel, GridValueFormatterParams } from "@mui/x-data-grid";
import { navigationAllApi, roleAddApi, roleApi, roleByIdApi, roleDeleteApi, roleEditByIdApi } from "@pages/api/backstage/role/roleApi";
import { PageMutlSearchData } from "@pages/api/backstage/utilApi";
import BaseStyle from "@styles/page/backstage/base.module.css";
import { featureRole, setValueToInterfaceProperty } from "@utils/base_fucntion";
import AlertFrame, { AlertMsg, setAlertAutoClose, setAlertData } from "component/backstage/AlertFrame";
import AuthLayout from "component/backstage/AuthLayout";
import DraggableDialog from "component/backstage/Dialogs";
import Navigation from "component/backstage/Navigation";
import RecursiveTreeView, { RenderTree } from "component/backstage/TreeFrame";
import moment from "moment";
import React, { ChangeEvent, useEffect, useState } from "react";

interface RoleList {
    id: number,
    name: string,
    key: string,
    weight: number,
    status: boolean,
    remark: string,
    createTime: Date,
    updateTime: Date,
    createUser: string,
    updateUser: string,
}

interface RoleData {
    id: number,
    name: string,
    key: string,
    weight: number,
    status: boolean,
    remark: string,
    select: string[],
}

interface RoleSearch {
    name?: string,
    key?: string,
}

interface DialogOption {
    title?: string,
    className?: string,
    data?: RoleData,
}

export default function Role() {
    let title = "角色介面";

    const { state, dispatch } = useAuthStateContext();
    const auth: Auth = state;
    const [pAdd, setPAdd] = useState<boolean>(false);
    const [pEdit, setPEdit] = useState<boolean>(false);
    const [pDelete, setPDelete] = useState<boolean>(false);
    const [roleList, setRoleList] = useState<RoleList[]>([]);
    const [menuAllList, setMenuAllList] = useState<RenderTree>({ id: 0, name: "全選" });
    const [checkboxItem, setCheckboxItem] = useState<string>("");
    const [dialogOption, setDialogOption] = useState<DialogOption>({});
    const [sendCount, setSendCount] = useState<number>(0);
    const [roleSearch, setRoleSearch] = useState<RoleSearch>();
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
        getRoleList();
        getNavigationAllList();
        let fetchData = async () => {
            setPAdd(await featureRole(auth, "/backstage/role/create"));
            setPEdit(await featureRole(auth, "/backstage/role/edit"));
            setPDelete(await featureRole(auth, "/backstage/role/delete"));
        };
        fetchData();
    }, [pageMutlSearchData.page, sendCount])

    //取表單資料 by 參數
    const getRoleList = () => {
        roleApi(pageMutlSearchData, auth)?.then((resp: any) => {
            setRoleList(resp.data.roleList ?? []);
            setPageMutlSearchData(resp.data.pageData);
        }).catch(error => {
            var alertData = setAlertData(alertMsg, error.response?.data?.msg ?? "資料讀取錯誤", true, "error");
            setAlertMsg(alertData);
        });
    }

    //取菜單權限tree
    const getNavigationAllList = () => {
        navigationAllApi(auth)?.then((resp: any) => {
            setMenuAllList({ id: 0, name: "全選", child: resp.data.menu });
            // console.log(menuAllList);
        }).catch(error => {
            var alertData = setAlertData(alertMsg, error.response?.data?.msg ?? "菜單權限讀取錯誤", true, "error");
            setAlertMsg(alertData);
        });
    }


    //設定搜尋參數 to object
    const setSearchData = (searchName: any, value: string) => {
        let search: RoleSearch;
        if (roleSearch == undefined) {
            search = {};
        } else {
            search = { ...roleSearch };
        }
        // search[searchName]=value;
        search = setValueToInterfaceProperty(search, searchName, value);
        setRoleSearch(search);
    }

    //頁碼刷新
    const pageHandle = (event: ChangeEvent<unknown>, page: number) => {
        let pageData = { ...pageMutlSearchData };
        pageData.page = page;
        setPageMutlSearchData(pageData);
    }

    //刪除功能
    const deleteItemHandle = () => {
        roleDeleteApi(checkboxItem, auth)?.then((resp: any) => {
            var alertData = setAlertData(alertMsg, "id:"+checkboxItem + " 刪除成功", true, "success");
            setAlertMsg(alertData);
            sendHandle();
        }).catch(error => {
            var alertData = setAlertData(alertMsg, "id:"+checkboxItem + error.response?.data?.msg ?? "刪除失敗", true, "error");
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
        let searchData = { ...roleSearch };

        if (sortModel != undefined) {
            pageSearchData.sortColumn = (sortModel[0]?.field) ?? ""
            pageSearchData.sort = (sortModel[0]?.sort) ?? ""
        }

        pageSearchData.search = searchData;
        if (page != undefined) {
            pageSearchData.page = page;
        }
        setPageMutlSearchData(pageSearchData);
        let count: number = sendCount;
        setSendCount(++count);
    }

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
        // role_menu tree 存入Dialog
        setDialogTree();

        if (dialogOption?.title == "新增") {
            roleAddApi(dialogOption.data, auth)?.then((resp: any) => {
                var alertData = setAlertData(alertMsg, "新增成功", true, "success");
                setAlertMsg(alertData);
                sendHandle();
                handleClose();
            }).catch(error => {
                var alertData = setAlertData(alertMsg, error.response?.data?.msg ??"新增失敗", true, "error");
                setAlertMsg(alertData);
            });

        } else {
            roleEditByIdApi(dialogOption.data, auth)?.then((resp: any) => {
                var alertData = setAlertData(alertMsg, "id:"+dialogOption.data?.id + ", 修改成功", true, "success");
                setAlertMsg(alertData);
                sendHandle();
                handleClose();
            }).catch(error => {
                var alertData = setAlertData(alertMsg, "id:"+dialogOption.data?.id +","+ error.response?.data?.msg ?? " 修改失敗", true, "error");
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
        setSelected([]);
        setDialogOption(dialogOptionData)
    }

    const emptyInitial = () => {
        var data: RoleData = {
            id: 0,
            name: "",
            key: "",
            weight: 0,
            status: true,
            remark: "",
            select: [],
        };
        return data;
    }
    //edit
    const editHandle = () => {
        roleByIdApi(checkboxItem, auth)?.then((resp: any) => {
            var dialogOptionData: DialogOption = dialogOption;
            dialogOptionData.title = "修改";
            dialogOptionData.className = BaseStyle.dialogEditTitle;
            dialogOptionData.data = resp.data.roleById;
            setDialogOption(dialogOptionData);
            setSelected(resp.data.roleById.select ?? []);
            handleClickOpen();
        }).catch(error => {
            var alertData = setAlertData(alertMsg, error.response?.data?.msg ?? "抓取資料錯誤", true, "error");
            setAlertMsg(alertData);
        });
    }

    // 樹狀資料關聯
    const [selected, setSelected] = React.useState<string[]>([]);
    const setSelect = (value: string[]) => {
        setSelected(value);
    }

    //設定dialog 資料儲存
    const setDialogData = (name: any, value: any) => {
        let dialogOptionData: DialogOption;
        let diaData: RoleData;
        dialogOptionData = { ...dialogOption };
        if (dialogOptionData.data == undefined) {
            diaData = emptyInitial();
        } else {
            diaData = { ...dialogOptionData.data };
        }
        diaData = setValueToInterfaceProperty(diaData, name, value);
        dialogOptionData.data = diaData;
        setDialogOption(dialogOptionData);
    }

    //設定tree 權限 資料儲存
    const setDialogTree = () => {
        let dialogOptionData = { ...dialogOption };
        if (dialogOptionData.data != undefined) {
            dialogOptionData.data.select = selected;
        }
        setDialogOption(dialogOptionData);
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
            field: 'weight',
            headerName: '排序權重',
            minWidth: 120,
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
        {
            field: 'createTime',
            headerName: '新增時間',
            type: 'dateTime',
            sortable: false,
            minWidth: 200,
            valueFormatter: (params: GridValueFormatterParams) => {
                return moment(params.value?.toString()).format("yyyy-MM-DD HH:mm:ss");
            }
        },
        {
            field: 'updateTime',
            headerName: '更新時間',
            type: 'dateTime',
            sortable: false,
            minWidth: 200,
            valueFormatter: (params: GridValueFormatterParams) => {
                return moment(params.value?.toString()).format("yyyy-MM-DD HH:mm:ss");
            }
        },
        {
            field: 'createUser',
            headerName: '新增by',
            sortable: false,
            minWidth: 200,
        },
        {
            field: 'updateUser',
            headerName: '更新by',
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
                            <TextField id="outlined-search" label="名稱" type="search" value={roleSearch?.name} onChange={e => setSearchData("name", e.target.value)} />
                        </Grid>
                        <Grid item >
                            <TextField id="outlined-search" label="識別碼" type="search" value={roleSearch?.key} onChange={e => setSearchData("key", e.target.value)} />
                        </Grid>
                        <Grid item >
                            <Button variant="contained" color="warning" size="large" style={{ height: '56px' }} endIcon={<Search />} onClick={send}>
                                Search
                            </Button>
                        </Grid>
                    </Grid>
                    <Grid container direction="row" spacing={1} marginBottom={2} justifyContent="flex-start" alignItems="center" >
                        {pAdd &&
                            <Grid item >
                                <Button variant="contained" color="primary" size="medium" style={{ height: '56px' }} endIcon={<Add />} onClick={addHandle}>
                                    Add
                                </Button>
                            </Grid>}
                        {pEdit &&
                            <Grid item >
                                <Button variant="contained" color="success" size="medium" style={{ height: '56px' }} endIcon={<Edit />} onClick={editHandle}
                                    disabled={(checkboxItem.split(",").length != 1 || checkboxItem == "")}>
                                    Edit
                                </Button>
                            </Grid>}
                        {pDelete &&
                            <Grid item >
                                <Button variant="contained" color="error" size="medium" style={{ height: '56px' }} endIcon={<Delete />} onClick={deleteItemHandle}
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
                                            onChange={e => setDialogData("name", e.target.value)} />
                                    </Grid>
                                </Grid>
                                <Grid container direction="row" justifyContent="flex-start" alignItems="center" marginBottom={2}>
                                    <Grid item xs={2} md={2}>
                                        <Typography align="right">識別碼：</Typography>
                                    </Grid>
                                    <Grid item xs={9} md={9} marginLeft={2}>
                                        <TextField fullWidth id="outlined-search" required label="識別碼" value={dialogOption.data?.key}
                                            onChange={e => setDialogData("key", e.target.value)} />
                                    </Grid>
                                </Grid>
                                <Grid container direction="row" justifyContent="flex-start" alignItems="center" marginBottom={2}>
                                    <Grid item xs={2} md={2}>
                                        <Typography align="right">權重：</Typography>
                                    </Grid>
                                    <Grid item xs={9} md={9} marginLeft={2}>
                                        <TextField fullWidth id="outlined-search" required label="權重" type="number" value={dialogOption.data?.weight}
                                            onChange={e => setDialogData("weight", Number(e.target.value))} />
                                    </Grid>
                                </Grid>
                                <Grid container direction="row" justifyContent="flex-start" alignItems="center" marginBottom={2}>
                                    <Grid item xs={2} md={2}>
                                        <Typography align="right">備註：</Typography>
                                    </Grid>
                                    <Grid item xs={9} md={9} marginLeft={2}>
                                        <TextField fullWidth id="outlined-multiline-static" label="備註" multiline rows={4} value={dialogOption.data?.remark}
                                            onChange={e => setDialogData("remark", e.target.value)} />
                                    </Grid>
                                </Grid>

                                <Grid container direction="row" justifyContent="flex-start" alignItems="center" >
                                    <Grid item xs={2} md={2}>
                                        <Typography align="right">狀態：</Typography>
                                    </Grid>
                                    <Grid item xs={9} md={9} marginLeft={2}>
                                        <FormControlLabel label="狀態" control={<Switch defaultChecked={dialogOption.data?.status}
                                            onChange={(e, checked) => setDialogData("status", checked)} />} />
                                    </Grid>
                                </Grid>
                                <Grid container direction="row" justifyContent="flex-start" alignItems="center" >
                                    <Grid item xs={2} md={2}>
                                        <Typography align="right">權限圖：</Typography>
                                    </Grid>
                                    <Grid item xs={9} md={9} marginLeft={2}>
                                        {RecursiveTreeView(menuAllList, selected, setSelect)}

                                    </Grid>
                                </Grid>
                            </Grid>

                        </DraggableDialog>
                    </Grid>
                    <Grid container item direction="row" xs={10} >
                        <DataGrid
                            sx={{ width: '1800px', minHeight: '500px', textAlign: 'center' }}
                            autoHeight
                            rows={roleList}
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

