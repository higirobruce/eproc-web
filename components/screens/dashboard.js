import Image from "next/image";
import React, { useState } from "react";

export default function Dashboard() {
  const [dataLoaded, setDataLoaded] = useState(false);
  return (
    <>
      {dataLoaded ? (
        <div>Data</div>
      ) : (
        <div className="flex items-center justify-center flex-1 overflow-x-scroll">
          <Image alt="" src='/dashboard_loading.gif' width={800} height={800}/>
        </div>
      )}
    </>
  );
}
