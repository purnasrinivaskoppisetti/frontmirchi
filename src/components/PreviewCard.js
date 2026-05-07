'use client';

export default function PreviewCard({ data }) {
  if (!data) return null;

  const thokuduKuli = (data.bags?.length || 0) * 40;

  return (
    <div className="bg-white rounded-[18px] p-[14px] my-[10px] shadow-sm">

      {/* HEADER */}
      <div className="border-b border-[#eee] pb-2 mb-3">

        <h2 className="text-[18px] font-bold text-[#b91c1c]">
          Jai Sri Ram
        </h2>

        <p className="text-[12px] text-[#6b7280]">
          {data.purchase_date}
        </p>

      </div>

      {/* CUSTOMER */}
      <div className="flex justify-between mb-3 gap-3">

        <div>

          <p className="text-[16px] font-semibold">
            {data.customer?.name || '-'}
          </p>

          <p className="text-[12px] text-[#6b7280]">
            📞 {data.customer?.mobile || '-'}
          </p>

        </div>

        <div className="bg-[#fde68a] px-3 py-1 rounded-[10px] h-fit">

          <p className="text-[12px] text-[#92400e] font-semibold">
            {data.status || 'Pending'}
          </p>

        </div>

      </div>

      {/* GRID */}
      <div className="grid grid-cols-2 gap-y-3 mb-3">

        <div>
          <p className="text-[11px] text-[#6b7280]">
            Crop
          </p>

          <p className="text-[14px] font-semibold">
            {data.purchase?.crop}
          </p>
        </div>

        <div>
          <p className="text-[11px] text-[#6b7280]">
            Type
          </p>

          <p className="text-[14px] font-semibold">
            {data.purchase?.type}
          </p>
        </div>

        <div>
          <p className="text-[11px] text-[#6b7280]">
            Price/Kg
          </p>

          <p className="text-[14px] font-semibold">
            ₹{data.purchase?.price_per_kg}
          </p>
        </div>

        <div>
          <p className="text-[11px] text-[#6b7280]">
            Bags
          </p>

          <p className="text-[14px] font-semibold">
            {data.bags?.length}
          </p>
        </div>

      </div>

      {/* TOTAL */}
      <div className="bg-[#b91c1c] p-3 rounded-[14px] my-3">

        <p className="text-white text-[12px]">
          Total Amount
        </p>

        <p className="text-white text-[20px] font-bold">
          ₹{data.totals?.total_amount}
        </p>

        <p className="text-white text-[12px] mt-1">
          Thokudu Kuli: ₹{thokuduKuli} ({data.bags?.length} × 40)
        </p>

      </div>

      {/* PAYMENT */}
      <div className="flex justify-between gap-3 mb-3">

        <div className="bg-[#dcfce7] p-3 rounded-[12px] w-[48%]">

          <p className="text-[12px] text-[#6b7280]">
            Paid
          </p>

          <p className="text-[#166534] font-bold text-[16px]">
            ₹{data.payment?.paid_amount}
          </p>

        </div>

        <div className="bg-[#fef3c7] p-3 rounded-[12px] w-[48%]">

          <p className="text-[12px] text-[#6b7280]">
            Pending
          </p>

          <p className="text-[#b45309] font-bold text-[16px]">
            ₹{data.payment?.pending_amount}
          </p>

        </div>

      </div>

      {/* TABLE */}
      <div className="border-t border-[#eee] pt-3">

        {/* HEADER */}
        <div className="flex justify-between mb-2">

          <p className="text-[11px] text-[#6b7280] flex-1">
            DATE
          </p>

          <p className="text-[11px] text-[#6b7280] flex-1 text-center">
            MODE
          </p>

          <p className="text-[11px] text-[#6b7280] flex-1 text-right">
            AMOUNT
          </p>

        </div>

        {/* ROW */}
        <div className="flex justify-between items-center">

          <p className="text-[13px] font-medium flex-1">
            {data.purchase?.date}
          </p>

          <div className="flex-1 flex justify-center">

            <div className="bg-[#dcfce7] px-3 py-1 rounded-[10px]">

              <p className="text-[12px] font-semibold text-[#166534]">
                {data.payment?.mode?.toUpperCase()}
              </p>

            </div>

          </div>

          <p className="text-[13px] font-medium flex-1 text-right">
            ₹{data.payment?.paid_amount}
          </p>

        </div>

      </div>

      {/* FOOTER */}
      <p className="text-center mt-3 text-[#b91c1c] font-semibold">
        Thank you for your business 🌶️
      </p>

    </div>
  );
}