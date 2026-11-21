"use client";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="px-4 py-2 text-sm font-semibold text-white rounded-md bg-leaf font-body hover:bg-leaf-dark print:hidden"
    >
      Print / Save as PDF
    </button>
  );
}
