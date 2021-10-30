import * as React from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';

interface SearchData {
    searchHandlerEnvet?: React.MouseEventHandler<HTMLElement>,
}

const SearchBar: React.FC<SearchData> = (props) => {

    var {
        searchHandlerEnvet,
    } = props;

    return (
        <Paper
            component="form"
            sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
        >
            <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Search Production"
            />
            <IconButton type="submit" sx={{ p: '10px' }} aria-label="search" onClick={searchHandlerEnvet} >
                <SearchIcon />
            </IconButton>
        </Paper>
    );
}

export default SearchBar;