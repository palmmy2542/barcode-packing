import { Box, Button, TextField, Typography } from "@mui/material";
import { usePacking } from "../../contexts/PackingProvider";
import { useNavigate } from "react-router-dom";

const Scanning = () => {
  const { findPackagingById, findPaletteById } = usePacking();
  const navigate = useNavigate();

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const id = event.target?.id.value;

    if (id) {
      const packaging = findPackagingById(id);
      if (packaging) {
        navigate(`/product-packing/${id}`);
      } else {
        const palette = findPaletteById(id);
        if (palette) {
          console.log(palette);
        } else {
          alert(`ไม่พบรหัสกล่องหรือพาเลส เลขที่ ${id}`);
        }
      }
    }
  };
  return (
    <Box>
      <Typography variant="h5">ระบุรหัสกล่องหรือพาเลส</Typography>
      <form onSubmit={onSubmit}>
        <Box display={"flex"} gap={2}>
          <TextField name="id" fullWidth />
          <Button variant="contained" type="submit">
            ค้นหา
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default Scanning;
