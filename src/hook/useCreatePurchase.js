'use client';

import { useState } from 'react';
import { useAuth } from './useAuth';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const useNewPurchase = () => {
  const getTodayDate = () =>
    new Date().toISOString().split('T')[0];

  const { getToken } = useAuth();
  const token = getToken();

  const [loading, setLoading] = useState(false);

  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [grade, setGrade] = useState('');
  const [crop, setCrop] = useState('mirchi');
  const [price, setPrice] = useState('');
  const [date, setDate] = useState(getTodayDate());

  // DEDUCTION INPUTS
  const [range1, setRange1] = useState('');
  const [range2, setRange2] = useState('');
  const [range3, setRange3] = useState('');

  // BAGS
  const [bags, setBags] = useState([
    {
      bag: 'Bag 1',
      weight: '',
      netWeight: 0,
      deduction: 0,
    },
  ]);

  const [amountPaid, setAmountPaid] = useState('');
  const [paymentMode, setPaymentMode] = useState('cash');
  const [notes, setNotes] = useState('');

  const [showSuccess, setShowSuccess] = useState(false);

  // ----------------------------------------
  // GET EXTRA DEDUCTION BASED ON RANGE
  // ----------------------------------------

  const getRangeDeduction = (weight) => {
    // 46 - 49
    if (weight >= 46 && weight <= 49) {
      return parseFloat(range1) || 0;
    }

    // 50 - 60
    if (weight >= 50 && weight <= 60) {
      return parseFloat(range2) || 0;
    }

    // 60+
    if (weight > 60) {
      return parseFloat(range3) || 0;
    }

    return 0;
  };

  // ----------------------------------------
  // HANDLE BAG WEIGHT CHANGE
  // ----------------------------------------

  const handleWeightChange = (value, index) => {
    const updatedBags = bags.map((item, i) => {
      if (i !== index) return item;

      const weight = parseFloat(value) || 0;

      // DEFAULT 1 KG DEDUCTION FOR EVERY BAG
      const defaultDeduction = weight > 0 ? 1 : 0;

      // EXTRA RANGE DEDUCTION
      const extraDeduction =
        getRangeDeduction(weight);

      // TOTAL DEDUCTION
      const totalDeduction =
        defaultDeduction + extraDeduction;

      // FINAL NET WEIGHT
      const netWeight =
        weight > 0
          ? Math.max(weight - totalDeduction, 0)
          : 0;

      return {
        ...item,
        weight: value,
        deduction: totalDeduction,
        netWeight,
      };
    });

    setBags(updatedBags);
  };

  // ----------------------------------------
  // ADD BAG
  // ----------------------------------------

  const addBag = () => {
    setBags((prev) => [
      ...prev,
      {
        bag: `Bag ${prev.length + 1}`,
        weight: '',
        netWeight: 0,
        deduction: 0,
      },
    ]);
  };

  // ----------------------------------------
  // REMOVE BAG
  // ----------------------------------------

  const removeBag = (indexToRemove) => {
    if (bags.length === 1) return;

    const updated = bags.filter(
      (_, index) => index !== indexToRemove
    );

    const renamed = updated.map(
      (item, index) => ({
        ...item,
        bag: `Bag ${index + 1}`,
      })
    );

    setBags(renamed);
  };

  // ----------------------------------------
  // SAVE PURCHASE
  // ----------------------------------------

  const handleSave = async () => {
    try {
      setLoading(true);

      if (!token) {
        alert('Login again');
        return;
      }

      const payload = {
        customer_name: name,
        mobile,
        crop,
        price_per_kg: parseFloat(price) || 0,
        purchase_date: date,

        bags: bags.map((b, i) => ({
          bag_number: i + 1,

          // ORIGINAL WEIGHT
          gross_weight:
            parseFloat(b.weight) || 0,

          // TOTAL DEDUCTION
          deduction: b.deduction,

          // FINAL WEIGHT AFTER DEDUCTION
          net_weight: b.netWeight,
        })),

        payment: {
          amount_paid:
            parseFloat(amountPaid) || 0,
          payment_mode: paymentMode,
          remarks: '',
        },

        notes,
      };

      const res = await fetch(
        `${BASE_URL}api/purchases/create`,
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data?.message ||
            'Failed to save purchase'
        );
      }

      // SUCCESS
      setShowSuccess(true);

      // RESET
      setName('');
      setMobile('');
      setGrade('');
      setCrop('mirchi');
      setPrice('');
      setAmountPaid('');
      setPaymentMode('cash');
      setNotes('');

      setRange1('');
      setRange2('');
      setRange3('');

      setBags([
        {
          bag: 'Bag 1',
          weight: '',
          netWeight: 0,
          deduction: 0,
        },
      ]);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,

    name,
    setName,

    mobile,
    setMobile,

    crop,
    setCrop,

    grade,
    setGrade,

    price,
    setPrice,

    date,
    setDate,

    range1,
    setRange1,

    range2,
    setRange2,

    range3,
    setRange3,

    bags,
    handleWeightChange,
    addBag,
    removeBag,

    amountPaid,
    setAmountPaid,

    paymentMode,
    setPaymentMode,

    notes,
    setNotes,

    handleSave,

    showSuccess,
    setShowSuccess,
  };
};
