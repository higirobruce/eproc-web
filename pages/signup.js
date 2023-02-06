import Head from "next/head";
import Image from "next/image";
import Router from "next/router";
import SignupForm from "../components/common/signupForm";

export default function Home() {
  return (
    <>
      <Head>
        <title>EPROC</title>
        <meta name="description" content="the #1 e-procurement tool" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <main className="flex space-x-10 bg-blue-500 items-center justify-center">
        <div className="flex flex-col">
          <Image alt="" src="/irembo-gov.svg" className="cursor-pointer" width={150} height={150} onClick={()=>Router.push('/')}/>
          <Image alt="" src="/add_information.svg" width={800} height={800} />
        </div>
        <SignupForm />
      </main>
    </>
  );
}
