import { Navbar } from "@/app/s/[storeName]/components/Navbar";
import { Box } from "@chakra-ui/react";

interface LayoutProps {
  children: React.ReactNode;
  storeName: string;
  home: boolean;
}

export function Layout(props: LayoutProps) {
  return (
    <Box>
      <Navbar storeName={props.storeName} home={props.home}/>
      <Box>
        {props.children}
      </Box>
    </Box>
  )
}