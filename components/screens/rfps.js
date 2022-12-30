import Image from 'next/image';
import React, { useState } from 'react'

export default function RequestToVendors() {
  const [dataLoaded, setDataLoaded] = useState(false);
  return (
    <>
      {dataLoaded ? (
        <div>Data</div>
      ) : (
        <div className="flex items-center justify-center h-screen">
          <Image alt='' src='/searching.svg' width={600} height={600}/>
        </div>
      )}
    </>
  );
}
