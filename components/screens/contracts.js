import Image from 'next/image';
import React, { useState } from 'react'

export default function Contracts({user}) {
  const [dataLoaded, setDataLoaded] = useState(false);
  return (
    <>
      {dataLoaded ? (
        <div>Data</div>
      ) : (
        <div className="flex items-center justify-center h-screen flex-1">
          <Image alt='' src='/contracts_searching.gif' width={600} height={600}/>
        </div>
      )}
    </>
  );
}
