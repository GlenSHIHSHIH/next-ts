import { logoutRemoveCookie } from '@context/actions';
import { useAuthStateContext } from '@context/context';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
import { Collapse, createTheme, Divider, Grid, List, ListItemButton, ListItemIcon, ListItemText, responsiveFontSizes, ThemeProvider } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { getNaviApi, logoutApi } from '@pages/api/backstage/navigationApi';
import Link from "next/link";
import { useRouter } from 'next/router';
import * as React from 'react';
import { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import AlertFrame from './AlertFrame';

interface NavigationProp {
    window?: any,
    menuName?: string,
    backGroundColor?: string,
    titleBackGroundColor?: string,
    title?: string
    children?: any
}
interface MenuNestData {
    id: number,
    name: string,
    key: string,
    url: string,
    feature: string,
    parent: number,
    child: MenuNestData[];
}

interface OpenValue {
    id: number,
    isopen: boolean
}

const Navigation: React.FC<NavigationProp> = (props: any) => {

    const {
        children,
        title,
        window,
        menuName = process.env.DEFAULT_TITLE,
        backGroundColor = process.env.DEFAULT_PAGE_BACKGROUND_COLOR,
        titleBackGroundColor = process.env.DEFAULT_TITLE_BACKGROUND_COLOR
    } = props;

    const drawerWidth = 240;

    let theme = createTheme();
    theme = responsiveFontSizes(theme);

    const router = useRouter();

    const [mobileOpen, setMobileOpen] = useState(false);
    const [openValue, setOpenValue] = useState<OpenValue[]>();
    const [menuList, setMenuList] = useState<MenuNestData[]>();
    const [errMsg, setErrMsg] = useState<string>();
    const { state, dispatch } = useAuthStateContext();


    useEffect(() => {
        if (errMsg?.length != 0) {
            setTimeout(() => {
                setErrMsg("");
            }, 3000);
        }

        // STEP 1：在 useEffect 中定義 async function 取名為 fetchData
        let fetchData = async () => {

            var data = await getNaviApi(state);
            if (data.length > 0) {
                setMenuList(JSON.parse(data));
            }

        };
        fetchData();
    }, []);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleClick = (id: number) => () => {
        setOpenBoolean(id);
    };

    const isOpenBoolean = (id: number) => {
        if (openValue != undefined) {
            for (var ov of openValue) {
                if (ov.id == id) {
                    return ov.isopen;
                }
            }
        }

        return null;
    }

    const setOpenBoolean = (id: number) => {
        let o = isOpenBoolean(id);

        if (o == null) {
            let open: OpenValue = {
                id: id,
                isopen: true
            }

            let setValue: OpenValue[];
            if (openValue == undefined) {
                setValue = [open];
            } else {
                setValue = openValue?.concat(open);
            }

            setOpenValue(setValue);
            return;

        }

        if (openValue != undefined) {
            for (var ov of openValue) {
                if (ov.id == id) {
                    ov.isopen = !o;
                    break;
                }
            }
            let openData = [...openValue]
            setOpenValue(openData);
            return;
        }

    }

    const setNavData = (menusData: MenuNestData[] | undefined) => {
        if (menusData == undefined) {
            return (
                <div>
                    <Toolbar style={{ background: backGroundColor }}>
                        <Grid container item direction="column" justifyContent="center" alignItems="center">
                            <Typography variant="h6" noWrap component="div">
                                {menuName ?? "Menu"}
                            </Typography>
                        </Grid>
                    </Toolbar>
                    <Divider />
                </div>
            )
        } else if (menusData?.length > 0) {
            return (
                <div>
                    <Toolbar style={{ background: backGroundColor }}>
                        <Grid container item direction="column" justifyContent="center" alignItems="center">
                            <Typography variant="h6" noWrap component="div">
                                {menuName ?? "Menu"}
                            </Typography>
                        </Grid>
                    </Toolbar>
                    <Divider />
                    <List >
                        {menusData.map(({ id, name, child }: MenuNestData) => {
                            const open = isOpenBoolean(id) || false;
                            return (
                                <div >
                                    <ListItemButton key={id} onClick={handleClick(id)}>
                                        <ListItemIcon>
                                            {/* <InboxIcon /> */}
                                        </ListItemIcon>
                                        <ListItemText primary={name} />
                                        {open ? <ExpandLess /> : <ExpandMore />}
                                    </ListItemButton>
                                    <Collapse in={open} component="div" timeout="auto" unmountOnExit>
                                        <List disablePadding > {/*disablePadding */}
                                            {child.map((c: MenuNestData) => {
                                                if (c.feature == "P") {
                                                    return (
                                                        <Link href={c.url} passHref>
                                                            <ListItemButton component="a" sx={{ pl: 4 }}>
                                                                <ListItemIcon>
                                                                    {/*   <StarBorder />*/}
                                                                </ListItemIcon>
                                                                <ListItemText primary={c.name} />
                                                            </ListItemButton >
                                                        </Link>
                                                    );
                                                }
                                            })}
                                        </List>
                                    </Collapse>
                                </div >
                            );
                        })}
                    </List>
                </div >
            );
        }
    }

    const logout = () => {
        logoutApi(state)?.then(res => {
            // console.log("login data: ");
            // category = res.data.category;
            console.log(res);
            logoutRemoveCookie(dispatch);
            router.push("/backstage/login");
        }).catch(error => {
            console.log("error:");
            console.log(error);
            setErrMsg(error.response?.data?.msg);
        });
    };

    const container = window !== undefined ? () => window().document.body : undefined;
    return (
        <Box sx={{ display: 'flex' }}>
            {errMsg && <AlertFrame
                content=''
                strongContent={errMsg}
                alertType="error"
            />
            }
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <AppBar
                    style={{ background: titleBackGroundColor }}
                    position="fixed"
                    sx={{
                        width: { sm: `calc(100% - ${drawerWidth}px)` },
                        ml: { sm: `${drawerWidth}px` },
                    }}
                >
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2, display: { sm: 'none' } }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Grid container spacing={2} wrap="wrap" direction="row" justifyContent="left" alignItems="center">
                            <Grid item>
                                <Typography variant="h6" noWrap component="div" >
                                    {title}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid container item spacing={2} marginRight={1} wrap="wrap" direction="row" justifyContent="right" alignItems="center">
                            <Grid item>
                                <Typography variant="h6" noWrap component="div" >
                                    <span>  {"welcome "}</span> <span> {state?.userInfo?.name ?? ""}</span>
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="h6" noWrap component="div" >
                                    <Link href="#" passHref>
                                        <a onClick={logout}>  登出</a>
                                    </Link>
                                </Typography>
                            </Grid>
                        </Grid>
                    </Toolbar>
                </AppBar>
                <Box
                    component="nav"
                    sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                    aria-label="mailbox folders"
                >
                    {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                    <Drawer
                        container={container}
                        variant="temporary"
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                        ModalProps={{
                            keepMounted: true, // Better open performance on mobile.
                        }}
                        sx={{
                            display: { xs: 'block', sm: 'none' },
                            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                        }}
                    >
                        {setNavData(menuList)}
                    </Drawer>
                    <Drawer
                        variant="permanent"
                        sx={{
                            display: { xs: 'none', sm: 'block' },
                            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                        }}
                        open
                    >
                        {setNavData(menuList)}

                    </Drawer>
                </Box>
                <Box
                    component="main"
                    sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
                >
                    <Toolbar />
                    <div key="children Navigation">
                        {children}
                    </div>
                </Box>
            </ThemeProvider>
        </Box>
    );
}

// Navigation.propTypes = {
//     /**
//      * Injected by the documentation to work in an iframe.
//      * You won't need it on your project.
//      */
//     window: PropTypes.func,
// };

export default Navigation;




