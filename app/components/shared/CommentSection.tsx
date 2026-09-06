"use client";
import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface Comment {
  id: number;
  content: string;
  authorName: string;
  authorEmail: string;
  userId: string | null;
  likes: number;
  likedBy: string[];
  createdAt: string;
  parentId: number | null;
  replies: Comment[];
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function Avatar({ name }: { name: string }) {
  return (
    <div className="w-8 h-8 rounded-full bg-green flex items-center justify-center text-white text-xs font-bold font-display flex-shrink-0">
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

function CommentItem({
  comment,
  entityType,
  entityId,
  depth = 0,
  currentUserId,
  onDelete,
  onReply,
}: {
  comment: Comment;
  entityType: string;
  entityId: number;
  depth?: number;
  currentUserId: string | null;
  onDelete: (id: number) => void;
  onReply: (parentId: number, parentName: string) => void;
}) {
  const [likes, setLikes] = useState(comment.likes);
  const [liked, setLiked] = useState(
    currentUserId ? comment.likedBy.includes(currentUserId) : false,
  );
  const [liking, setLiking] = useState(false);

  async function handleLike() {
    setLiking(true);
    try {
      const res = await fetch(`/api/comments/${comment.id}/like`, {
        method: "POST",
      });
      const json = await res.json();
      setLikes(json.likes);
      setLiked(json.liked);
    } finally {
      setLiking(false);
    }
  }

  return (
    <div className={`${depth > 0 ? "ml-8 pl-4 border-l-2 border-border" : ""}`}>
      <div className="flex gap-3 items-start">
        <Avatar name={comment.authorName} />
        <div className="flex-1 min-w-0">
          <div className="bg-cream rounded-xl px-4 py-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-ink-dark font-body">
                {comment.authorName}
              </span>
              <span className="text-[10px] text-ink-muted font-body">
                {timeAgo(comment.createdAt)}
              </span>
            </div>
            <p className="text-sm text-ink-mid font-body leading-relaxed">
              {comment.content}
            </p>
          </div>
          {/* Actions */}
          <div className="flex items-center gap-4 mt-1.5 px-1">
            <button
              onClick={handleLike}
              disabled={liking}
              className={`flex items-center gap-1 text-xs font-semibold font-body transition-colors ${liked ? "text-gold" : "text-ink-muted hover:text-gold"}`}
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill={liked ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {likes > 0 && <span>{likes}</span>}
            </button>
            {depth === 0 && (
              <button
                onClick={() => onReply(comment.id, comment.authorName)}
                className="text-xs font-semibold text-ink-muted font-body hover:text-green transition-colors"
              >
                Reply
              </button>
            )}
            <button
              onClick={() => onDelete(comment.id)}
              className="text-xs text-red-400 font-body hover:text-red-600 transition-colors ml-auto"
            >
              Report
            </button>
          </div>
        </div>
      </div>

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-3 space-y-3">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              entityType={entityType}
              entityId={entityId}
              depth={depth + 1}
              currentUserId={currentUserId}
              onDelete={onDelete}
              onReply={onReply}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CommentSection({
  entityType,
  entityId,
}: {
  entityType: string;
  entityId: number;
}) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [replyTo, setReplyTo] = useState<{ id: number; name: string } | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  const currentUserId = session?.user?.email ?? null;

  const fetchComments = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/comments?entityType=${entityType}&entityId=${entityId}`,
      );
      const data = await res.json();
      setComments(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  }, [entityType, entityId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    if (!session) {
      setError("Please log in to comment.");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entityType,
          entityId,
          content,
          parentId: replyTo?.id ?? null,
        }),
      });
      if (!res.ok) {
        setError("Failed to post comment.");
        return;
      }
      setContent("");
      setReplyTo(null);
      await fetchComments();
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Remove this comment?")) return;
    await fetch(`/api/comments/${id}`, { method: "DELETE" });
    await fetchComments();
  }

  const totalCount = comments.reduce(
    (acc, c) => acc + 1 + (c.replies?.length ?? 0),
    0,
  );

  return (
    <div className="mt-10 pt-8 border-t border-border">
      <h2 className="font-display text-xl font-bold text-green mb-6">
        {totalCount > 0
          ? `${totalCount} Comment${totalCount !== 1 ? "s" : ""}`
          : "Comments"}
      </h2>

      {/* Comment form */}
      {session ? (
        <form onSubmit={handleSubmit} className="mb-8">
          {replyTo && (
            <div className="flex items-center gap-2 mb-2 text-xs text-ink-muted font-body">
              <span>
                Replying to{" "}
                <span className="font-semibold text-green">{replyTo.name}</span>
              </span>
              <button
                type="button"
                onClick={() => setReplyTo(null)}
                className="text-red-400 hover:text-red-600"
              >
                ✕ Cancel
              </button>
            </div>
          )}
          <div className="flex gap-3 items-start">
            <Avatar name={session.user?.name ?? "U"} />
            <div className="flex-1">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={
                  replyTo ? `Reply to ${replyTo.name}…` : "Write a comment…"
                }
                rows={3}
                className="w-full px-4 py-3 text-sm border border-border rounded-xl font-body focus:outline-none focus:border-gold transition-colors resize-none"
              />
              {error && (
                <p className="text-xs text-red-500 font-body mt-1">{error}</p>
              )}
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={submitting || !content.trim()}
                  className="bg-gold text-white px-5 py-2 rounded-lg text-sm font-semibold font-body hover:bg-gold-light hover:text-ink-dark transition-colors disabled:opacity-50"
                >
                  {submitting
                    ? "Posting…"
                    : replyTo
                      ? "Post Reply"
                      : "Post Comment"}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="bg-cream border border-border rounded-xl px-5 py-4 mb-8 text-center">
          <p className="text-sm text-ink-muted font-body">
            <Link
              href="/login"
              className="text-gold font-semibold hover:underline no-underline"
            >
              Log in
            </Link>{" "}
            to join the conversation.
          </p>
        </div>
      )}

      {/* Comments list */}
      {loading ? (
        <p className="text-sm text-ink-muted font-body">Loading comments…</p>
      ) : comments.length === 0 ? (
        <div className="text-center py-10 bg-cream rounded-xl">
          <p className="text-sm text-ink-muted font-body">
            No comments yet. Be the first!
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              entityType={entityType}
              entityId={entityId}
              currentUserId={currentUserId}
              onDelete={handleDelete}
              onReply={(id, name) => {
                setReplyTo({ id, name });
                setContent("");
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
