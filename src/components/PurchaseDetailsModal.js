'use client';

import { IoClose } from 'react-icons/io5';

export default function PurchaseDetailsModal({
  visible,
  onClose,
  data,
}) {
  if (!visible || !data) return null;

  const thokuduKuli = data.totals.total_bags * 40;

  const handlePrint = async () => {
    if (!data) return;

    const thokuduKuli = data.totals.total_bags * 40;

    // ✅ Net Weight × Price
    const grossPriceAmount =
      Number(data.totals.net_weight) *
      Number(data.price_per_kg);

    // ✅ Final Amount After Thokudu Kuli Deduction
    const finalAmount =
      grossPriceAmount - thokuduKuli;

    const html = `
<html>
  <head>
    <style>
      body {
        font-family: monospace;
        padding: 10px;
      }

      .font-16 {
        font-size: 16px;
      }

      .font-12 {
        font-size: 12px;
      }

      .center {
        text-align: center;
      }

      .right {
        text-align: right;
        font-variant-numeric: tabular-nums;
      }

      .bold {
        font-weight: bold;
      }

      .line {
        border-top: 1px dashed #000;
        margin: 6px 0;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        font-size: 12px;
        table-layout: fixed;
      }

      th,
      td {
        padding: 4px;
      }

      th {
        text-align: left;
      }

      .col-bag {
        width: 25%;
      }

      .col-gross {
        width: 25%;
      }

      .col-ded {
        width: 25%;
      }

      .col-net {
        width: 25%;
      }

      .total {
        font-size: 14px;
        font-weight: bold;
      }

      .amount-box {
        border: 1px dashed #000;
        padding: 6px;
        margin-top: 6px;
      }
    </style>
  </head>

  <body>
    <div class="center bold">
      PTL Tirumala Traders
    </div>

    <div class="center font-16">
      జై శ్రీ రామ్
    </div>

    <div class="center font-12">
      కొనుగోలు బిల్ (Purchase Invoice)
    </div>

    <div class="line"></div>

    <div>
      బిల్ నం (Invoice): ${data.invoice_number}
    </div>

    <div>
      తేదీ (Date): ${data.date}
    </div>

    <div>
      రైతు పేరు (Customer): ${data.customer.name}
    </div>

    <div>
      మొబైల్ (Mobile): ${data.customer.mobile}
    </div>

    <div>
      కిలో ధర (Price/Kg): ₹${data.price_per_kg}
    </div>

    <div class="line"></div>

    <table>
      <tr class="bold">
        <th class="col-bag">
          సంచి (Bag)
        </th>

        <th class="right col-gross">
          మొత్తం
        </th>

        <th class="right col-ded">
          తగ్గింపు
        </th>

        <th class="right col-net">
          నికరము
        </th>
      </tr>

      ${data.bags
        .map(
          (b) => `
        <tr>
          <td class="col-bag">
            ${b.bag_number}
          </td>

          <td class="right col-gross">
            ${b.gross_weight}
          </td>

          <td class="right col-ded">
            ${b.deduction}
          </td>

          <td class="right col-net">
            ${b.net_weight}
          </td>
        </tr>
      `
        )
        .join('')}
    </table>

    <div class="line"></div>

    <table>
      <tr>
        <td>
          మొత్తం బరువు (Gross Weight)
        </td>

        <td class="right">
          ${data.totals.gross_weight}
        </td>
      </tr>

      <tr>
        <td>
          మొత్తం తగ్గింపు (Total Deduction)
        </td>

        <td class="right">
          ${data.totals.total_deduction}
        </td>
      </tr>

      <tr>
        <td>
          నికర బరువు (Net Weight)
        </td>

        <td class="right">
          ${data.totals.net_weight}
        </td>
      </tr>

      <tr>
        <td>
          మొత్తం సంచులు (Total Bags)
        </td>

        <td class="right">
          ${data.totals.total_bags}
        </td>
      </tr>
    </table>

    <div class="line"></div>

    <!-- ✅ Amount Calculation Section -->

    <div class="amount-box">
      <table>
        <tr>
          <td>
            ధర మొత్తం <br />
            (Net Weight × Price/Kg)
          </td>

          <td class="right">
            ₹${grossPriceAmount.toFixed(2)}
            <br />
            (${data.totals.net_weight} × ₹${data.price_per_kg})
          </td>
        </tr>

        <tr>
          <td>
            తొక్కుడు కూలి తగ్గింపు <br />
            (Thokudu Kuli)
          </td>

          <td class="right">
            - ₹${thokuduKuli}
            <br />
            (${data.totals.total_bags} × 40)
          </td>
        </tr>

        <tr class="total">
          <td>
            చివరి మొత్తం (Final Amount)
          </td>

          <td class="right">
            ₹${finalAmount.toFixed(2)}
          </td>
        </tr>
      </table>
    </div>

    <div class="line"></div>

    <table>
      <tr>
        <td>
          చెల్లింపు (Paid)
        </td>

        <td class="right">
          ₹${data.payment.paid}
        </td>
      </tr>

      <tr>
        <td>
          మిగతా (Pending)
        </td>

        <td class="right">
          ₹${data.payment.pending}
        </td>
      </tr>

      <tr>
        <td>
          స్థితి (Status)
        </td>

        <td class="right">
          ${data.payment.status}
        </td>
      </tr>
    </table>

    <div class="line"></div>

    <div class="center">
      ధన్యవాదాలు 🙏
    </div>
  </body>
</html>
`;

    const printWindow = window.open('', '_blank');

    printWindow.document.write(html);

    printWindow.document.close();

    printWindow.focus();

    printWindow.print();

    printWindow.close();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-xl w-full max-w-[500px] max-h-[70vh] relative overflow-hidden">

        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 bg-gray-200 rounded-full w-[30px] h-[30px] flex items-center justify-center"
        >
          <IoClose className="text-[18px] font-bold" />
        </button>

        {/* SCROLL */}
        <div className="overflow-y-auto max-h-[70vh] p-4 pb-[120px]">

          {/* TITLE */}
          <h2 className="text-[20px] font-bold mb-3">
            Invoice
          </h2>

          {/* INFO */}
          <p className="font-semibold mt-2 text-[14px]">
            Invoice No:
          </p>

          <p className="text-[14px]">
            {data.invoice_number}
          </p>

          <p className="font-semibold mt-2 text-[14px]">
            Date:
          </p>

          <p className="text-[14px]">
            {data.date}
          </p>

          {/* CUSTOMER */}
          <h3 className="font-bold mt-4 text-[16px]">
            Customer
          </h3>

          <p className="text-[14px] mt-1">
            Name: {data.customer.name}
          </p>

          <p className="text-[14px] mt-1">
            Mobile: {data.customer.mobile}
          </p>

          {/* DETAILS */}
          <h3 className="font-bold mt-4 text-[16px]">
            Details
          </h3>

          <p className="text-[14px] mt-1">
            Crop: {data.crop}
          </p>

          <p className="text-[14px] mt-1">
            Price/Kg: ₹{data.price_per_kg}
          </p>

          {/* BAGS */}
          <h3 className="font-bold mt-4 text-[16px]">
            Bags
          </h3>

          {/* TABLE HEADER */}
          <div className="grid grid-cols-4 bg-slate-200 rounded-md py-2 mt-2">

            <p className="text-center font-bold text-[12px]">
              Bag
            </p>

            <p className="text-center font-bold text-[12px]">
              Gross
            </p>

            <p className="text-center font-bold text-[12px]">
              Ded
            </p>

            <p className="text-center font-bold text-[12px]">
              Net
            </p>

          </div>

          {/* TABLE ROWS */}
          {data.bags.map((bag) => (
            <div
              key={bag.bag_number}
              className="grid grid-cols-4 border-b border-gray-200 py-2"
            >
              <p className="text-center text-[12px]">
                {bag.bag_number}
              </p>

              <p className="text-center text-[12px]">
                {bag.gross_weight}
              </p>

              <p className="text-center text-[12px]">
                {bag.deduction}
              </p>

              <p className="text-center text-[12px]">
                {bag.net_weight}
              </p>
            </div>
          ))}

          {/* TOTALS */}
          <h3 className="font-bold mt-4 text-[16px]">
            Totals
          </h3>

          <p className="text-[14px] mt-1">
            Total Bags: {data.totals.total_bags}
          </p>

          <p className="text-[14px] mt-1">
            Gross: {data.totals.gross_weight}
          </p>

          <p className="text-[14px] mt-1">
            Deduction: {data.totals.total_deduction}
          </p>

          <p className="text-[14px] mt-1">
            Net: {data.totals.net_weight}
          </p>

          {/* CALCULATION BOX */}
          <div className="border border-dashed border-gray-300 rounded-lg p-3 mt-3 bg-gray-50">

            <div className="flex justify-between items-start text-[14px]">

              <div>
                <p className="font-medium">
                  Net Weight × Price
                </p>

                <p className="text-[12px] text-gray-500">
                  {data.totals.net_weight} × ₹{data.price_per_kg}
                </p>
              </div>

              <p className="font-semibold">
                ₹
                {(
                  Number(data.totals.net_weight) *
                  Number(data.price_per_kg)
                ).toFixed(2)}
              </p>

            </div>

            <div className="flex justify-between items-start text-[14px] mt-3">

              <div>
                <p className="font-medium">
                  Thokudu Kuli
                </p>

                <p className="text-[12px] text-gray-500">
                  {data.totals.total_bags} × 40
                </p>
              </div>

              <p className="font-semibold text-red-600">
                - ₹{thokuduKuli}
              </p>

            </div>

            <div className="border-t border-dashed border-gray-300 mt-3 pt-3 flex justify-between items-center">

              <p className="font-bold text-[15px]">
                Final Amount
              </p>

              <p className="font-bold text-[18px] text-green-600">
                ₹
                {(
                  (
                    Number(data.totals.net_weight) *
                    Number(data.price_per_kg)
                  ) - thokuduKuli
                ).toFixed(2)}
              </p>

            </div>

          </div>

        </div>

        {/* PRINT BUTTON */}
        <div className="absolute bottom-0 left-0 right-0 bg-white p-4 border-t">

          <button
            onClick={handlePrint}
            className="w-full bg-green-600 py-4 rounded-xl text-white font-bold"
          >
            Print
          </button>

        </div>

      </div>
    </div>
  );
}