'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  IoHome,
  IoAddCircle,
  IoTime,
  IoPeople,
} from 'react-icons/io5';

export default function Footer() {
  const pathname = usePathname();

  const tabs = [
    {
      name: 'Home',
      path: '/dashboard',
      icon: IoHome,
    },
    {
      name: 'New',
      path: '/new-purchase',
      icon: IoAddCircle,
    },
    {
      name: 'History',
      path: '/history',
      icon: IoTime,
    },
    {
      name: 'Customers',
      path: '/customers',
      icon: IoPeople,
    },
  ];

  return (
    <div className=" bottom-0 left-0 right-0 bg-[#111] border-t border-gray-800 z-50">

      <div className="max-w-md mx-auto flex items-center justify-around py-2">

        {tabs.map((tab, i) => {
          const Icon = tab.icon;

          const isActive =
            pathname === tab.path ||
            pathname.startsWith(tab.path);

          return (
            <Link
              key={i}
              href={tab.path}
              className="flex flex-col items-center justify-center min-w-[70px]"
            >

              <Icon
                size={22}
                className={
                  isActive
                    ? 'text-[#ffcc00]'
                    : 'text-[#aaa]'
                }
              />

              <span
                className={`text-[11px] mt-1 ${
                  isActive
                    ? 'text-[#ffcc00]'
                    : 'text-[#aaa]'
                }`}
              >
                {tab.name}
              </span>

            </Link>
          );
        })}

      </div>

    </div>
  );
}