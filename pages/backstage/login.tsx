import { Box, Button, Container, createTheme, Divider, FormControl, Grid, IconButton, InputAdornment, InputLabel, OutlinedInput, Paper, responsiveFontSizes, TextField, ThemeProvider, Typography } from "@mui/material";
import React from "react";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { login } from "@pages/api/backstage/login";

interface State {
    amount: number,
    password: string,
    showPassword: boolean,
}

interface Account {
    amount: number,
    userName: string,
}

interface Login {
    loginName: string,
    password: string,
}

export default function Login() {

    const userNameMinLen = 4;
    const pwdMinLen = 6

    const [userName, setUserName] = React.useState<Account>({
        amount: userNameMinLen,
        userName: '',
    });
    const [pwd, setPwd] = React.useState<State>({
        amount: pwdMinLen,
        password: '',
        showPassword: false,
    });

    const handleChange =
        (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
            setPwd({ ...pwd, amount: event.target.value.length, [prop]: event.target.value });
        };

    const handleClickShowPassword = () => {
        setPwd({
            ...pwd,
            showPassword: !pwd.showPassword,
        });
    };

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleLogin = () => {
        if (userName.userName.length < userNameMinLen || pwd.password.length < pwdMinLen) {
            setPwd({
                ...pwd,
                amount: pwd.password.length
            });
            setUserName({
                ...userName,
                amount: userName.userName.length,
            })
            return;
        }

        var data: Login = {
            loginName: userName.userName,
            password: pwd.password,
        }

        login(data)?.then(res => {
            console.log("login data: ");
            console.log(res);
            // category = res.data.category;
        }).catch(error => {
            console.log("getCategoryList 錯誤");
        })
    }

    return (
        <Container maxWidth="xl">
            <Grid container direction="column" justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
                <Box
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'space-around',
                        '& > :not(style)': {
                            m: 1,
                            width: 500,
                            height: 600,
                        },
                    }}
                >

                    <Paper elevation={1}>
                        <Grid item container direction="column" justifyContent="center" alignItems="center">
                            <AccountCircleIcon color="action" sx={{ fontSize: 210 }} />
                        </Grid>
                        <Typography variant="h4" color="text.secondary"><Divider >Login</Divider></Typography>
                        <Grid item container direction="column" justifyContent="center" alignItems="center" marginTop={3}>

                            <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                                <InputLabel htmlFor="outlined-username">UserName</InputLabel>
                                <OutlinedInput
                                    id="outlined-username"
                                    type={'text'}
                                    value={userName.userName}
                                    onChange={(event) => setUserName({ amount: event.target.value.length, userName: event.target.value })}
                                    label="UserName"
                                    error={userName.amount < userNameMinLen}
                                    required={true}
                                />
                                {userName.amount < userNameMinLen && (
                                    <Typography variant="caption" color="error"> {"UserName at limit " + userNameMinLen + " character"}</Typography>
                                )}

                            </FormControl>

                            <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                                <InputLabel htmlFor="outlined-password">Password</InputLabel>
                                <OutlinedInput
                                    id="outlined-password"
                                    type={pwd.showPassword ? 'text' : 'password'}
                                    value={pwd.password}
                                    onChange={handleChange('password')}
                                    label="Password"
                                    error={pwd.amount < pwdMinLen}
                                    required={true}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                edge="end"
                                            >
                                                {pwd.showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                />
                                {pwd.amount < pwdMinLen && (
                                    <Typography variant="caption" color="error"> {"Password at limit " + pwdMinLen + " character"}</Typography>
                                )}
                            </FormControl>
                            <Button variant="contained" color="warning" size="large" style={{ width: '252px', marginTop: '20px' }}
                                onClick={handleLogin}>
                                Login
                            </Button>
                        </Grid>
                    </Paper>
                </Box>
            </Grid>
        </Container >
    )
}

function handleChange(arg0: string): React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> | undefined {
    throw new Error("Function not implemented.");
}
