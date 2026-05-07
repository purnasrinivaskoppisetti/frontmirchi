'use client';

import { useEffect, useState } from 'react';
import {
  IoSearch,
  IoTrashOutline,
  IoEyeOutline,
  IoCardOutline,
  IoClose,
} from 'react-icons/io5';

import { useAuth } from '@/hook/useAuth';
import PurchaseDetailsModal from '@/components/PurchaseDetailsModal';
export default function History() {
  const [viewModal, setViewModal] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const [amount, setAmount] = useState('');
  const [mode, setMode] = useState('cash');

  const [deleting, setDeleting] = useState(false);

  const { getToken } = useAuth();
  const [selectedId, setSelectedId] = useState(null);
  const [loadingPay, setLoadingPay] = useState(false);
  const BASE_URL = `${process.env.NEXT_PUBLIC_BASE_URL}api/purchases/`;

  /* ================= FETCH ================= */
  const handleSubmitPayment = async () => {
  try {
    setLoadingPay(true);

    const token = getToken();

    await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}api/purchases/${selectedId}/payment`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount_paid: Number(amount),
          payment_mode: mode,
          remarks: '',
        }),
      }
    );

    setShowPaymentModal(false);

    setAmount('');

    fetchHistory(search);

  } catch (e) {
    console.log(e);
  } finally {
    setLoadingPay(false);
  }
};
  const handleView = async (id) => {
    try {
      setViewLoading(true);

      const token = getToken();

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}api/purchases/${id}`,
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (data.success) {
        setViewData(data.data);
        setViewModal(true);
      }

    } catch (e) {
      console.log('VIEW ERROR', e);
    } finally {
      setViewLoading(false);
    }
  };
  const fetchHistory = async (query = '') => {
    try {
      setLoading(true);

      const token = getToken();

      if (!token) return;

      let url = BASE_URL;

      if (query && query.trim() !== '') {
        url += `?search=${query}`;
      }

      const res = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        setHistory(data.data || []);
      }
    } catch (error) {
      console.log('FETCH ERROR:', error);
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE ================= */
  const openDeleteModal = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const deletePurchase = async () => {
    try {
      if (!deleteId) return;

      setDeleting(true);

      const token = getToken();

      if (!token) return;

      const res = await fetch(`${BASE_URL}${deleteId}`, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        setHistory((prev) =>
          prev.filter(
            (item) => (item.id || item.purchase_id) !== deleteId
          )
        );
      }

      setShowDeleteModal(false);
      setDeleteId(null);

    } catch (error) {
      console.log('DELETE ERROR:', error);
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="min-h-screen m-auto bg-[#eeeeee]">

      <div className="max-w-7xl lg:w-[80%]  mx-auto px-3 sm:px-5 lg:px-6 py-4">

        {/* TITLE */}
        <h1 className="text-[22px] font-bold text-black">
          Purchase History
        </h1>

        <p className="text-[14px] text-gray-500 mb-4">
          All purchase records
        </p>

        {/* SEARCH */}
        <div className="bg-white rounded-xl px-4 py-3 flex items-center shadow-sm mb-4">
          <IoSearch className="text-gray-400 text-[18px]" />

          <input
            type="text"
            placeholder="Search by name, crop..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              fetchHistory(e.target.value);
            }}
            className="flex-1 ml-2 outline-none text-[14px] bg-transparent"
          />
        </div>

        {/* LOADING */}
        {loading && (
          <div className="flex justify-center py-10">
            <div className="w-8 h-8 border-[3px] border-gray-300 border-t-red-500 rounded-full animate-spin"></div>
          </div>
        )}

        {/* EMPTY */}
        {!loading && history.length === 0 && (
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
            <p className="text-gray-500 text-sm">
              No purchase history found
            </p>
          </div>
        )}

        {/* CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

          {history.map((item) => (

            <div
              key={item.id || item.purchase_id}
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition"
            >

              {/* TOP ROW */}
              <div className="flex justify-between items-start gap-3">

                {/* LEFT */}
                <div className="flex-1 min-w-0">

                  <p className="font-bold text-[16px] text-black truncate">
                    {item.customer}
                  </p>

                  {/* TAGS */}
                  <div className="flex items-center gap-2 mt-2 flex-wrap">

                    <div className="bg-gray-200 px-2 py-[3px] rounded-md text-[12px] text-gray-700">
                      {item.crop}
                    </div>

                    <div
                      className={`px-2 py-[3px] rounded-md text-white text-[11px] capitalize ${item.status === 'pending'
                        ? 'bg-red-500'
                        : 'bg-orange-400'
                        }`}
                    >
                      {item.status}
                    </div>

                  </div>

                </div>

                {/* RIGHT */}
                <div className="flex flex-col items-end">

                  <p className="text-red-500 font-bold text-[16px]">
                    ₹{item.total}
                  </p>

                  <div className="flex items-center gap-2 mt-2">

                    {/* VIEW */}
                    <button
                      onClick={() =>
                        handleView(item.id || item.purchase_id)
                      }
                      className="bg-slate-100 hover:bg-slate-200 transition p-2 rounded-lg"
                    >
                      <IoEyeOutline className="text-blue-600 text-[18px]" />
                    </button>

                    {/* DELETE */}
                    <button
                      onClick={() =>
                        openDeleteModal(item.id || item.purchase_id)
                      }
                      className="bg-slate-100 hover:bg-red-100 transition p-2 rounded-lg"
                    >
                      <IoTrashOutline className="text-red-500 text-[18px]" />
                    </button>

                  </div>

                </div>

              </div>

              {/* INFO */}
              <div className="mt-4">

                <p className="text-[12px] text-gray-500">
                  {item.date} · {item.net_weight}kg · {item.bags} bags
                </p>

                <p className="text-[12px] text-gray-500 mt-1">
                  Paid: ₹{item.paid} | Pending: ₹{item.pending}
                </p>

              </div>

              {/* PAY BUTTON */}
              {item.pending > 0 && (
                <div className="flex justify-end mt-4">

                  <button
                    onClick={() => {
                      setSelectedId(item.id || item.purchase_id);
                      setAmount(String(item.pending));
                      setMode('cash');
                      setShowPaymentModal(true);
                    }}
                    className="bg-green-600 hover:bg-green-700 transition rounded-xl px-4 py-2 flex items-center"
                  >
                    <IoCardOutline className="text-white text-[16px]" />

                    <span className="text-white text-[13px] font-semibold ml-2">
                      Pay ₹{item.pending}
                    </span>

                  </button>

                </div>
              )}

            </div>
          ))}

        </div>

      </div>

      {/* DELETE MODAL */}
      <PurchaseDetailsModal visible={viewModal} onClose={() => setViewModal(false)} data={viewData} />
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">

          <div className="bg-white rounded-2xl p-5 w-full max-w-[340px]">

            <h2 className="text-[17px] font-bold text-black mb-2">
              Delete Purchase
            </h2>

            <p className="text-[14px] text-gray-500 mb-5">
              Are you sure you want to delete?
            </p>

            <div className="flex justify-end gap-2">

              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-xl bg-gray-200 text-gray-700"
              >
                Cancel
              </button>

              <button
                onClick={deletePurchase}
                className="px-4 py-2 rounded-xl bg-red-500 text-white min-w-[80px]"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>

            </div>

          </div>

        </div>
      )}

      {/* PAYMENT MODAL */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">

          <div className="bg-white rounded-2xl p-5 w-full max-w-[340px]">

            {/* TOP */}
            <div className="flex items-center justify-between mb-4">

              <h2 className="text-[17px] font-bold text-black">
                Add Payment
              </h2>

              <button onClick={() => setShowPaymentModal(false)}>
                <IoClose className="text-[22px] text-gray-500" />
              </button>

            </div>

            {/* AMOUNT */}
            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-slate-100 rounded-xl px-4 py-3 outline-none mb-3"
            />

            {/* MODE */}
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="w-full bg-slate-100 rounded-xl px-4 py-3 outline-none mb-4"
            >
              <option value="cash">Cash</option>
              <option value="upi">UPI</option>
              <option value="bank">Bank</option>
              <option value="other">Other</option>
            </select>

            {/* BUTTONS */}
            <div className="flex justify-end gap-2">

              <button
                onClick={() => setShowPaymentModal(false)}
                className="px-4 py-2 rounded-xl bg-gray-200 text-gray-700"
              >
                Cancel
              </button>

              <button
  onClick={handleSubmitPayment}
  className="px-4 py-2 rounded-xl bg-green-600 text-white min-w-[100px] flex items-center justify-center"
>

  {loadingPay ? (

    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>

  ) : (

    'Submit'

  )}

</button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}