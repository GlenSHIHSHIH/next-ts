import { useAuthStateContext } from "@context/context";
import { Auth } from "@context/reducer";
import { Add, Delete, Edit } from "@mui/icons-material";
import Search from "@mui/icons-material/Search";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, FormControlLabel, Grid, Pagination, Switch, TextField, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridSortModel } from "@mui/x-data-grid";
import { deleteMenuApi, menuApi, menuParentListApi } from "@pages/api/backstage/menu/menuApi";
import { PageMutlSearchData } from "@pages/api/backstage/utilApi";
import MenuStyle from "@styles/page/backstage/Menu.module.css";
import { objArrtoMap, setValueToInterfaceProperty } from "@utils/base_fucntion";
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
    menu?: MenuViewList,
}

export default function Menu() {
    let title = "Menu";

    const { state, dispatch } = useAuthStateContext();
    const [menuViewList, setMenuViewList] = useState<MenuViewList[]>([]);
    const [menuParentList, setMenuParentList] = useState<MenuParentList[]>([]);
    const [selectFeature, setSelectFeature] = useState<string>("");
    const [selectParent, setSelectParent] = useState<string>("");
    const [deleteItem, setDeleteItem] = useState<string>("");
    const [dialogOption, setDialogOption] = useState<DialogOption>({});
    const [sendCount, setSendCount] = useState<number>(0);
    const [menuSearch, setMenuSearch] = useState<MenuSearch>();
    const [pageMutlSearchData, setPageMutlSearchData] = useState<PageMutlSearchData>
        ({
            count: 0,
            page: 1,
            // pageLimit: Number(process.env.BACKSTAGE_PAGE_SIZE_DEFAULT ?? 30),
            pageLimit: 5,
            sort: "",
            sortColumn: "",
        });

    useEffect(() => {
        getMenuList();
        getMenuParentList();
    }, [pageMutlSearchData.page, sendCount])

    const getMenuList = () => {
        let auth: Auth = state;
        menuApi(pageMutlSearchData, auth)?.then((resp: any) => {
            // console.log("resp");
            // console.log(resp);
            setMenuViewList(resp.data.menuViewList);
            setPageMutlSearchData(resp.data.pageData);
        }).catch(error => {
            // console.log("error:");
            // console.log(error);
            // setErrMsg(error.response?.data?.msg);
        });
    }

    const getMenuParentList = () => {
        let auth: Auth = state;
        menuParentListApi(null, auth)?.then((resp: any) => {
            // console.log("resp");
            // console.log(resp);
            setMenuParentList(resp.data.menuParentList);
        }).catch(error => {
            // console.log("error:");
            // console.log(error);
            // setErrMsg(error.response?.data?.msg);
        });
    }

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

    const pageHandle = (event: ChangeEvent<unknown>, page: number) => {
        console.log(page);
        let pageData = { ...pageMutlSearchData };
        pageData.page = page;
        setPageMutlSearchData(pageData);
    }


    const deleteItemHandle = () => {

        if (deleteItem == "") {
            return;
        }

        let auth: Auth = state;
        deleteMenuApi(deleteItem, auth)?.then((resp: any) => {
            // console.log("resp");
            // console.log(resp);
            sendHandle();
        }).catch(error => {
            console.log("error:");
            console.log(error);
            // setErrMsg(error.response?.data?.msg);
        });

    }

    function send() {
        sendHandle();
    }

    function sendHandle(sortModel?: GridSortModel) {
        let pageSearchData = { ...pageMutlSearchData };
        let menuSearchData = { ...menuSearch };
        menuSearchData["feature"] = selectFeature;
        menuSearchData["parent"] = selectParent;
        pageSearchData.sortColumn = (sortModel && sortModel[0].field) ?? ""
        pageSearchData.sort = (sortModel && sortModel[0].sort) ?? ""
        pageSearchData.search = menuSearchData;
        pageSearchData.page = 1;
        setPageMutlSearchData(pageSearchData);
        let count: number = sendCount;
        setSendCount(++count);
    }

    const optionMapValue: Map<string, string> = new Map([["標題", "T"], ["頁面", "P"], ["按鍵功能", "F"]]);

    // dialog
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const saveHandle = () => {
        if (dialogOption?.title == "新增") {

        } else {

        }
    };


    //add
    const addHandle = () => {
        handleClickOpen();
        var dialogOptionData: DialogOption = dialogOption;
        dialogOptionData.title = "新增";
        dialogOptionData.className = MenuStyle.dialogAddTitle;
        dialogOptionData.menu = emptyInitial();
        setDialogOption(dialogOptionData)
    }

    const emptyInitial = () => {
        var menu: MenuViewList = {
            id: 0,
            name: "",
            key: "",
            url: "",
            feature: "",
            parent: "",
            weight: 0,
            status: true,
        };
        return menu;
    }
    //edit
    const editHandle = () => {
        handleClickOpen();
        var dialogOptionData: DialogOption = dialogOption;
        dialogOptionData.title = "修改";
        dialogOptionData.className = MenuStyle.dialogEditTitle;
        // dialogOptionData.menu = null;
        setDialogOption(dialogOptionData)
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
                <Grid container direction="column" justifyContent="flex-start" alignItems="center">
                    <Grid container direction="row" spacing={2} marginBottom={2} justifyContent="flex-start" alignItems="center" >
                        <Grid item >
                            <TextField id="outlined-search" label="名稱" type="search" onChange={e => setSearchData("name", e.target.value)} />
                        </Grid>
                        <Grid item >
                            <TextField id="outlined-search" label="網址" type="search" onChange={e => setSearchData("url", e.target.value)} />
                        </Grid>
                        <Grid item >
                            <TextField id="outlined-search" label="識別碼" type="search" onChange={e => setSearchData("key", e.target.value)} />
                        </Grid>
                        <Grid item >
                            <SelectBox
                                className={MenuStyle.dropDownList}
                                selectName={'功能'}
                                optionMapValue={optionMapValue}
                                defaultValue={selectFeature}
                                selectSet={(selectValue: string) => { setSelectFeature(selectValue) }}
                                optionAll={true}
                            />
                        </Grid>
                        <Grid item >
                            <SelectBox
                                className={MenuStyle.dropDownList}
                                selectName={'父類別'}
                                optionMapValue={new Map([...(objArrtoMap(menuParentList))])}
                                defaultValue={selectParent}
                                selectSet={(selectValue: string) => { setSelectParent(selectValue) }}
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
                        <Grid item >
                            <Button variant="contained" color="primary" size="medium" style={{ height: '56px' }} endIcon={<Add />} onClick={addHandle}>
                                Add
                            </Button>
                        </Grid>
                        <Grid item >
                            <Button variant="contained" color="success" size="medium" style={{ height: '56px' }} endIcon={<Edit />} onClick={editHandle}>
                                Edit
                            </Button>
                        </Grid>
                        <Grid item >
                            <Button variant="contained" color="error" size="medium" style={{ height: '56px' }} endIcon={<Delete />} onClick={deleteItemHandle}>
                                Delete
                            </Button>
                        </Grid>
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
                                        <TextField fullWidth id="outlined-search" required label="名稱" type="search" onChange={e => setSearchData("name", e.target.value)} />
                                    </Grid>
                                </Grid>
                                <Grid container direction="row" justifyContent="flex-start" alignItems="center" marginBottom={2}>
                                    <Grid item xs={2} md={2}>
                                        <Typography align="right">識別碼：</Typography>
                                    </Grid>
                                    <Grid item xs={9} md={9} marginLeft={2}>
                                        <TextField fullWidth id="outlined-search" required label="識別碼" type="search" onChange={e => setSearchData("name", e.target.value)} />
                                    </Grid>
                                </Grid>
                                <Grid container direction="row" justifyContent="flex-start" alignItems="center" marginBottom={2}>
                                    <Grid item xs={2} md={2}>
                                        <Typography align="right">網址：</Typography>
                                    </Grid>
                                    <Grid item xs={9} md={9} marginLeft={2}>
                                        <TextField fullWidth id="outlined-search" required label="網址" type="search" onChange={e => setSearchData("name", e.target.value)} />
                                    </Grid>
                                </Grid>
                                <Grid container direction="row" justifyContent="flex-start" alignItems="center" marginBottom={2}>
                                    <Grid item xs={2} md={2}>
                                        <Typography align="right">權重：</Typography>
                                    </Grid>
                                    <Grid item xs={9} md={9} marginLeft={2}>
                                        <TextField fullWidth id="outlined-search" required label="權重" type="search" onChange={e => setSearchData("name", e.target.value)} />
                                    </Grid>
                                </Grid>
                                <Grid container direction="row" justifyContent="flex-start" alignItems="center" marginBottom={2}>
                                    <Grid item xs={2} md={2}>
                                        <Typography align="right">備註：</Typography>
                                    </Grid>
                                    <Grid item xs={9} md={9} marginLeft={2}>
                                        <TextField fullWidth id="outlined-multiline-static" label="備註" multiline rows={4} />
                                    </Grid>
                                </Grid>

                                <Grid container direction="row" justifyContent="flex-start" alignItems="center" marginBottom={2}>
                                    <Grid item xs={2} md={2}>
                                        <Typography align="right">父類別：</Typography>
                                    </Grid>
                                    <Grid item xs={9} md={9} marginLeft={2}>
                                        <SelectBox
                                            className={MenuStyle.dropDownList}
                                            selectName={'父類別'}
                                            optionMapValue={new Map([...(objArrtoMap(menuParentList))])}
                                            defaultValue={selectParent}
                                            selectSet={(selectValue: string) => { setSelectParent(selectValue) }}
                                            optionAll={true}
                                            required={true}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container direction="row" justifyContent="flex-start" alignItems="center" marginBottom={2}>
                                    <Grid item xs={2} md={2}>
                                        <Typography align="right">功能：</Typography>
                                    </Grid>
                                    <Grid item xs={9} md={9} marginLeft={2}>
                                        <SelectBox
                                            className={MenuStyle.dropDownList}
                                            selectName={'功能'}
                                            optionMapValue={optionMapValue}
                                            defaultValue={selectFeature}
                                            selectSet={(selectValue: string) => { setSelectFeature(selectValue) }}
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
                                        <FormControlLabel label="狀態" control={<Switch defaultChecked />} />
                                    </Grid>
                                </Grid>
                            </Grid>

                        </DraggableDialog>
                    </Grid>
                    <Grid container item direction="row" xs={10} >
                        <div style={{ width: '1600px' }}>
                            <DataGrid
                                autoHeight
                                rows={menuViewList}
                                columns={columns}
                                checkboxSelection
                                onSelectionModelChange={(selectionModel) => setDeleteItem(selectionModel.join(','))}
                                disableSelectionOnClick
                                disableColumnMenu
                                pageSize={pageMutlSearchData.pageLimit}
                                // onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                                // rowsPerPageOptions={process.env.PAGE_SIZE?.split(',') as unknown as number[]}
                                // sortModel={sortModel}
                                sortingMode="server"
                                onSortModelChange={(model) => sendHandle(model)}
                                components={{
                                    Pagination: Pagination,
                                }}
                                componentsProps={{
                                    pagination: { count: Math.ceil(pageMutlSearchData.count / pageMutlSearchData.pageLimit), page: pageMutlSearchData.page, onChange: pageHandle, showFirstButton: true, showLastButton: true },
                                }}
                            />
                        </div>
                    </Grid>
                </Grid>
            </Navigation >
        </AuthLayout >
    )
}

