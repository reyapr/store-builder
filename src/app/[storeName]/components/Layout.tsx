import { Navbar } from "@/app/[storeName]/components/Navbar";
import { Box } from "@chakra-ui/react";

interface LayoutProps {
  children: React.ReactNode;
  storeName: string;
}

export function Layout(props: LayoutProps) {
  return (
    <Box>
      <Navbar storeName={props.storeName}/>
      <Box>
        {props.children}
      </Box>
    </Box>
  )
}