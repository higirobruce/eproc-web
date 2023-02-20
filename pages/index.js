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

      <main className="grid md:grid-cols-2 bg-blue-500 w-screen h-screen">
        <div className="hidden md:flex flex-col px-10 items-center justify-center">
          <Image alt="" src="/irembo-gov.svg" width={150} height={150} />
          <Image alt="" src="/login.svg" width={500} height={500} />
        </div>
       <div> <LoginForm /></div>
      </main>
    </>
  );
}
