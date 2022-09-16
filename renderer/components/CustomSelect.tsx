import {
  ClickAwayListener,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper,
} from "@mui/material";
import { Dispatch, SetStateAction, useRef, useState } from "react";

interface Props {
  children: ({
    ref,
    setIsOpen,
  }: {
    ref: any | null;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
  }) => JSX.Element;

  items: any[];
  onChange: (item: any, index: number) => void;
  isSelected: (item: any, index: number) => boolean;
}

function CustomSelect({ children, items, onChange, isSelected }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<any | null>(null);
  const handleSave = (item: any, index: number) => {
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
