import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import * as React from 'react';
import { useState } from 'react';

interface SelectOption {
    selectName: string,
    optionValue: string[],
    optionAll: boolean,
    defaultValue?: string,
    selectSet: (value: string) => void,
}

const SelectBox: React.FC<SelectOption> = (props) => {

    const { optionValue, optionAll, selectName, defaultValue, selectSet } = props;
    const [selectValue, setSelectValue] = useState<string>();

    const selectHandleChange = (event: SelectChangeEvent) => {
        setSelectValue(event.target.value);
        if (selectSet) {
            selectSet(event.target.value);
        }


    };

    return (
        <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">{selectName}</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    value={selectValue ?? defaultValue}
                    label={selectName}
                    onChange={selectHandleChange}
                    defaultValue={defaultValue ?? ""}
                >
                    {optionAll && <MenuItem key={"All"} value={""}>{"All"} </MenuItem>}
                    {
                        optionValue.map((oValue) => {
                            return (<MenuItem key={selectName + oValue} value={oValue}>{oValue} </MenuItem>)
                        })
                    }
                </Select>
            </FormControl>
        </Box>
    );
}
export default SelectBox;
