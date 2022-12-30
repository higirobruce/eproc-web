import Image from 'next/image';
import React, { useState } from 'react'

export default function PurchaseOrders() {
  const [dataLoaded, setDataLoaded] = useState(false);
  return (
    <>
      {dataLoaded ? (
        <div>Data</div>
      ) : (
        <div className="flex items-center justify-center h-screen">
          <Image alt='' src='/web_search.svg' width={800} height={800}/>
        </div>
      )}
    </>
  );
}
