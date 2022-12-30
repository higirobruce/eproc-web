import Head from "next/head";
import Image from "next/image";
import LoginForm from "../components/common/loginForm";
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

      <main className="flex space-x-10 bg-blue-500 items-center justify-center h-screen">
        <LoginForm />
        <div className="flex flex-col items-end">
          <Image alt="" src="/irembo-gov.svg" width={150} height={150} />
          <Image alt="" src="/business_deal.svg" width={500} height={500} />
        </div>
      </main>
    </>
  );
}
