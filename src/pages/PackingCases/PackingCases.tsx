import { Box, Button, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useMemo, useState } from "react";
import { usePacking } from "../../contexts/PackingProvider";
import { PACKED_STATUS } from "../../contexts/PackingProvider/types";
import { columns as productColumns } from "../Products/utils";
import { columns as packingCaseColumns } from "./utils";
import { addPackaging } from "../../firebase";
import { toast } from "react-toastify";

const PackingCases = () => {
  const { getAllPackagings, packagings, findPackagingById } = usePacking();
  const [selectedId, setSelectedId] = useState<string>("");

  const handleAddPackaging = async () => {
    try {
      const packaging = await addPackaging({
        ...{
          createdAt: new Date(),
          updatedAt: new Date(),
          status: PACKED_STATUS.PENDING,
        },
      });
      if (packaging) {
        await getAllPackagings();
        toast.success("เพิ่มข้อมูลสำเร็จ");
      } else {
        throw new Error("ไม่สามารถเพิ่มข้อมูลได้");
      }
    } catch (err) {
      console.log(err);
      toast.error("ไม่สามารถเพิ่มข้อมูลได้");
    }
  };

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
      <Box display={"flex"} gap={2} my={2}>
        <Button variant="contained" onClick={handleAddPackaging}>
          เพิ่มกล่อง
        </Button>
      </Box>
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
            sorting: {
              sortModel: [{ field: "updatedAt", sort: "desc" }],
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
                sorting: {
                  sortModel: [{ field: "updatedAt", sort: "desc" }],
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
