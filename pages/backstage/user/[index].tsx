import { useAuthStateContext } from "@context/context";
import { Auth } from "@context/reducer";
import { Add, Delete, Edit } from "@mui/icons-material";
import Search from "@mui/icons-material/Search";
import { Button, Checkbox, FormControlLabel, Grid, Pagination, Switch, TextField, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridSortModel, GridValueFormatterParams } from "@mui/x-data-grid";
import { roleAllListApi, userAddApi, userApi, userByIdApi, userDeleteApi, userEditByIdApi, userEditPwdByIdApi, userResetPwdByIdApi } from "@pages/api/backstage/user/userApi";
import { PageMutlSearchData } from "@pages/api/backstage/utilApi";
import BaseStyle from "@styles/page/backstage/Base.module.css";
import { featureRole, setValueToInterfaceProperty } from "@utils/base_fucntion";
import AlertFrame, { AlertMsg, setAlertAutoClose, setAlertData } from "component/backstage/AlertFrame";
import AuthLayout from "component/backstage/AuthLayout";
import DraggableDialog from "component/backstage/Dialogs";
import Navigation from "component/backstage/Navigation";
import moment from "moment";
import React, { ChangeEvent, useEffect, useState } from "react";
interface UserList {
    id: number,
    name: string,
    loginName: string,
    email: string,
    status: boolean,
    UserType: boolean,
    remark: string,
    role: string,
    createTime: Date,
    updateTime: Date,
    createUser: string,
    updateUser: string
}

interface UserData {
    id: number,
    name: string,
    loginName: string,
    password: string,
    email: string,
    userType: boolean,
    status: boolean,
    remark: string,
    select: string[],
}

interface UserSearch {
    name?: string,
    email?: string,
    loginName?: string
}

interface DialogOption {
    title?: string,
    className?: string,
    data?: UserData,
}

interface RoleData {
    id: number,
    name: string,
    key: string,
    status: boolean,
}

interface PasswordChange {
    id?: number,
    type?: number,
    orgPassword?: string,
    newPassword?: string,
    checkPassword?: string,
}

export default function User() {
    let title = "使用者介面";

    const { state, dispatch } = useAuthStateContext();
    const auth: Auth = state;
    const [pAdd, setPAdd] = useState<boolean>(false);
    const [pEdit, setPEdit] = useState<boolean>(false);
    const [pDelete, setPDelete] = useState<boolean>(false);
    const [pwdEdit, setPwdEdit] = useState<boolean>(false);
    const [pwdReset, setPwdReset] = useState<boolean>(false);
    const [userList, setUserList] = useState<UserList[]>([]);
    const [checkboxItem, setCheckboxItem] = useState<string>("");
    const [roleData, setRoleData] = useState<RoleData[]>([]);
    const [dialogOption, setDialogOption] = useState<DialogOption>({});
    const [sendCount, setSendCount] = useState<number>(0);
    const [userSearch, setUserSearch] = useState<UserSearch>();
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
        getUserList();
        getRoleAllList();
        let fetchData = async () => {
            setPAdd(await featureRole(auth, "/backstage/user/create"));
            setPEdit(await featureRole(auth, "/backstage/user/edit"));
            setPDelete(await featureRole(auth, "/backstage/user/delete"));
            setPwdEdit(await featureRole(auth, "/backstage/user/password/edit"));
            setPwdReset(await featureRole(auth, "/backstage/user/password/reset"));
        };
        fetchData();
    }, [pageMutlSearchData.page, sendCount])

    //取表單資料 by 參數
    const getUserList = () => {
        userApi(pageMutlSearchData, auth)?.then((resp: any) => {
            setUserList(resp.data.userList ?? []);
            setPageMutlSearchData(resp.data.pageData);
        }).catch(error => {
            var alertData = setAlertData(alertMsg, error.response?.data?.msg ?? "資料讀取錯誤", true, "error");
            setAlertMsg(alertData);
        });
    }

    //取菜單權限tree
    const getRoleAllList = () => {
        roleAllListApi(auth)?.then((resp: any) => {
            setRoleData(resp.data.roleList);
        }).catch(error => {
            var alertData = setAlertData(alertMsg, error.response?.data?.msg ?? "角色權限讀取錯誤", true, "error");
            setAlertMsg(alertData);
        });
    }

    //設定搜尋參數 to object
    const setSearchData = (searchName: any, value: string) => {
        let search: UserSearch;
        if (userSearch == undefined) {
            search = {};
        } else {
            search = { ...userSearch };
        }
        // search[searchName]=value;
        search = setValueToInterfaceProperty(search, searchName, value);
        setUserSearch(search);
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
        userDeleteApi(ids, auth)?.then((resp: any) => {
            var alertData = setAlertData(alertMsg, "id" + checkboxItem + " 刪除成功", true, "success");
            setAlertMsg(alertData);
            sendHandle();
        }).catch(error => {
            var alertData = setAlertData(alertMsg, "id:" + checkboxItem + "," + error.response?.data?.msg ?? "刪除失敗", true, "error");
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
        let userSearchData = { ...userSearch };

        if (sortModel != undefined) {
            pageSearchData.sortColumn = (sortModel[0]?.field) ?? ""
            pageSearchData.sort = (sortModel[0]?.sort) ?? ""
        }

        pageSearchData.search = userSearchData;
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
        setDialogSelectRole();
        if (dialogOption?.title == "新增") {
            userAddApi(dialogOption.data, auth)?.then((resp: any) => {
                var alertData = setAlertData(alertMsg, "新增成功", true, "success");
                setAlertMsg(alertData);
                sendHandle();
                handleClose();
            }).catch(error => {
                var alertData = setAlertData(alertMsg, error.response?.data?.msg ?? "新增失敗", true, "error");
                setAlertMsg(alertData);
            });

        } else {
            userEditByIdApi(dialogOption.data, auth)?.then((resp: any) => {
                var alertData = setAlertData(alertMsg, "id" + dialogOption.data?.id + " 修改成功", true, "success");
                setAlertMsg(alertData);
                sendHandle();
                handleClose();
            }).catch(error => {
                var alertData = setAlertData(alertMsg, "id" + dialogOption.data?.id + "," + error.response?.data?.msg ?? " 修改失敗", true, "error");
                setAlertMsg(alertData);
            });
        }

    };

    //dialog roleData select set to selected
    const [selected, setSelected] = useState<string[]>([]);
    const setSelect = (id: string, check: boolean) => {
        let roleSelect = [...selected];
        if (check) {
            if (!roleSelect.includes(id)) {
                roleSelect.push(id);
            }
        } else {
            roleSelect.splice(roleSelect.indexOf(id), 1);
        }
        setSelected(roleSelect);
    }

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
        var data: UserData = {
            id: 0,
            name: "",
            loginName: "",
            password: "",
            email: "",
            userType: true,
            status: true,
            remark: "",
            select: [],
        };
        return data;
    }
    //edit
    const editHandle = (id: string) => {
        let ids = checkboxItem;
        if (id != "") {
            ids = id;
        }
        userByIdApi(ids, auth)?.then((resp: any) => {
            var dialogOptionData: DialogOption = dialogOption;
            dialogOptionData.title = "修改";
            dialogOptionData.className = BaseStyle.dialogEditTitle;
            dialogOptionData.data = resp.data.userById;
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
        let diaData: UserData;
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

    //設定role 權限 資料儲存
    const setDialogSelectRole = () => {
        let dialogOptionData = { ...dialogOption };
        if (dialogOptionData.data != undefined) {
            dialogOptionData.data.select = selected;
        }
        setDialogOption(dialogOptionData);
    }

    //密碼更新 password
    const [passwordDialog, setPasswordDialog] = React.useState(false);
    const [changePassword, setChangePassword] = useState<PasswordChange>({});

    //彈跳視窗
    const passwordIsOpen = (b: boolean, setType: number) => {
        setPasswordDialog(b);
        let setPwd: PasswordChange = changePassword ?? {};
        setPwd = setValueToInterfaceProperty(setPwd, "type", setType);
        setChangePassword(setPwd);
    }

    //關閉視窗
    const passwordClose = () => {
        setPasswordDialog(false);
        setChangePassword({});

    }

    //新密碼 確認
    const passwordCheck = () => {

        if ((changePassword?.newPassword?.length ?? 0) < 6) {
            return "密碼長度不得小於6";
        }

        if (changePassword?.orgPassword == changePassword?.newPassword) {
            return "新舊密碼不得相同";
        }

        return "";
    }

    //設定值
    const setPasswordData = (name: any, value: any) => {
        let setPwd: PasswordChange = { ...changePassword } ?? {};
        setPwd = setValueToInterfaceProperty(setPwd, name, value);
        setChangePassword(setPwd);
    }

    //送出
    const passwordHandle = (e: any) => {
        e.preventDefault();
        // console.log("changePassword");
        // console.log(changePassword);
        // return;
        //api 寫入
        if (changePassword.type == 2) {
            userEditPwdByIdApi(changePassword, auth)?.then((resp: any) => {
                var alertData = setAlertData(alertMsg, "密碼修改成功", true, "success");
                setAlertMsg(alertData);
                passwordClose();
            }).catch(error => {
                var alertData = setAlertData(alertMsg, "id:" + changePassword?.id + "," + error.response?.data?.msg ?? "密碼修改失敗", true, "error");
                setAlertMsg(alertData);
                console.log("userEditPwdByIdApi");
            });
        } else if (changePassword.type == 1) {
            userResetPwdByIdApi(changePassword, auth)?.then((resp: any) => {
                var alertData = setAlertData(alertMsg, "密碼重置成功", true, "success");
                setAlertMsg(alertData);
                passwordClose();
            }).catch(error => {
                var alertData = setAlertData(alertMsg, "id:" + changePassword?.id + "," + error.response?.data?.msg ?? "密碼修改失敗", true, "error");
                setAlertMsg(alertData);
                console.log("userResetPwdByIdApi");
            });
        }
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
            field: 'loginName',
            headerName: '帳號',
            sortable: false,
            minWidth: 150,
        },
        {
            field: 'password',
            headerName: '功能',
            sortable: false,
            minWidth: 400,
            renderCell: (cellValues) => {
                return (
                    <div>
                        {pwdEdit &&
                            <Button
                                variant="contained"
                                color="warning"
                                onClick={(event) => {
                                    passwordIsOpen(true, 2);
                                    setPasswordData("id", cellValues.id);
                                }}
                            >
                                密碼變更
                            </Button>
                        }
                        {pwdReset &&
                            < Button
                                variant="contained"
                                color="info"
                                onClick={(event) => {
                                    passwordIsOpen(true, 1);
                                    setPasswordData("id", cellValues.id);
                                }}
                            >
                                密碼重置
                            </Button>
                        }
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
            field: 'email',
            headerName: 'email',
            minWidth: 200,
        },
        {
            field: 'role',
            headerName: '權限',
            minWidth: 120,
        },
        {
            field: 'userType',
            headerName: '系統用戶',
            minWidth: 120,
            type: 'boolean',
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
                            <TextField id="outlined-search" label="名稱" type="search" value={userSearch?.name} onChange={e => setSearchData("name", e.target.value)} />
                        </Grid>
                        <Grid item >
                            <TextField id="outlined-search" label="帳號" type="search" value={userSearch?.loginName} onChange={e => setSearchData("loginName", e.target.value)} />
                        </Grid>
                        <Grid item >
                            <TextField id="outlined-search" label="email" type="search" value={userSearch?.email} onChange={e => setSearchData("email", e.target.value)} />
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
                                <Button variant="contained" color="success" size="medium" style={{ height: '56px' }} endIcon={<Edit />} onClick={(event) => { editHandle("") }}
                                    disabled={(checkboxItem.split(",").length != 1 || checkboxItem == "")}>
                                    Edit
                                </Button>
                            </Grid>}
                        {pDelete
                            && <Grid item >
                                <Button variant="contained" color="error" size="medium" style={{ height: '56px' }} endIcon={<Delete />} onClick={(event) => { deleteItemHandle("") }}
                                    disabled={(checkboxItem.split(",").length < 1 || checkboxItem == "")}>
                                    Delete
                                </Button>
                            </Grid>}
                    </Grid>
                    <Grid container item direction="row" xs={10} >
                        <DraggableDialog
                            title={changePassword?.type == 2 ? "密碼變更" : "密碼重置"}
                            open={passwordDialog}
                            closeHandle={passwordClose}
                            saveHandle={passwordHandle}
                            className={changePassword?.type == 2 ? BaseStyle.dialogErrorTitle : BaseStyle.dialogInfoTitle}
                        >
                            <Grid container direction="column" justifyContent="center" alignItems="flex-start">
                                {changePassword?.type == 2 &&
                                    <Grid container direction="row" justifyContent="flex-start" alignItems="center" marginBottom={2}>
                                        <Grid item xs={2} md={2}>
                                            <Typography align="right">原始密碼：</Typography>
                                        </Grid>
                                        <Grid item xs={9} md={9} marginLeft={2}>
                                            <TextField fullWidth id="outlined-search" label="原始密碼" type={"password"}
                                                required error={(changePassword?.orgPassword?.length ?? 0) < 6}
                                                helperText={(changePassword?.orgPassword?.length ?? 0) < 6 ? "密碼長度不得小於6" : ""}
                                                onChange={e => setPasswordData("orgPassword", e.target.value)} />
                                        </Grid>
                                    </Grid>
                                }
                                <Grid container direction="row" justifyContent="flex-start" alignItems="center" marginBottom={2}>
                                    <Grid item xs={2} md={2}>
                                        <Typography align="right">新密碼：</Typography>
                                    </Grid>
                                    <Grid item xs={9} md={9} marginLeft={2}>
                                        <TextField fullWidth id="outlined-search" label="新密碼" type={"password"}
                                            required error={(changePassword?.newPassword?.length ?? 0) < 6 || changePassword?.orgPassword == changePassword?.newPassword}
                                            helperText={passwordCheck()}
                                            onChange={e => setPasswordData("newPassword", e.target.value)} />
                                    </Grid>
                                </Grid>

                                <Grid container direction="row" justifyContent="flex-start" alignItems="center" marginBottom={2}>
                                    <Grid item xs={2} md={2}>
                                        <Typography align="right">密碼確認：</Typography>
                                    </Grid>
                                    <Grid item xs={9} md={9} marginLeft={2}>
                                        <TextField fullWidth id="outlined-search" label="新密碼確認" type={"password"}
                                            required error={changePassword?.checkPassword != changePassword?.newPassword} helperText={changePassword?.checkPassword != changePassword?.newPassword ? "密碼不相符" : ""}
                                            onChange={e => setPasswordData("checkPassword", e.target.value)} />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </DraggableDialog>
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
                                        <Typography align="right">帳號：</Typography>
                                    </Grid>
                                    <Grid item xs={9} md={9} marginLeft={2}>
                                        <TextField fullWidth id="outlined-search" required label="帳號" value={dialogOption.data?.loginName}
                                            onChange={e => setdialogData("loginName", e.target.value)} />
                                    </Grid>
                                </Grid>
                                {dialogOption?.title == "新增" &&
                                    <Grid container direction="row" justifyContent="flex-start" alignItems="center" marginBottom={2}>
                                        <Grid item xs={2} md={2}>
                                            <Typography align="right">密碼：</Typography>
                                        </Grid>
                                        <Grid item xs={9} md={9} marginLeft={2}>
                                            <TextField fullWidth id="outlined-search" required label="密碼" type="password" value={dialogOption.data?.password}
                                                onChange={e => setdialogData("password", e.target.value)} />
                                        </Grid>
                                    </Grid>
                                }
                                <Grid container direction="row" justifyContent="flex-start" alignItems="center" marginBottom={2}>
                                    <Grid item xs={2} md={2}>
                                        <Typography align="right">email：</Typography>
                                    </Grid>
                                    <Grid item xs={9} md={9} marginLeft={2}>
                                        <TextField fullWidth id="outlined-search" label="email" value={dialogOption.data?.email}
                                            onChange={e => setdialogData("email", e.target.value)} />
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
                                <Grid container direction="row" justifyContent="flex-start" alignItems="center" >
                                    <Grid item xs={2} md={2}>
                                        <Typography align="right">狀態：</Typography>
                                    </Grid>
                                    <Grid item xs={9} md={9} marginLeft={2}>
                                        <FormControlLabel label="狀態" control={<Switch defaultChecked={dialogOption.data?.status}
                                            onChange={(e, checked) => setdialogData("status", checked)} />} />
                                    </Grid>
                                </Grid>
                                <Grid container direction="row" justifyContent="flex-start" alignItems="center" >
                                    <Grid item xs={2} md={2}>
                                        <Typography align="right">系統用戶：</Typography>
                                    </Grid>
                                    <Grid item xs={9} md={9} marginLeft={2}>
                                        <FormControlLabel label="系統用戶" control={<Switch defaultChecked={dialogOption.data?.status}
                                            onChange={(e, checked) => setdialogData("userType", checked)} />} />
                                    </Grid>
                                </Grid>
                                <Grid container direction="row" justifyContent="flex-start" alignItems="center" >
                                    <Grid item xs={2} md={2}>
                                        <Typography align="right">角色權限：</Typography>
                                    </Grid>
                                    <Grid item xs={9} md={9} marginLeft={2}>
                                        {roleData.map((r: RoleData) => {
                                            return (
                                                < FormControlLabel label={r.name}
                                                    control={<Checkbox disabled={!r.status} defaultChecked={dialogOption.data?.select?.includes(r.id.toString()) ?? false}
                                                        onChange={(e, checked) => setSelect(r.id.toString(), checked)} />} />
                                            )
                                        })
                                        }
                                    </Grid>
                                </Grid>
                            </Grid>

                        </DraggableDialog>
                    </Grid>
                    <Grid container item direction="row" xs={10} >

                        <DataGrid
                            sx={{ width: '1600px', minHeight: '500px', textAlign: 'center' }}
                            autoHeight
                            rows={userList}
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

