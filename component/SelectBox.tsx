import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useState } from 'react';

interface SelectOption {
    SelectName: string,
    OptionValue: number[],
    // DefaultValue: number,
}

const SelectBox: React.FC<SelectOption> = (props) => {

    const { OptionValue, SelectName } = props;
    const [selectValue, setSelectValue] = useState('');

    const handleChange = (event: SelectChangeEvent) => {
        setSelectValue(event.target.value as string);

    };

    return (
        <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">{SelectName}</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectValue}
                    label={SelectName}
                    onChange={handleChange}
                >
                    {
                        OptionValue.map((oValue) => {
                            return (
                                <MenuItem value={oValue}>{oValue}</MenuItem>
                            )
                        })
                    }
                </Select>
            </FormControl>
        </Box>
    );
}
export default SelectBox;
