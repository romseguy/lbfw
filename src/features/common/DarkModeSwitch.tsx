import {
  IconButton,
  IconButtonProps,
  useColorMode,
  useColorModeValue
} from "@chakra-ui/react";
import { FaSun, FaMoon } from "react-icons/fa";

export function DarkModeSwitch({ ...props }: IconButtonProps) {
  const { toggleColorMode } = useColorMode();
  return (
    <IconButton
      variant="solid"
      icon={useColorModeValue(<FaMoon />, <FaSun />)}
      onClick={toggleColorMode}
      {...props}
    />
  );
}
