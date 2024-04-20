import { Close } from "@mui/icons-material";
import {
  Dialog as MUIDialog,
  DialogTitle,
  IconButton,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

export type DialogProps = {
  title: string;
  content: string;
  open: boolean;
  handleClose: () => void;
  handleSubmit: () => void;
};

const Dialog = ({
  title,
  content,
  open,
  handleClose,
  handleSubmit,
}: DialogProps) => {
  return (
    <MUIDialog open={open} onClose={handleClose}>
      <DialogTitle>
        {title}
        <IconButton
          onClick={handleClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>{content}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>ยกเลิก</Button>
        <Button variant="contained" onClick={handleSubmit}>
          ยืนยัน
        </Button>
      </DialogActions>
    </MUIDialog>
  );
};

export default Dialog;
