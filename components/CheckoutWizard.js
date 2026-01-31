import React from "react";

export default function CheckoutWizard({ activeStep = 0 }) {
  const steps = ["User Login", "Shipping Address", "Payment Method", "Place Order"];

  return (
    <div className="mb-5 flex flex-wrap">
      {steps.map((step, index) => (
        <div
          key={step}
          className={`flex-1 border-b-2 text-center ${
            index <= activeStep
              ? "border-blue-500 text-blue-500"
              : "border-gray-300 text-gray-400"
          }`}
        >
          <div className="py-3 font-semibold">{step}</div>
        </div>
      ))}
    </div>
  );
}
