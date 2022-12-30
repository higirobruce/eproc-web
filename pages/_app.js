import { useEffect } from 'react'
import '../styles/globals.css'

export default function App({ Component, pageProps }) {
  useEffect(() => {
    // const link = document.createElement('link')
    // link.rel = 'stylesheet'
    // link.type = 'text/css'
    // link.href = '/static/css/my-styles.css'
    // document.head.appendChild(link)
  }, [])



  return <Component {...pageProps} />
}
