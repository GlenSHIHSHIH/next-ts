import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Paper from '@mui/material/Paper';
import * as React from 'react';

interface SearchData {
    searchSet: (text: string) => void;
    searchCheckSet: () => void;
    DefaultValue:string;
}

const SearchBar: React.FC<SearchData> = (props) => {

    var {
        searchSet,
        searchCheckSet,
        DefaultValue,
    } = props;

    return (
        <Paper
            component="form"
            sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
        >
            <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Search Production"
                onChange={e => searchSet(e.target.value)}
                defaultValue={DefaultValue}
            />
            <IconButton type="button" sx={{ p: '10px' }} aria-label="search" onClick={searchCheckSet} >
                <SearchIcon />
            </IconButton>
        </Paper>
    );
}

export default SearchBar;