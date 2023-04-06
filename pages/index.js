import { Typography } from "antd";
import Head from "next/head";
import Image from "next/image";
import LoginForm from "../components/common/loginForm";
import LoginText from "../components/common/loginText";

/**
 * Renders the procurement tool home page. This is the top level page that shows all the information about the procurement tool.
 *
 *
 * @return { JSX } The HTML to render on the home page. Note that the content depends on the JSX version
 */
export default function Home() {
  return (
    <>
      <Head>
        <title>EPROC</title>
        <meta name="description" content="the #1 e-procurement tool" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <main className="grid md:grid-cols-3 bg-blue-500 w-screen text-white">
      <LoginText />
        <div>
          {" "}
          <LoginForm />
        </div>
      </main>
    </>
  );
}
