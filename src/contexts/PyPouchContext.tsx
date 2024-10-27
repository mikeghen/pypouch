import { createContext, useContext, ReactNode, useState } from 'react';

interface PyPouchContextType {
  pyPouchAddress: `0x${string}` | null;
  setPyPouchAddress: (address: `0x${string}` | null) => void;
}

const PyPouchContext = createContext<PyPouchContextType | undefined>(undefined);

export const PyPouchProvider = ({ children }: { children: ReactNode }) => {
  const [pyPouchAddress, setPyPouchAddress] = useState<`0x${string}` | null>(null);

  return (
    <PyPouchContext.Provider value={{ pyPouchAddress, setPyPouchAddress }}>
      {children}
    </PyPouchContext.Provider>
  );
};

export const usePyPouch = () => {
  const context = useContext(PyPouchContext);
  console.log('PyPouch context:', context);
  if (context === undefined) {
    throw new Error('usePyPouch must be used within a PyPouchProvider');
  }
  return context;
};
