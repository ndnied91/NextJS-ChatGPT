import Link from 'next/link';
import Image from 'next/image';
import stacks from '@/data/stacks.json';

export default function App() {
  const renderStacks = () => {
    return Object.keys(stacks).map((stackKey) => {
      const stack = stacks[stackKey];
      return (
        <div className={`cat w-40 h-40 relative opacity`} key={stack.href}>
          <Link key={stack.href} href={stack.href}>
            <Image src={stack.logo} className="object-cover p-1" fill alt="" />
            <div className="name"> {stack.name} </div>
          </Link>
        </div>
      );
    });
  };

  return (
    <h1 className="h-full flex justify-center items-center flex-col">
      <div className="title"> Who would you like to ask some questions? </div>
      <div className="flex">{renderStacks()}</div>
    </h1>
  );
}
