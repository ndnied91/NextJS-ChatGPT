import Link from 'next/link';
import Image from 'next/image';
import stacks from '@/data/stacks.json';

export default function TopHeader() {
  const renderStacks = () => {
    return Object.keys(stacks).map((stackKey) => {
      const stack = stacks[stackKey];
      return (
        <Link
          key={stack.href}
          href={stack.href}
          className={`${stack.hoverClass} w-20 h-20 relative border-2 m-2 rounded-xl`}
        >
          <Image src={stack.logo} className="object-cover p-2" fill alt="" />
        </Link>
      );
    });
  };

  return (
    <h1 className="flex justify-center items-center ">
      <div> Learn about a different topic </div>

      <div className="flex">{renderStacks()}</div>
    </h1>
  );
}
