import { useAuthStateContext } from "@context/context";
import { Auth } from "@context/reducer";
import { Add, Delete, Edit } from "@mui/icons-material";
import Search from "@mui/icons-material/Search";
import { Button, Grid, Pagination, TextField } from "@mui/material";
import { DataGrid, GridColDef, GridSortModel, GridValueFormatterParams } from "@mui/x-data-grid";
import { carouselApi, carouselDeleteApi } from "@pages/api/backstage/carousel/carouselApi";
import { PageMutlSearchData } from "@pages/api/backstage/utilApi";
import { featureRole, setValueToInterfaceProperty } from "@utils/base_fucntion";
import AlertFrame, { AlertMsg, setAlertAutoClose, setAlertData } from "component/backstage/AlertFrame";
import AuthLayout from "component/backstage/AuthLayout";
import Navigation from "component/backstage/Navigation";
import moment from "moment";
import { useRouter } from "next/router";
import React, { ChangeEvent, useEffect, useState } from "react";
interface CarouselList {
    id: number,
    name: string,
    weight: number,
    status: boolean,
    startTime: Date,
    endTime: Date,
    createTime: Date,
    updateTime: Date,
    createUser: string,
    updateUser: string,
}

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
    alt: string,
    url: string,
    status: boolean,
    weight: number,
}

interface PageSearch {
    name?: string,
    key?: string,
}


export default function Carousel() {
    let title = "輪詢圖介面";

    const { state, dispatch } = useAuthStateContext();
    const auth: Auth = state;
    const router = useRouter();
    const [pAdd, setPAdd] = useState<boolean>(false);
    const [pEdit, setPEdit] = useState<boolean>(false);
    const [pDelete, setPDelete] = useState<boolean>(false);
    const [CarouselList, setCarouselList] = useState<CarouselList[]>([]);
    const [checkboxItem, setCheckboxItem] = useState<string>("");
    const [sendCount, setSendCount] = useState<number>(0);
    const [pageSearch, setPageSearch] = useState<PageSearch>();
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
        getDataList();
        let fetchData = async () => {
            setPAdd(await featureRole(auth, "carousel:create"));
            setPEdit(await featureRole(auth, "carousel:edit"));
            setPDelete(await featureRole(auth, "carousel:delete"));
        };
        fetchData();
    }, [pageMutlSearchData.page, sendCount])

    //取表單資料 by 參數
    const getDataList = () => {
        carouselApi(pageMutlSearchData, auth)?.then((resp: any) => {
            setCarouselList(resp.data.carousel ?? []);
            setPageMutlSearchData(resp.data.pageData);
        }).catch(error => {
            var alertData = setAlertData(alertMsg, error.response?.data?.msg ?? "資料讀取錯誤", true, "error");
            setAlertMsg(alertData);
        });
    }


    //設定搜尋參數 to object
    const setSearchData = (searchName: any, value: string) => {
        let search: PageSearch;
        if (pageSearch == undefined) {
            search = {};
        } else {
            search = { ...pageSearch };
        }
        // search[searchName]=value;
        search = setValueToInterfaceProperty(search, searchName, value);
        setPageSearch(search);
    }

    //頁碼刷新
    const pageHandle = (event: ChangeEvent<unknown>, page: number) => {
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

        carouselDeleteApi(ids, auth)?.then((resp: any) => {
            var alertData = setAlertData(alertMsg, "id:" + checkboxItem + " 刪除成功", true, "success");
            setAlertMsg(alertData);
            sendHandle();
        }).catch(error => {
            var alertData = setAlertData(alertMsg, "id:" + checkboxItem + error.response?.data?.msg ?? "刪除失敗", true, "error");
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
        let searchData = { ...pageSearch };

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

    //add
    const addHandle = () => {
        router.push({
            pathname: '/backstage/carousel/[id]',
            query: { id: "create" },
          });
    }

    //edit
    const editHandle = (id: string) => {
        let ids = checkboxItem;
        if (id != "") {
            ids = id;
        }
        router.push({
            pathname: '/backstage/carousel/[id]',
            query: { id: ids },
          });
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
            field: 'startTime',
            headerName: '開始時間',
            type: 'dateTime',
            sortable: false,
            minWidth: 200,
            valueFormatter: (params: GridValueFormatterParams) => {
                return moment(params.value?.toString()).format("yyyy-MM-DD HH:mm:ss");
            }
        },
        {
            field: 'endTime',
            headerName: '結束時間',
            type: 'dateTime',
            sortable: false,
            minWidth: 200,
            valueFormatter: (params: GridValueFormatterParams) => {
                return moment(params.value?.toString()).format("yyyy-MM-DD HH:mm:ss");
            }
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
                            <TextField id="outlined-search" label="名稱" type="search" value={pageSearch?.name} onChange={e => setSearchData("name", e.target.value)} />
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
                            </Grid>
                        }
                        {pEdit &&
                            <Grid item >
                                <Button variant="contained" color="success" size="medium" style={{ height: '56px' }} endIcon={<Edit />}
                                    onClick={(event) => { editHandle("") }}
                                    disabled={(checkboxItem.split(",").length != 1 || checkboxItem == "")}>
                                    Edit
                                </Button>
                            </Grid>
                        }
                        {pDelete &&
                            <Grid item >
                                <Button variant="contained" color="error" size="medium" style={{ height: '56px' }} endIcon={<Delete />}
                                    onClick={(event) => { deleteItemHandle("") }}
                                    disabled={(checkboxItem.split(",").length < 1 || checkboxItem == "")}>
                                    Delete
                                </Button>
                            </Grid>
                        }
                    </Grid>
                    <Grid container item direction="row" xs={10} >
                        <DataGrid
                            sx={{ width: '1800px', minHeight: '500px', textAlign: 'center' }}
                            autoHeight
                            rows={CarouselList}
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

