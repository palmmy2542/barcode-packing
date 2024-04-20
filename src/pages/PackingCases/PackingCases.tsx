import { Box, Button, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useMemo, useState } from "react";
import { usePacking } from "../../contexts/PackingProvider";
import { PACKED_STATUS } from "../../contexts/PackingProvider/types";
import { columns as productColumns } from "../Products/utils";
import { columns as packingCaseColumns } from "./utils";

const PackingCases = () => {
  const { packagings, findPackagingById } = usePacking();
  const [selectedId, setSelectedId] = useState<string>("");

  const productInPackaging = useMemo(
    () => findPackagingById(selectedId)?.products ?? [],
    [findPackagingById, selectedId]
  );

  const columns: GridColDef[] = useMemo(() => {
    return [
      ...packingCaseColumns,
      {
        field: "action",
        headerName: "",
        width: 200,
        align: "center",
        headerAlign: "center",
        renderCell: (params) => {
          if (
            params.row.status === PACKED_STATUS.READY ||
            params.row.status === PACKED_STATUS.PACKED
          ) {
            return (
              <Button
                variant="text"
                onClick={() => setSelectedId(params.row.id)}
              >
                รายละเอียดสินค้า
              </Button>
            );
          }
        },
      },
    ];
  }, []);

  return (
    <>
      <Typography variant="h5" textAlign={"left"}>
        กล่องทั้งหมด
      </Typography>
      <Box sx={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={packagings}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5]}
          disableRowSelectionOnClick
        />
      </Box>
      {productInPackaging.length > 0 ? (
        <>
          <Typography mt={2} textAlign={"left"}>
            สินค้าในกล่องเลขที่ {selectedId}
          </Typography>
          <Box sx={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={productInPackaging}
              columns={productColumns}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 5,
                  },
                },
              }}
              pageSizeOptions={[5]}
              disableRowSelectionOnClick
            />
          </Box>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default PackingCases;
