import { Typography } from "antd";
import Image from "next/image";
import React from "react";

export default function LoginText() {
  return (
    <div className="col-span-2 hidden md:flex flex-col px-10 items-center justify-center">
      <div className="opacity-80">
        <Image alt="" src="/login.svg" width={400} height={400} />
      </div>
      <Typography.Title level={2}>
        <div className="text-white">Welcome to Irembo Procure</div>
      </Typography.Title>
      <div className="text-white font-mono text-sm">
        A tool that aims to simplify the procurement process for suppliers
        looking to work with Irembo.
      </div>
      {/* <Image alt="" src="/icons/white icon.png" width={236} height={220} /> */}
      <div className="">
        <div className="self-center flex flex-col"></div>
      </div>
    </div>
  );
}
