import {
  Button,
  Popper,
  Grow,
  Paper,
  ClickAwayListener,
  MenuList,
  MenuItem,
  FormControl,
  TextField,
} from "@mui/material";
import { useRef, useState } from "react";

function CustomSelect({ children, items, onChange, isSelected }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);
  const handleSave = (item, index) => {
    setIsOpen(false);
    onChange(item, index);
  };

  const parent = children({ ref, setIsOpen });
  return (
    <>
      {parent}
      <Popper
        open={isOpen}
        disablePortal
        transition
        anchorEl={ref.current}
        sx={{ zIndex: 10000 }}
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom" ? "center top" : "center bottom",
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={() => setIsOpen(false)}>
                <MenuList>
                  {items?.map((item, index) => (
                    <MenuItem
                      selected={
                        false || (isSelected && isSelected(item, index))
                      }
                      onClick={() => handleSave(item, index)}
                    >
                      {item}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
}

export default CustomSelect;
