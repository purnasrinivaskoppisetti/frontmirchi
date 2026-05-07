'use client';

import { useEffect, useState } from 'react';
import { IoSearch, IoCallOutline } from 'react-icons/io5';
import { useCustomers } from '@/hook/useCustomers';

export default function Customers() {
  const {
    customers,
    loading,
    error,
    fetchCustomers,
  } = useCustomers();

  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSearch = (text) => {
    setSearch(text);

    if (text.trim() === '') {
      fetchCustomers();
    } else {
      fetchCustomers(text);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#eef2f5] flex justify-center items-center">
        <div className="w-8 h-8 border-[3px] border-gray-300 border-t-red-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#eef2f5] flex justify-center">

      {/* MOBILE TYPE WIDTH EVEN IN DESKTOP */}
      <div className="w-full max-w-[430px] px-3 py-3">

        {/* TITLE */}
        <h1 className="text-[20px] font-bold text-black">
          Customers
        </h1>

        <p className="text-gray-500 text-[14px] mb-3">
          Farmer & customer directory
        </p>

        {/* SEARCH */}
        <div className="bg-white rounded-xl px-4 py-3 flex items-center shadow-sm mb-3">
          <IoSearch className="text-gray-400 text-[18px]" />

          <input
            type="text"
            placeholder="Search by name or mobile..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="flex-1 ml-2 outline-none text-[14px] bg-transparent"
          />
        </div>

        {/* ERROR */}
        {error && (
          <p className="text-red-500 text-sm mb-3">
            {error}
          </p>
        )}

        {/* EMPTY */}
        {!loading && customers?.length === 0 && (
          <div className="bg-white rounded-2xl p-5 text-center">
            <p className="text-gray-500 text-sm">
              No customers found
            </p>
          </div>
        )}

        {/* CUSTOMER CARDS */}
        <div>
          {customers?.map((item) => (
            <div
              key={item.customer_id}
              className="bg-white rounded-2xl p-[14px] mb-3 shadow-sm"
            >

              {/* TOP */}
              <div className="flex items-center mb-3">

                {/* AVATAR */}
                <div className="w-[45px] h-[45px] rounded-full bg-red-500 flex items-center justify-center mr-3 shrink-0">
                  <span className="text-white font-bold text-[16px] uppercase">
                    {item.name?.charAt(0)}
                  </span>
                </div>

                {/* INFO */}
                <div className="flex-1">
                  <p className="font-bold text-[16px] text-black">
                    {item.name}
                  </p>

                  <div className="flex items-center mt-1">
                    <IoCallOutline className="text-gray-400 text-[13px]" />

                    <span className="text-[12px] text-gray-500 ml-1">
                      {item.mobile}
                    </span>
                  </div>
                </div>

              </div>

              {/* STATS */}
              <div className="flex gap-2">

                {/* ORDERS */}
                <StatBox
                  label="Orders"
                  value={item.total_orders}
                />

                {/* TOTAL */}
                <StatBox
                  label="Total"
                  value={`₹${item.total_amount}`}
                />

                {/* PENDING */}
                <StatBox
                  label="Pending"
                  value={`₹${item.pending_amount}`}
                  highlight={item.pending_amount > 0}
                />

              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

/* STAT BOX */
const StatBox = ({ label, value, highlight }) => {
  return (
    <div className="flex-1 bg-slate-100 rounded-xl py-3 px-2 text-center">

      <p className="font-bold text-[14px] text-black">
        {value}
      </p>

      <p
        className={`text-[12px] mt-1 ${
          highlight
            ? 'text-red-500 font-bold'
            : 'text-gray-500'
        }`}
      >
        {label}
      </p>

    </div>
  );
};