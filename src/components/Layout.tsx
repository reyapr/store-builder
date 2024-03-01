import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { ChakraProvider } from "@chakra-ui/react";
import { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <Navbar/>
      <Sidebar>
        {children}
      </Sidebar>
    </>
  )
}