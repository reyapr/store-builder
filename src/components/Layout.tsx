import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div>
      <Navbar/>
      <Sidebar>
        {children}
      </Sidebar>
    </div>
  )
}