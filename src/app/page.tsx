import React from 'react';
import dynamic from 'next/dynamic';

const FarmaciInterface = dynamic(() => import('../components/pharmspot-interface'), { ssr: false });

export default function Home() {
  return <FarmaciInterface />;
}