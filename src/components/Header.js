import Image from 'next/image';
import stacks from '@/data/stacks.json';
import TopHeader from './TopHeader';

export default function Header({ logo, info }) {
  return (
    <>
      <TopHeader />
      <div className="header flex bg-slate-200 p-4 rounded-2xl">
        <div className="flex mr-4 justify-center items-center">
          <Image src={logo} width={200} height={200} alt="" />
        </div>

        <div className="flex font-bold text-sm">{info}</div>
      </div>
    </>
  );
}
