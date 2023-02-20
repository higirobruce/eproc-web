import { ConfigProvider } from "antd";
import { useEffect } from "react";
import "../styles/globals.css";

export default function App({ Component, pageProps }) {
  useEffect(() => {
    // const link = document.createElement('link')
    // link.rel = 'stylesheet'
    // link.type = 'text/css'
    // link.href = '/static/css/my-styles.css'
    // document.head.appendChild(link)
  }, []);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#0063CF",
          fontFamily: 'Nunito'
        },
      }}
    >
      <Component {...pageProps} />
    </ConfigProvider>
  );
}
