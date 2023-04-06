import { ConfigProvider } from "antd";
import 'antd/dist/reset.css'
import { useEffect } from "react";
import "../styles/globals.css";
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

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
          fontFamily: 'Lota'
        },
      }}
    >
      <Component {...pageProps} />
    </ConfigProvider>
  );
}
