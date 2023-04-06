import { Typography } from "antd";
import Image from "next/image";
import React from "react";

export default function LoginText() {
  return (
    <div className="col-span-2 hidden md:flex flex-col px-10 pt-10 items-start">
      <Image alt="" src="/icons/white icon.png" width={236} height={220} />
      <div className="grid grid-cols-2 px-10 content-center">
        <div className="self-center flex flex-col">
          {/* <Typography.Title level={2}>
            <p className="text-white">Welcome</p>
          </Typography.Title> */}
          <Typography.Title level={1}>
            Irembo Procure
          </Typography.Title>
          <div className="text-white font-mono text-sm">
            A tool that aims to simplify the procurement process for suppliers
            looking to work with Irembo.
          </div>
        </div>

        <div className="opacity-80 absolute left-1/3 w-96 h-96">
          <Image alt="" src="/login.svg" fill />
        </div>
      </div>
    </div>
  );
}
