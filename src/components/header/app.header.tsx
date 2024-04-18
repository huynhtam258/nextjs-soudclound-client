'use client'
import * as React from 'react';
import { styled, alpha, Theme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession, signIn, signOut } from "next-auth/react"
import { fetchDefaultImages } from '@/utils/api';
import Image from 'next/image';
import ActiveLink from './active.link';

const Search = styled('div')(({ theme }: { theme: Theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '300px',
        },
    },
}));


export default function AppHeader() {
    const { data: session } = useSession()

    // console.log(">>> check session: ", useSession())
    const router = useRouter()
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState<null | HTMLElement>(null);

    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };

    const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const navItems = [
        {
            name: 'Playlists',
            path: 'playlist'
        }, {
            name: 'Likes',
            path: 'like'
        },
        {
            name: 'Upload',
            path: 'track/upload'
        }
    ];
    const handleRedirectHome = () => {
        router.push('/')
    }
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar
                position="static"
                sx={{
                    background: "#333"
                }}
            >
                <Container disableGutters>
                    <Toolbar>
                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            sx={{
                                display: { xs: 'none', sm: 'block' },
                                cursor: 'pointer'
                            }}
                            onClick={() => handleRedirectHome()}
                        >
                            SoundCloud
                        </Typography>
                        <Search>
                            <SearchIconWrapper>
                                <SearchIcon />
                            </SearchIconWrapper>
                            <StyledInputBase
                                placeholder="Search…"
                                inputProps={{ 'aria-label': 'search' }}
                                onKeyDown={(e: any) => {
                                    if(e.key === 'Enter') {
                                        if (e.target.value) {
                                            router.push(`/search?q=${e.target.value}`)
                                        }
                                    }
                                }}
                            />
                        </Search>
                        <Box sx={{ flexGrow: 1 }} />
                        <Box sx={{ display: { xs: 'none', md: 'flex' }, width: "fit-content" }}>
                            <List sx={{ display: "flex" }}>
                                {session ? <>{navItems.map((item) => (
                                    <ListItem key={item.name} disablePadding>
                                        <ListItemButton sx={{ 
                                                textAlign: 'center', 
                                                '> a': { 
                                                    color: 'unset', 
                                                    textDecoration: 'unset',
                                                    padding: '5px',

                                                    '&.active': {
                                                        background: '#3b4a59',
                                                        color: '#cefaff',
                                                        borderRadius: '5px'
                                                    }
                                                }
                                            }}>
                                            <ActiveLink href={item.path}> <ListItemText primary={item.name} /></ActiveLink>
                                        </ListItemButton>
                                    </ListItem>
                                ))}</> : <>
                                    <ListItem disablePadding>
                                        <ListItemButton sx={{ textAlign: 'center', 'a': { color: 'unset', textDecoration: 'unset' } }}>
                                            <Link href='/auth/signin'> <ListItemText primary="Login" /></Link>
                                        </ListItemButton>
                                    </ListItem>
                                </>}
                            </List>
                            <>
                                {
                                    session
                                        ? <IconButton
                                            size="large"
                                            edge="end"
                                            aria-label="account of current user"
                                            aria-haspopup="true"
                                            onClick={handleProfileMenuOpen}
                                            color="inherit"
                                        >
                                            <Image
                                                style={{
                                                    cursor: 'pointer'
                                                }}
                                                height={35}
                                                width={35}
                                                src={fetchDefaultImages(session.user.type)}
                                                alt={session.user.username}
                                            />
                                        </IconButton>
                                        : <></>
                                }
                            </>


                        </Box>
                        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                            <IconButton
                                size="large"
                                aria-label="show more"
                                aria-controls={"primary-search-account-menu-mobile"}
                                aria-haspopup="true"
                                onClick={handleMobileMenuOpen}
                                color="inherit"
                            >
                                <MenuIcon />
                            </IconButton>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>


            <Menu
                anchorEl={anchorEl}
                id={"primary-search-account-menu"}
                keepMounted
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                open={isMenuOpen}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={handleMenuClose}>
                    <Link
                        href={`/profile/${session?.user._id}`}
                        style={{
                            color: 'unset',
                            textDecoration: 'unset'
                        }}>
                        Profile
                    </Link>
                </MenuItem>
                <MenuItem onClick={() => {
                    handleMenuClose()
                    signOut()
                }}>Sign Out</MenuItem>
            </Menu>

            <Menu
                anchorEl={mobileMoreAnchorEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                id={"primary-search-account-menu-mobile"}
                keepMounted
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                open={isMobileMenuOpen}
                onClose={handleMobileMenuClose}
            >
                <MenuItem onClick={handleMobileMenuClose}>Playlists</MenuItem>
                <MenuItem onClick={handleMobileMenuClose}>Likes</MenuItem>

                <MenuItem onClick={handleMobileMenuClose}>Profile</MenuItem>
                <MenuItem onClick={handleMobileMenuClose}>Sign Out</MenuItem>


            </Menu>
        </Box >
    );
}
