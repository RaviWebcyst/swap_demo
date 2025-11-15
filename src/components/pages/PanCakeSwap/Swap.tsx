import { Outlet } from "react-router-dom";
import "./Swap.scss";
import { useState } from "react";
import Header from "../../common/Header/Header";
import { wagmiAdapter } from "../../../utils/constants";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from 'wagmi'




const Swap = () => {
  const queryClient = new QueryClient()
  // console.log('Dex');
  // const [show, setShow] = useState(false);
  // const [data, setData] = useState({});
  const [active, setActive] = useState<boolean | any>(false);
  const handleActive = () =>
    document.body.clientWidth < 1199 && setActive(!active);



  return (
         <WagmiProvider config={wagmiAdapter.wagmiConfig}>
        <QueryClientProvider client={queryClient}>
  
    <div className="bg-color">
      <section className="swapPage ">
        <Header handleActive={handleActive} active={active} />
        <Outlet />
      </section>
      </div>
    
        </QueryClientProvider></WagmiProvider>
  );
};

export default Swap;
