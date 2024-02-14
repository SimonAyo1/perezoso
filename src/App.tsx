import { Outlet } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { LanguageProvider } from "./core/LanguageProvider";

import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/react";

import { WagmiConfig } from "wagmi";
import { bscTestnet } from "viem/chains";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const projectId = "a9e46291ea6bad69dc11e78dcefdab87";

  const metadata = {
    name: "Perezoso",
    description: "Perezoso Giveaway",
    url: "https://web3modal.com",
    icons: ["https://avatars.githubusercontent.com/u/37784886"],
  };

  const chains = [bscTestnet];
  const wagmiConfig = defaultWagmiConfig({
    chains,
    projectId,
    metadata,
  });

  createWeb3Modal({ wagmiConfig, projectId, chains });

  return (
    <WagmiConfig config={wagmiConfig}>
      <LanguageProvider>
        <Header />
        <Outlet />
        <Footer />
        <ToastContainer />
      </LanguageProvider>
    </WagmiConfig>
  );
}

export default App;
