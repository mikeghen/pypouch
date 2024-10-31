import { PiggyBankIcon } from "lucide-react";
import { WalletConnect } from "@/components/WalletConnect";

export const Header = () => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <PiggyBankIcon className="h-6 w-6 text-primary" />
        <span className="text-xl font-bold text-primary">PyPouch</span>
      </div>
      <WalletConnect />
    </div>
  );
};
