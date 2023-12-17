import "../styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import { ParallaxProvider } from "react-scroll-parallax";
import { ToastContainer, toast } from "react-toastify";
import { Web3Layout } from "../components/Web3Layout";

function MyApp({ Component, pageProps }) {
  return (
    <ParallaxProvider>
      <Web3Layout>
        <Component {...pageProps} />
        <ToastContainer />
      </Web3Layout>
    </ParallaxProvider>
  );
}

export default MyApp;
