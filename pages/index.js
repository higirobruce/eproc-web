import { Typography } from "antd";
import Head from "next/head";
import Image from "next/image";
import LoginForm from "../components/common/loginForm";
import SignupForm from "../components/common/signupForm";

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

      <main className="grid md:grid-cols-3 bg-blue-500 w-screen h-screen text-white">
        <div className="col-span-2 hidden md:flex flex-col px-10 items-start justify-center">
          {/* <Image alt="" src="/irembo-gov.svg" width={150} height={150} /> */}
          <Typography.Title level={3}>
            <div className="text-white">Welcome to Irembo Procure</div>
          </Typography.Title>
          <Typography.Title level={1}>
            <div className="text-white font-bold">Best and Easiest way to be a Sourcing Partner with Irembo.</div>
          </Typography.Title>
          <Typography.Text>
            <div className="text-white">Procurex helps in detaios and jooeprok oj akjjsjdsk lk lkas lllksd. Oooisdl kjdfj</div>
          </Typography.Text>
          {/* <Image alt="" src="/login.svg" width={500} height={500} /> */}
        </div>
        <div>
          {" "}
          <LoginForm />
        </div>
      </main>
    </>
  );
}
