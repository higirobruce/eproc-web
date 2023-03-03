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
        <div className="col-span-2 hidden md:flex flex-col px-10 pt-10 items-start">
          <Image alt="" src="/icons/white icon.png" width={150} height={135}/>
          <div className="grid grid-cols-2 content-center">
            
            <div className="self-center">
              <Typography.Title level={2}>
                <div className="text-white">Welcome to</div>
              </Typography.Title>
              <Typography.Title level={1}>
                <div className="text-white">Irembo Procure</div>
              </Typography.Title>
              <Typography.Title level={4}>
                <div className="text-white font-bold">
                A tool that aims to simplify the procurement process for suppliers looking to work with Irembo.
                </div>
              </Typography.Title>
             
            </div>

            <Image
              alt=""
              src="/login.svg"
              width={500}
              height={500}
              className=""
            />
          </div>
        </div>
        <div>
          {" "}
          <LoginForm />
        </div>
      </main>
    </>
  );
}
