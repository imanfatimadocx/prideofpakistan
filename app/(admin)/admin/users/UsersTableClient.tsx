"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  createdAt: string;
}

function generatePassword(length = 12): string {
  // No look-alike characters (0/O, 1/l/I) so it is easy to read out to someone
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  const bytes = new Uint32Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => chars[b % chars.length]).join("");
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** Shows a value with a small Copy button next to it. */
function CopyCell({
  value,
  label,
  className = "",
}: {
  value: string;
  label: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // Older browsers: fall back to a temporary text box
      const t = document.createElement("textarea");
      t.value = value;
      document.body.appendChild(t);
      t.select();
      document.execCommand("copy");
      t.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }
  return (
    <span className="flex items-center min-w-0 gap-1.5 group">
      <span className={`truncate select-text ${className}`} title={value}>
        {value}
      </span>
      <button
        type="button"
        onClick={copy}
        aria-label={`Copy ${label}`}
        title={`Copy ${label}`}
        className={`flex-shrink-0 text-[11px] font-semibold font-body px-1.5 py-0.5 rounded border transition-colors ${
          copied
            ? "border-leaf bg-mint text-leaf-dark"
            : "border-border text-ink-muted hover:border-leaf hover:text-leaf-dark"
        }`}
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </span>
  );
}

function DeletePanel({
  user,
  onClose,
  onDeleted,
}: {
  user: User;
  onClose: () => void;
  onDeleted: () => void;
}) {
  const [typed, setTyped] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const confirmed = typed.trim().toLowerCase() === "delete";

  async function handleDelete() {
    if (!confirmed) return;
    setDeleting(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, { method: "DELETE" });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) return setError(json.error ?? "Could not delete this user.");
      onDeleted();
    } catch {
      setError("Something went wrong.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="p-4 space-y-3 border border-red-200 rounded-lg bg-red-50">
      <p className="text-sm font-semibold text-red-700 font-body">
        Delete {user.name} ({user.email})?
      </p>
      <p className="text-xs text-ink-mid font-body">
        This permanently removes their account and they will no longer be able to
        sign in. Any comments or stories they posted stay on the site. This cannot
        be undone.
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="text"
          value={typed}
          onChange={(e) => setTyped(e.target.value)}
          placeholder='Type "delete" to confirm'
          className="px-3 py-2 text-sm bg-white border rounded-md border-border font-body focus:outline-none focus:border-red-400"
        />
        <button
          type="button"
          onClick={handleDelete}
          disabled={!confirmed || deleting}
          className="px-5 py-2 text-sm font-semibold text-white bg-red-600 rounded-md font-body hover:bg-red-700 disabled:opacity-40"
        >
          {deleting ? "Deleting…" : "Delete user"}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="px-5 py-2 text-sm font-semibold bg-white border rounded-md border-border text-ink-mid font-body hover:border-green hover:text-green"
        >
          Cancel
        </button>
      </div>
      {error && <p className="text-xs text-red-600 font-body">{error}</p>}
    </div>
  );
}

function PasswordPanel({ user, onClose }: { user: User; onClose: () => void }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleSave() {
    setError(null);
    if (password.length < 8)
      return setError("Password must be at least 8 characters.");
    if (password !== confirm) return setError("The two passwords don't match.");
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/users/${user.id}/password`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) return setError(json.error ?? "Failed to update password.");
      setDone(password);
    } catch {
      setError("Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  if (done) {
    return (
      <div className="p-4 space-y-3 border rounded-lg bg-green/5 border-green/20">
        <p className="text-sm font-semibold text-green font-body">
          Password updated for {user.name}.
        </p>
        <p className="text-xs text-ink-muted font-body">
          Share the new password with them privately (e.g. WhatsApp or phone),
          and ask them to keep it safe.
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <code className="px-3 py-1.5 text-sm bg-white border rounded border-border">
            {done}
          </code>
          <button
            type="button"
            onClick={async () => {
              await navigator.clipboard.writeText(done).catch(() => {});
              setCopied(true);
            }}
            className="text-xs font-semibold text-leaf-dark font-body hover:underline"
          >
            {copied ? "Copied" : "Copy"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="ml-auto text-xs text-ink-muted font-body hover:text-green"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-3 border rounded-lg bg-cream border-border">
      <p className="text-sm font-semibold text-ink-dark font-body">
        Set a new password for {user.name}
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <input
          type={show ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="New password (min 8 characters)"
          autoComplete="new-password"
          className="px-3 py-2 text-sm bg-white border rounded-md border-border font-body focus:outline-none focus:border-leaf"
        />
        <input
          type={show ? "text" : "password"}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Type it again"
          autoComplete="new-password"
          className="px-3 py-2 text-sm bg-white border rounded-md border-border font-body focus:outline-none focus:border-leaf"
        />
      </div>
      <div className="flex flex-wrap items-center gap-4 text-xs font-body">
        <button
          type="button"
          onClick={() => {
            const p = generatePassword();
            setPassword(p);
            setConfirm(p);
            setShow(true);
          }}
          className="font-semibold text-leaf-dark hover:underline"
        >
          Generate a password
        </button>
        <label className="flex items-center gap-1.5 cursor-pointer text-ink-muted">
          <input
            type="checkbox"
            checked={show}
            onChange={(e) => setShow(e.target.checked)}
          />
          Show
        </label>
      </div>
      {error && <p className="text-xs text-red-500 font-body">{error}</p>}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2 text-sm font-semibold text-white rounded-md bg-leaf font-body hover:bg-leaf-dark disabled:opacity-50"
        >
          {saving ? "Saving…" : "Update Password"}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="px-5 py-2 text-sm font-semibold border rounded-md border-border text-ink-mid font-body hover:border-green hover:text-green"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default function UsersTableClient({
  users,
  offset,
}: {
  users: User[];
  offset: number;
}) {
  const router = useRouter();
  // Which row has a panel open, and which panel
  const [open, setOpen] = useState<{ id: string; panel: "password" | "delete" } | null>(null);
  const [removed, setRemoved] = useState<string[]>([]);

  const toggle = (id: string, panel: "password" | "delete") =>
    setOpen(open?.id === id && open.panel === panel ? null : { id, panel });

  const visible = users.filter((u) => !removed.includes(u.id));

  if (visible.length === 0) {
    return (
      <div className="py-16 text-center bg-white border border-border rounded-xl">
        <p className="text-sm text-ink-muted font-body">No accounts found.</p>
      </div>
    );
  }

  const cols = "md:grid-cols-[40px_minmax(0,1.1fr)_minmax(0,1.5fr)_150px_170px]";

  return (
    <div className="overflow-hidden bg-white border border-border rounded-xl">
      <div className={`hidden md:grid ${cols} gap-4 px-5 py-3 border-b border-border bg-cream text-[11px] font-bold uppercase tracking-wide text-ink-muted font-body`}>
        <span>#</span>
        <span>Name</span>
        <span>Email</span>
        <span>Joined</span>
        <span className="text-right">Actions</span>
      </div>
      <div className="divide-y divide-border">
        {visible.map((u, i) => (
          <div key={u.id} className="px-5 py-3">
            <div className={`grid grid-cols-1 ${cols} gap-1.5 md:gap-4 md:items-center`}>
              <span className="hidden text-xs md:block text-ink-muted font-body">
                {offset + i + 1}
              </span>
              <CopyCell
                value={u.name}
                label="name"
                className="text-sm font-semibold text-ink-dark font-body"
              />
              <CopyCell
                value={u.email}
                label="email"
                className="text-sm text-ink-mid font-body"
              />
              <CopyCell
                value={formatDate(u.createdAt)}
                label="join date"
                className="text-xs text-ink-muted font-body"
              />
              <span className="flex gap-4 md:justify-end">
                <button
                  type="button"
                  onClick={() => toggle(u.id, "password")}
                  className="text-xs font-semibold text-leaf-dark font-body hover:underline"
                >
                  {open?.id === u.id && open.panel === "password" ? "Close" : "Set password"}
                </button>
                <button
                  type="button"
                  onClick={() => toggle(u.id, "delete")}
                  className="text-xs font-semibold text-red-600 font-body hover:underline"
                >
                  {open?.id === u.id && open.panel === "delete" ? "Close" : "Delete"}
                </button>
              </span>
            </div>
            {open?.id === u.id && open.panel === "password" && (
              <div className="mt-3">
                <PasswordPanel user={u} onClose={() => setOpen(null)} />
              </div>
            )}
            {open?.id === u.id && open.panel === "delete" && (
              <div className="mt-3">
                <DeletePanel
                  user={u}
                  onClose={() => setOpen(null)}
                  onDeleted={() => {
                    setOpen(null);
                    setRemoved((r) => [...r, u.id]);
                    router.refresh();
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
