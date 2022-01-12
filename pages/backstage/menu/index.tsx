import { useAuthStateContext } from "@context/context";
import { Auth } from "@context/reducer";
import { Grid, Pagination } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { menuApi } from "@pages/api/backstage/menu/menuApi";
import { PageMutlSearchData } from "@pages/api/backstage/utilApi";
import AuthLayout from "component/backstage/AuthLayout";
import Navigation from "component/backstage/Navigation";
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

export default function Menu() {
    let title = "Menu";

    const { state, dispatch } = useAuthStateContext();
    const [menuViewList, setMenuViewList] = useState<MenuViewList[]>([]);
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

    }, [pageMutlSearchData.page])

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


    const columns: GridColDef[] = [
        { field: 'id', headerName: 'id', minWidth: 100 },
        {
            field: 'name',
            headerName: '名稱',
            minWidth: 150,
            editable: true,
        },
        {
            field: 'key',
            headerName: '識別碼',
            minWidth: 150,
            editable: true,
        },
        {
            field: 'url',
            headerName: '網址',
            minWidth: 200,
            editable: true,
        },
        {
            field: 'feature',
            headerName: '頁面功能',
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
    ];

    const pageHandle = (event: ChangeEvent<unknown>, page: number) => {
        console.log(page);
        let pageData = { ...pageMutlSearchData };
        pageData.page = page;
        setPageMutlSearchData(pageData);
    }

    return (
        <AuthLayout>
            <Navigation title={title}>
                <Grid container direction="column" justifyContent="flex-start" alignItems="center">
                    <Grid container item direction="row" xs={10} >

                    </Grid>
                    <Grid container item direction="row" xs={10} >
                        <div style={{ width: '1200px' }}>
                            <DataGrid
                                autoHeight
                                rows={menuViewList}
                                columns={columns}
                                checkboxSelection
                                disableSelectionOnClick

                                pageSize={pageMutlSearchData.pageLimit}
                                // onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                                // rowsPerPageOptions={process.env.PAGE_SIZE?.split(',') as unknown as number[]}

                                components={{
                                    Pagination: Pagination,
                                }}
                                componentsProps={{
                                    pagination: { count: Math.ceil(pageMutlSearchData.count / pageMutlSearchData.pageLimit), page: pageMutlSearchData.page, onChange: pageHandle, showFirstButton: true, showLastButton: true },
                                }}
                            />
                        </div>
                    </Grid>
                    <Grid container item direction="row" xs={10} >

                    </Grid>
                </Grid>
            </Navigation>
        </AuthLayout>
    )
}

