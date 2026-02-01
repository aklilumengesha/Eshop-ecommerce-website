import React from "react";

export default function CheckoutWizard({ activeStep = 0 }) {
  const steps = ["User Login", "Shipping Address", "Payment Method", "Place Order"];

  return (
    <nav aria-label="Checkout progress" className="mb-5">
      <ol className="flex flex-wrap">
        {steps.map((step, index) => (
          <li
            key={step}
            className={`flex-1 border-b-2 text-center ${
              index <= activeStep
                ? "border-blue-500 text-blue-500"
                : "border-gray-300 text-gray-400"
            }`}
            aria-current={index === activeStep ? "step" : undefined}
          >
            <div className="py-3 font-semibold">
              <span className="sr-only">
                Step {index + 1} of {steps.length}:{" "}
              </span>
              {step}
              {index < activeStep && (
                <span className="sr-only"> (completed)</span>
              )}
              {index === activeStep && (
                <span className="sr-only"> (current)</span>
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}
