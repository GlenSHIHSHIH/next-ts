import { useAuthStateContext } from '@context/context';
import { ExpandLess, ExpandMore, StarBorder } from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import { Collapse, createTheme, Divider, Grid, List, ListItemButton, ListItemIcon, ListItemText, responsiveFontSizes, ThemeProvider } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { getNaviApi } from '@pages/api/backstage/navigationApi';
import PropTypes from 'prop-types';
import * as React from 'react';
import { useEffect, useState } from 'react';
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

    const [mobileOpen, setMobileOpen] = useState(false);
    const [openValue, setOpenValue] = useState<OpenValue[]>();
    const [menuList, setMenuList] = useState<MenuNestData[]>();


    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleClick = (id: number) => () => {
        console.log(id);
        setOpenBoolean(id, true);
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

    const setOpenBoolean = (id: number, value: boolean) => {
        let o = isOpenBoolean(id);

        if (o == value) {
            return;
        }

        if (o == null) {
            let open: OpenValue = {
                id: id,
                isopen: true
            }
            let setValue = openValue?.concat(open);
            setOpenValue(setValue);
            return;
        }

        if (openValue != undefined) {
            for (var ov of openValue) {
                if (ov.id == id) {
                    ov.isopen = value;
                    break;
                }
            }
            return;
        }

    }

    const setNavData = (navigation: MenuNestData[] | undefined) => {
        if (navigation == undefined) {
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
        } else if ("object" === typeof navigation) {
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


                    <List>
                        {navigation.map(({ id, name, child }: MenuNestData) => {
                            const open = isOpenBoolean(id) || false;
                            return (
                                <div key={id}>
                                    <ListItemButton onClick={handleClick(id)}>
                                        <ListItemIcon>
                                            <InboxIcon />
                                        </ListItemIcon>
                                        <ListItemText primary={name} />
                                        {open ? <ExpandLess /> : <ExpandMore />}
                                    </ListItemButton>
                                    <Collapse in={open} timeout="auto" unmountOnExit>
                                        <List component="div" disablePadding>
                                            {child.map(({ id, name }: MenuNestData) => (
                                                <ListItemButton key={id} sx={{ pl: 4 }}>
                                                    <ListItemIcon>
                                                        <StarBorder />
                                                    </ListItemIcon>
                                                    <ListItemText primary={name} />
                                                </ListItemButton>
                                            ))}
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

    const { state } = useAuthStateContext();
    useEffect(() => {
        // STEP 1：在 useEffect 中定義 async function 取名為 fetchData
        let fetchData = async () => {
            // STEP 2：使用 Promise.all 搭配 await 等待兩個 API 都取得回應後才繼續
            var navigation: MenuNestData[] = await getNaviApi(state);
            // var navigation: MenuNestData[] = JSON.parse(await getNaviApi(state) ?? "{}");
            if (navigation != null && navigation != undefined) {
                setMenuList(navigation);
            }

        };
        fetchData();
    }, []);

    const container = window !== undefined ? () => window().document.body : undefined;
    return (
        <Box sx={{ display: 'flex' }}>
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
                        <Typography variant="h6" noWrap component="div" >
                            {title}
                        </Typography>
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
                    {children}
                </Box>
            </ThemeProvider>
        </Box>
    );
}

Navigation.propTypes = {
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    window: PropTypes.func,
};
export default Navigation;




