"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UserStoryActions({
  storyId,
  currentStatus,
}: {
  storyId: number;
  currentStatus: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function updateStatus(newStatus: string) {
    setUpdating(true);
    try {
      await fetch(`/api/admin/user-stories/${storyId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      setStatus(newStatus);
      router.refresh();
    } finally {
      setUpdating(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this story permanently?")) return;
    setDeleting(true);
    try {
      await fetch(`/api/admin/user-stories/${storyId}`, { method: "DELETE" });
      router.push("/admin/user-stories");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="bg-white border border-border rounded-xl p-5 space-y-3">
      <h2 className="font-display text-base font-bold text-green">Actions</h2>

      {status !== "approved" && (
        <button
          onClick={() => updateStatus("approved")}
          disabled={updating}
          className="w-full bg-green text-white rounded-md py-2.5 text-sm font-semibold font-body hover:opacity-90 transition-colors disabled:opacity-50"
        >
          {updating ? "Updating..." : "✓ Approve Story"}
        </button>
      )}

      {status !== "rejected" && (
        <button
          onClick={() => updateStatus("rejected")}
          disabled={updating}
          className="w-full bg-amber-50 text-amber-700 border border-amber-200 rounded-md py-2.5 text-sm font-semibold font-body hover:bg-amber-100 transition-colors disabled:opacity-50"
        >
          {updating ? "Updating..." : "✕ Reject Story"}
        </button>
      )}

      {status === "approved" && (
        <div className="bg-green/10 border border-green/20 rounded-md px-4 py-2.5 text-center">
          <p className="text-sm font-semibold text-green font-body">
            Story is Live
          </p>
          <p className="text-xs text-ink-muted font-body mt-0.5">
            Visible on the public site
          </p>
        </div>
      )}

      <div className="pt-2 border-t border-border">
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="w-full bg-red-50 text-red-700 border border-red-200 rounded-md py-2.5 text-sm font-semibold font-body hover:bg-red-100 transition-colors disabled:opacity-50"
        >
          {deleting ? "Deleting..." : "Delete Story"}
        </button>
      </div>
    </div>
  );
}
