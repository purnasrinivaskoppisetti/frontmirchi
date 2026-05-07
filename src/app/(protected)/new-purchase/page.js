'use client';
import { useNewPurchase } from '@/hook/useCreatePurchase';
import { useState } from 'react';
import { useAuth } from '@/hook/useAuth';
import PreviewCard from '@/components/PreviewCard';
export default function NewPurchasePage() {
    const { getToken } = useAuth();
    const token = getToken();
    const [errors, setErrors] = useState({});
    const [submitLoading, setSubmitLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [previewLoading, setPreviewLoading] = useState(false);
    const [previewData, setPreviewData] = useState(null);
    const {
        loading,

        name,
        setName,

        mobile,
        setMobile,
        grade,
        setGrade,
        crop,
        setCrop,

        price,
        setPrice,

        range1,
        setRange1,

        range2,
        setRange2,

        range3,
        setRange3,

        bags,
        handleWeightChange,
        addBag,

        amountPaid,
        setAmountPaid,

        paymentMode,
        setPaymentMode,
        removeBag,
    } = useNewPurchase();
   const handleSave = async () => {

  if (submitLoading) return;

  const newErrors = {};

  // NAME REQUIRED
  if (!name.trim()) {
    newErrors.name = 'Please enter name';
  }

  // PRICE REQUIRED
  if (!price) {
    newErrors.price = 'Please enter price';
  }

  // SHOW ERRORS
  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  // EMPTY BAG CHECK
  const hasEmptyWeight = bags.some(
    (b) => !b.weight || b.weight.trim() === ''
  );

  if (hasEmptyWeight) {
    alert('Please enter weight for all bags');
    return;
  }

  try {

    setSubmitLoading(true);

    const token = getToken();

    if (!token) {
      alert('Login again');
      return;
    }

    // PAYLOAD
    const payload = {
      customer_name: name,
      mobile: mobile ? mobile : '',
      crop,
      type: grade,

      price_per_kg: Number(price),

      purchase_date: new Date()
        .toISOString()
        .split('T')[0],

      bags: bags.map((b, i) => ({
        bag_number: i + 1,
        gross_weight: Number(b.weight),
        deduction: Number(b.deduction),
      })),

      payment: {
        amount_paid: Number(amountPaid || 0),
        payment_mode: paymentMode,
        remarks: '',
      },

      notes: '',
    };

    // API CALL
    const res = await fetch(
      'https://www.ptltirumalatraders.online/api/purchases/create',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    // SAFE RESPONSE
    const text = await res.text();

    console.log('RAW RESPONSE:', text);

    let data = null;

    try {

      data = JSON.parse(text);

      console.log('PARSED RESPONSE:', data);

    } catch (e) {

      console.log('JSON PARSE ERROR');

    }

    // SUCCESS POPUP
    setShowSuccess(true);

    // CLEAR FORM
    setName('');
    setMobile('');
    setCrop('mirchi');
    setGrade('');
    setPrice('');
    setAmountPaid('');
    setPaymentMode('cash');

    // RESET DEDUCTION RULES
    setRange1('');
    setRange2('');
    setRange3('');

    // RESET BAGS
    setBags([
      {
        bag: 'Bag 1',
        weight: '',
        netWeight: 0,
        deduction: 0,
      },
    ]);

    // REMOVE PREVIEW
    setPreviewData(null);

    // CLEAR ERRORS
    setErrors({});

  } catch (err) {

    console.log(
      'Create Purchase Error:',
      err
    );

  } finally {

    setSubmitLoading(false);

  }
};
    const totalNetWeight = bags.reduce(
        (sum, bag) => sum + Number(bag.netWeight || 0),
        0
    );

    const thokuduKuli = bags.length * 40;

    const totalAmount =
        totalNetWeight * Number(price || 0) - thokuduKuli;
    const handlePreview = async () => {
        if (!name || !price || !crop) {
            alert('Please fill required fields');
            return;
        }

        const hasEmptyWeight = bags.some(
            (b) => !b.weight || b.weight.trim() === ''
        );

        if (hasEmptyWeight) {
            alert('Please enter weight for all bags');
            return;
        }

        try {
            setPreviewLoading(true);

            const token = getToken();

            const payload = {
                customer_name: name,
                mobile,
                crop,
                type: grade,
                price_per_kg: Number(price),
                purchase_date: new Date()
                    .toISOString()
                    .split('T')[0],

                bags: bags.map((b, i) => ({
                    bag_number: i + 1,
                    gross_weight: Number(b.weight),
                    deduction: b.deduction,
                })),

                payment: {
                    amount_paid: Number(amountPaid),
                    payment_mode: paymentMode,
                    remarks: '',
                },

                notes: '',
            };

            const res = await fetch(
                'https://www.ptltirumalatraders.online/api/purchases/preview',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(payload),
                }
            );

            const data = await res.json();

            setPreviewData(data?.data);

        } catch (e) {
            alert('Preview failed');
        } finally {
            setPreviewLoading(false);
        }
    };
    return (
        <div className="min-h-screen bg-slate-100 pb-28">
            <div className="max-w-7xl mx-auto p-3 lg:p-6 lg:w-[80%]">
                <div className="bg-stone-100 border-t-[3px] border-red-700 rounded-2xl p-4 flex items-center justify-between mb-5 shadow-sm">
                    <div>
                        <h1 className="text-[20px] font-bold text-orange-900">
                            Jai Sri Ram
                        </h1>

                        <p className="text-[11px] text-slate-500">
                            Purchase Entry
                        </p>
                    </div>

                    <div className="bg-red-700 rounded-2xl px-4 py-2 text-center">
                        <p className="text-[10px] text-white">
                            Total Bill
                        </p>

                        <p className="text-white text-lg font-bold">
                            ₹ {totalAmount}
                        </p>
                    </div>
                </div>

                {/* CROP */}
                <div className="bg-white rounded-2xl p-3 mb-3">
                    <p className="font-semibold text-sm mb-2">
                        పంట (Crops)
                    </p>

                    <div className="flex gap-2">
                        {['mirchi', 'cotton'].map((item) => (
                            <button
                                key={item}
                                onClick={() => setCrop(item)}
                                className={`flex-1 py-2 rounded-full text-sm font-semibold transition-all
                  ${crop === item
                                        ? 'bg-green-600 text-white'
                                        : 'bg-slate-200 text-black'
                                    }`}
                            >
                                {item.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>

                {/* FARMER */}
                <p className="text-xs text-slate-500 font-semibold ml-1 mb-1">
                    రైతు / సరఫరాదారు
                </p>

                <div className="bg-white rounded-2xl p-4 mb-3 shadow-sm">

                    <div className="mb-4">
                        <label className="text-sm text-slate-600">
                            పేరు (Name)
                        </label>

                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter farmer name"
                            className="w-full border border-slate-200 rounded-xl p-3 mt-1 bg-slate-50 outline-none"
                        />
                        {errors.name && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <div className='mb-4'>
                        <label className="text-sm text-slate-600">
                            మొబైల్ (Mobile)
                        </label>

                        <input
                            value={mobile}
                            maxLength={10}
                            onChange={(e) =>
                                setMobile(
                                    e.target.value.replace(/[^0-9]/g, '')
                                )
                            }
                            placeholder="9XXXXXXXXX"
                            className="w-full border border-slate-200 rounded-xl p-3 mt-1 bg-slate-50 outline-none"
                        />
                        {errors.mobile && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.mobile}
                            </p>
                        )}
                    </div>
                    <div className="mt-4">
                        <label className="text-sm text-slate-600">
                            రకం / గ్రేడ్ (Type / Grade)
                        </label>

                        <input
                            value={grade}
                            onChange={(e) => setGrade(e.target.value)}
                            placeholder="Enter type or grade"
                            className="
                                w-full
                                border
                                border-slate-200
                                rounded-xl
                                p-3
                                mt-1
                                bg-slate-50
                                outline-none
                            "
                        />
                    </div>
                </div>

                {/* PRICING */}
                <div className='mb-4'>
                    <p className="text-xs text-slate-500 font-semibold ml-1 mb-1">
                        ధరలు & తగ్గింపులు
                    </p>

                    <div className="bg-white rounded-2xl p-4 mb-3 shadow-sm">

                        <div className="mb-4">
                            <label className="text-sm text-slate-600">
                                కిలో ధర (₹)
                            </label>

                            <input
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                placeholder="0"
                                type="text"
                                className="w-full border border-slate-200 rounded-xl p-3 mt-1 bg-slate-50 outline-none"
                            />
                            {errors.price && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.price}
                                </p>
                            )}
                        </div>

                        <p className="text-sm italic text-slate-500 mb-3">
                            Note: 1 kg deducted for every bag
                        </p>

                        <div className="space-y-3">

                            <div className="flex items-center gap-3">
                                <p className="w-20 text-sm">
                                    46 - 49
                                </p>

                                <input
                                    value={range1}
                                    onChange={(e) => setRange1(e.target.value)}
                                    placeholder="kg"
                                    type="text"
                                    className="flex-1 border border-slate-200 rounded-xl p-3 bg-slate-50 outline-none"
                                />
                            </div>

                            <div className="flex items-center gap-3">
                                <p className="w-20 text-sm">
                                    50 - 60
                                </p>

                                <input
                                    value={range2}
                                    onChange={(e) => setRange2(e.target.value)}
                                    placeholder="kg"
                                    type="text"
                                    className="flex-1 border border-slate-200 rounded-xl p-3 bg-slate-50 outline-none"
                                />
                            </div>

                            <div className="flex items-center gap-3">
                                <p className="w-20 text-sm">
                                    60+
                                </p>

                                <input
                                    value={range3}
                                    onChange={(e) => setRange3(e.target.value)}
                                    placeholder="kg"
                                    type="text"
                                    className="flex-1 border border-slate-200 rounded-xl p-3 bg-slate-50 outline-none"
                                />
                            </div>

                        </div>
                    </div>

                </div>
                <p className="text-[15px] font-semibold text-[#64748b] mb-3 ml-1">
                    సంచులు నమోదు (Bag Entry)
                </p>

                {/* CARD */}
                <div className="bg-white rounded-[30px] p-4 shadow-md">

                    <div className="space-y-4">

                        {bags.map((bag, index) => (

                            <div
                                key={index}
                                className="
                  bg-[#f5f6f8]
                  rounded-[20px]
                  px-3
                  py-3
                  flex
                  items-center
                  gap-2
                "
                            >

                                {/* NUMBER */}
                                <div
                                    className="
                    w-[40px]
                    h-[40px]
                    rounded-[12px]
                    bg-[#ef2020]
                    text-white
                    text-[18px]
                    font-bold
                    flex
                    items-center
                    justify-center
                    shrink-0
                  "
                                >
                                    {index + 1}
                                </div>

                                {/* INPUT */}
                                <input
                                    type="text"
                                    value={bag.weight}
                                    onChange={(e) =>
                                        handleWeightChange(
                                            e.target.value,
                                            index
                                        )
                                    }
                                    onKeyDown={(e) => {

                                        if (
                                            e.key === 'Enter' &&
                                            bag.weight &&
                                            index === bags.length - 1
                                        ) {
                                            addBag();
                                        }
                                    }}
                                    placeholder="Weight"
                                    className="
                    flex-1
                    h-[48px]
                    rounded-[16px]
                    border
                    border-[#d9dce1]
                    bg-white
                    px-4
                    text-[17px]
                    font-medium
                    outline-none
                    min-w-0
                  "
                                />

                                {/* RIGHT */}
                                <div className="flex flex-col items-end leading-none min-w-[55px]">

                                    <p className="text-[#ff4d4f] text-[16px] font-bold">
                                        -{bag.deduction}
                                    </p>

                                    <p className="text-[#16a34a] text-[16px] font-bold mt-1">
                                        {bag.netWeight} kg
                                    </p>
                                </div>

                                {/* DELETE */}
                                {bags.length > 1 && (
                                    <button
                                        onClick={() => removeBag(index)}
                                        className="
                      w-[38px]
                      h-[38px]
                      rounded-[12px]
                      bg-[#ff4d4f]
                      text-white
                      text-[22px]
                      flex
                      items-center
                      justify-center
                      shrink-0
                    "
                                    >
                                        ×
                                    </button>
                                )}

                            </div>
                        ))}

                    </div>

                    {/* ADD BAG */}
                    <button
                        onClick={addBag}
                        className="
              w-full
              h-[60px]
              rounded-[20px]
              border-2
              border-dashed
              border-[#c7d2fe]
              bg-white
              mt-5
              text-[#475569]
              text-[18px]
              font-semibold
            "
                    >
                        + Add Bag
                    </button>

                    {/* TOTAL */}
                    <p className="mt-5 text-[18px] italic text-[#6b7280]">
                        తొక్కుడు కూలి: ₹ {thokuduKuli} ({bags.length} × 40)
                    </p>

                </div>

                {/* PAYMENT */}
                <p className="text-xs my-4 text-slate-500 font-semibold ml-1 mb-1">
                    చెల్లింపు (Payment)
                </p>

                <div className="bg-white rounded-2xl pt-4 p-4 mb-3 shadow-sm">

                    <div className="mb-4">
                        <label className="text-sm text-slate-600">
                            Amount Paid
                        </label>

                        <input
                            type="text"
                            value={amountPaid}
                            onChange={(e) =>
                                setAmountPaid(e.target.value)
                            }
                            className="w-full border-2 border-amber-400 rounded-2xl p-4 mt-1 outline-none"
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                        {['cash', 'upi', 'bank'].map((item) => (
                            <button
                                key={item}
                                onClick={() => setPaymentMode(item)}
                                className={`rounded-2xl py-3 font-semibold text-sm border-2 transition
                ${paymentMode === item
                                        ? 'border-red-600 bg-red-100'
                                        : 'border-slate-200 bg-slate-50'
                                    }`}
                            >
                                {item.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>
                {previewData && (
                    <PreviewCard data={previewData} />
                )}
                <div className="grid grid-cols-2 gap-3">

                    <button
                        onClick={handlePreview}
                        disabled={previewLoading}
                        className="
                            w-full
                            bg-slate-500
                            text-white
                            font-bold
                            py-4
                            rounded-2xl
                            disabled:opacity-70
                        "
                    >

                        {previewLoading ? (

                            <div className="flex items-center justify-center gap-2">

                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>

                                <span>Previewing...</span>

                            </div>

                        ) : (
                            'Preview'
                        )}

                    </button>
                    {/* SUBMIT */}
                    <button
                        onClick={handleSave}
                        disabled={submitLoading}
                        className="
                            w-full
                            bg-red-600
                            text-white
                            font-bold
                            py-4
                            rounded-2xl
                            disabled:opacity-70
                            "
                    >

                        {submitLoading ? (

                            <div className="flex items-center justify-center gap-2">

                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>

                                <span>Submitting...</span>

                            </div>

                        ) : (
                            'Submit'
                        )}

                    </button>

                </div>
                {showSuccess && (
                    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">

                        <div className="bg-white rounded-3xl p-6 w-full max-w-[320px] text-center animate-in fade-in zoom-in">

                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">

                                <span className="text-green-600 text-3xl">
                                    ✓
                                </span>

                            </div>

                            <h2 className="text-xl font-bold text-black">
                                Success
                            </h2>

                            <p className="text-slate-500 mt-2 text-sm">
                                Purchase created successfully
                            </p>

                            <button
                                onClick={() => setShowSuccess(false)}
                                className="
          w-full
          mt-5
          bg-green-600
          text-white
          py-3
          rounded-2xl
          font-semibold
        "
                            >
                                OK
                            </button>

                        </div>

                    </div>
                )}
                {/* PREVIEW CARD */}

            </div>

        </div>
    );
}