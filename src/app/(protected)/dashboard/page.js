'use client';

import { useEffect } from 'react';
import { useDashboard } from '@/hook/useDashboard';

export default function Home() {
  const { data, loading, error, fetchDashboard } =
    useDashboard();

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen justify-center items-center bg-[#eee]">
        <p className="text-lg font-semibold">
          Loading...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex  justify-center items-center bg-[#eee]">
        <p className="text-red-500">
          {error}
        </p>
      </div>
    );
  }

  const today = data?.today || {};

  return (
    <div className="min-h-screen  bg-[#eee] pb-[90px]">

      <div className="max-w-7xl mx-auto lg:w-[80%] lg:m-auto  px-3 sm:px-5 lg:px-6 py-3">

        {/* TITLE */}
        <h1 className="text-[22px] font-bold mb-4">
          Dashboard
        </h1>

        {/* TOP CARDS */}
        <div
          className="
            grid
            grid-cols-2
            md:grid-cols-2
            xl:grid-cols-4
            gap-3
          "
        >

          <Card
            title="Today's Purchases"
            value={today?.total_purchases}
          />

          <Card
            title="Total Weight"
            value={`${today?.total_weight_kg} kg`}
          />

          <Card
            title="Total Spent"
            value={`₹${today?.total_spent}`}
          />

          <Card
            title="Pending"
            value={today?.pending_payments}
          />

        </div>

        {/* SECTION */}
        <div className="flex items-center justify-between mt-6 mb-3">

          <h2 className="text-[16px] font-bold">
            Recent Transactions
          </h2>

        </div>

        {/* TRANSACTIONS */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">

          {data?.recent_transactions?.map(
            (item, index) => (
              <div
                key={index}
                className="
                  flex
                  justify-between
                  items-center
                  bg-white
                  p-4
                  rounded-2xl
                  shadow-sm
                  border
                  border-gray-100
                "
              >

                {/* LEFT */}
                <div className="min-w-0">

                  <p className="font-bold text-[15px] truncate">
                    {item.customer_name}
                  </p>

                  <p className="text-[12px] text-[#666] mt-1">
                    {item.label}
                  </p>

                </div>

                {/* RIGHT */}
                <div className="flex flex-col items-end ml-3">

                  <p className="font-bold text-[15px]">
                    ₹{item.amount}
                  </p>

                  <p
                    className={`
                      text-[10px]
                      px-[8px]
                      py-[3px]
                      rounded-full
                      mt-1
                      text-white
                      capitalize
                      ${
                        item.status === 'pending'
                          ? 'bg-red-400'
                          : 'bg-orange-400'
                      }
                    `}
                  >
                    {item.status}
                  </p>

                </div>

              </div>
            )
          )}

        </div>

      </div>

    </div>
  );
}

/* CARD COMPONENT */
const Card = ({ title, value }) => {
  return (
    <div
      className="
        bg-white
        p-4
        rounded-2xl
        shadow-sm
        border
        border-gray-100
      "
    >

      <p className="text-[12px] text-[#666]">
        {title}
      </p>

      <p className="text-[18px] font-bold mt-[8px] break-words">
        {value}
      </p>

    </div>
  );
};