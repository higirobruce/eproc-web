import { Button, Layout, Typography } from "antd";
import Head from "next/head";
import Image from "next/image";
import Router from "next/router";
import React from "react";

export default function PublicPortal() {
  return (
    <>
      <Head>
        <title>EPROC</title>
        <meta name="description" content="the #1 e-procurement tool" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <main className="bg-white flex flex-col h-screen">
        {/* header */}
        <Layout className="p-5 bg-white">
          <div className="flex flex-row justify-between items-center">
            <div>
              <Image
                src="/favicon.png"
                className="text-blue-500"
                width={40}
                height={40}
              />
            </div>
            <div className="flex flex-row space-x-10 items-center">
              <div className="hover:text-blue-500 hover:underline cursor-pointer">
                About Us
              </div>
              <div className="hover:text-blue-500 hover:underline cursor-pointer">
                Resources
              </div>
              <Button type="primary" onClick={() => Router.push("/")}>SIGN IN</Button>
            </div>
          </div>

          <div className="grid grid-cols-2 flex-1 p-52">
            {/* Body */}
            <div className="flex flex-col justify-center">
                
              <Typography.Title level={2}>
                Become a Irembo sourcing partner
              </Typography.Title>

              <div>
                <Button type="primary" onClick={() => Router.push("/")}>SIGN IN</Button>
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <Image src='/Business deal-cuate.svg' width={600} height={600}/>
            </div>
          </div>
        </Layout>
      </main>
    </>
  );
}
