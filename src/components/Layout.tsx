import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { ChakraProvider } from "@chakra-ui/react";
import { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <ChakraProvider>
      <Navbar/>
      <Sidebar>
        {children}
      </Sidebar>
    </ChakraProvider>
  )
}