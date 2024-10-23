import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WagmiConfig } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { wagmiConfig } from './config/wagmi';
import '@rainbow-me/rainbowkit/styles.css';

import Index from "./pages/Index";
import Deposit from "./pages/Deposit";
import Withdraw from "./pages/Withdraw";
import Send from "./pages/Send";
import Receive from "./pages/Receive";

const queryClient = new QueryClient();

const App = () => (
  <WagmiConfig config={wagmiConfig}>
    <RainbowKitProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/deposit" element={<Deposit />} />
              <Route path="/withdraw" element={<Withdraw />} />
              <Route path="/send" element={<Send />} />
              <Route path="/receive" element={<Receive />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </RainbowKitProvider>
  </WagmiConfig>
);

export default App;