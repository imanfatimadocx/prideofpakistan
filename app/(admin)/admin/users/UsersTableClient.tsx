"use client";
import { useState } from "react";

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
            className="text-xs font-semibold text-gold font-body hover:underline"
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
          className="px-3 py-2 text-sm bg-white border rounded-md border-border font-body focus:outline-none focus:border-gold"
        />
        <input
          type={show ? "text" : "password"}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Type it again"
          autoComplete="new-password"
          className="px-3 py-2 text-sm bg-white border rounded-md border-border font-body focus:outline-none focus:border-gold"
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
          className="font-semibold text-gold hover:underline"
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
          className="px-5 py-2 text-sm font-semibold text-white rounded-md bg-gold font-body hover:bg-gold-light hover:text-ink-dark disabled:opacity-50"
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
  const [openId, setOpenId] = useState<string | null>(null);

  if (users.length === 0) {
    return (
      <div className="py-16 text-center bg-white border border-border rounded-xl">
        <p className="text-sm text-ink-muted font-body">No accounts found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden bg-white border border-border rounded-xl">
      <div className="hidden md:grid grid-cols-[40px_1.2fr_1.5fr_110px_110px_130px] gap-4 px-5 py-3 border-b border-border bg-cream text-[11px] font-bold uppercase tracking-wide text-ink-muted font-body">
        <span>#</span>
        <span>Name</span>
        <span>Email</span>
        <span>Joined</span>
        <span className="text-right">Actions</span>
      </div>
      <div className="divide-y divide-border">
        {users.map((u, i) => (
          <div key={u.id} className="px-5 py-3">
            <div className="grid grid-cols-1 md:grid-cols-[40px_1.2fr_1.5fr_110px_130px] gap-1 md:gap-4 md:items-center">
              <span className="hidden text-xs md:block text-ink-muted font-body">
                {offset + i + 1}
              </span>
              <span className="text-sm font-semibold truncate text-ink-dark font-body">
                {u.name}
              </span>
              <a
                href={`mailto:${u.email}`}
                className="text-sm no-underline truncate text-ink-mid font-body hover:text-gold"
              >
                {u.email}
              </a>
              <span className="text-xs text-ink-muted font-body">
                {new Date(u.createdAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
              <span className="md:text-right">
                <button
                  type="button"
                  onClick={() => setOpenId(openId === u.id ? null : u.id)}
                  className="text-xs font-semibold text-gold font-body hover:underline"
                >
                  {openId === u.id ? "Close" : "Set password"}
                </button>
              </span>
            </div>
            {openId === u.id && (
              <div className="mt-3">
                <PasswordPanel user={u} onClose={() => setOpenId(null)} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
