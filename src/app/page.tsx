"use client";
import { useState } from "react";

// Get backend URL from environment
const BackendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function GSTPage() {
  const [price, setPrice] = useState("");
  const [gstInfo, setGstInfo] = useState<null | {
    total_price: number;
    base_price: number;
    gst_18_percent: number;
  }>(null);
  const [error, setError] = useState("");

  const handleCheckGST = async () => {
    setError("");
    setGstInfo(null);

    const num = parseFloat(price);
    if (isNaN(num) || num <= 0) {
      setError("Enter a valid price.");
      return;
    }

    try {
      const res = await fetch(`${BackendURL}/gst?price=${num}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "API Error");

      setGstInfo(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">GST Calculator</h1>

      <input
        type="number"
        placeholder="Enter price including GST"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="border border-gray-300 rounded px-3 py-2 w-full mb-4"
      />

      <button
        onClick={handleCheckGST}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
      >
        Calculate
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {gstInfo && (
        <div className="mt-6 bg-gray-100 p-4 rounded text-sm">
          <p><strong>Total Price:</strong> ₹{gstInfo.total_price}</p>
          <p><strong>Base Price (Excl. GST):</strong> ₹{gstInfo.base_price}</p>
          <p><strong>GST (18%):</strong> ₹{gstInfo.gst_18_percent}</p>
        </div>
      )}
    </div>
  );
}
