import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import * as React from 'react';
import { useState } from 'react';

interface SelectOption {
    SelectName: string,
    OptionValue: string[],
    DefaultValue?: string,
    SelectSet: (value: string) => void,
}

const SelectBox: React.FC<SelectOption> = (props) => {

    const { OptionValue, SelectName, DefaultValue,SelectSet } = props;
    const [selectValue, setSelectValue] = useState('');

    const selectHandleChange = (event: SelectChangeEvent) => {
        setSelectValue(event.target.value as string);
        if (SelectSet) {
            SelectSet(event.target.value);
        }


    };

    return (
        <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">{SelectName}</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    value={selectValue}
                    label={SelectName}
                    onChange={selectHandleChange}
                    defaultValue={DefaultValue ?? ""}
                >
                    {
                        OptionValue.map((oValue) => {
                            return (
                                <MenuItem key={SelectName + oValue} value={oValue}>{oValue}</MenuItem>
                            )
                        })
                    }
                </Select>
            </FormControl>
        </Box>
    );
}
export default SelectBox;
