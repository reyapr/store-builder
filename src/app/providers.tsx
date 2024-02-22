import { ChakraBaseProvider } from "@chakra-ui/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ChakraBaseProvider>
      {children}
    </ChakraBaseProvider>
  )
}