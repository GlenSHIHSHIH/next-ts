import { Pagination } from "@mui/material";
import { gridPageSelector, useGridApiContext, useGridSelector } from "@mui/x-data-grid";
import { ChangeEvent } from "react";

interface CunstomPaginationProp{
    pageCount: number;
    pageHandle:(event: ChangeEvent<unknown>, page: number)=>void;
}

const CustomPagination: React.FC<CunstomPaginationProp> = (props: any) => {
    const { pageCount,pageHandle } = props;
    const apiRef = useGridApiContext();
    const page = useGridSelector(apiRef, gridPageSelector);
    // const pageCount = useGridSelector(apiRef, gridPageCountSelector);

    return (
        <Pagination
            color="primary"
            count={pageCount}
            page={page + 1}
            onChange={pageHandle}
        />
    );
}

export default CustomPagination;

