import { useState, useEffect } from "react";

interface Comment {
  id: number;
  body: string;
  postId: number;
}

const fetchComments = async () => {
  const response = await fetch("https://dummyjson.com/comments");
  if (!response.ok) throw new Error("Failed to fetch comments");
  return response.json();
};

const addCommentToAPI = async (body: string, postId: number) => {
  const response = await fetch("https://dummyjson.com/comments/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ body, postId, userId: 1 }),
  });
  if (!response.ok) throw new Error("Failed to add comment");
  return response.json();
};

const updateCommentInAPI = async (id: number, body: string) => {
  const response = await fetch(`https://dummyjson.com/comments/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ body }),
  });
  if (!response.ok) throw new Error("Failed to update comment");
  return response.json();
};

const deleteCommentFromAPI = async (id: number) => {
  const response = await fetch(`https://dummyjson.com/comments/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete comment");
};

const Comments = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setIsLoading(true);
    fetchComments()
      .then((data) => setComments(data.comments))
      .catch(() => setError("Failed to fetch comments."))
      .finally(() => setIsLoading(false));
  }, []);

  const addComment = async () => {
    const body = prompt("Enter your comment:");
    if (!body) return;
    setIsLoading(true);
    try {
      const newComment = await addCommentToAPI(body, 1);
      setComments((prev) => [newComment, ...prev]);
    } catch {
      setError("Failed to add comment.");
    } finally {
      setIsLoading(false);
    }
  };

  const editComment = async (id: number, currentBody: string) => {
    const newBody = prompt("Edit your comment:", currentBody);
    if (!newBody) return;
    setIsLoading(true);
    try {
      const updatedComment = await updateCommentInAPI(id, newBody);
      setComments((prev) => prev.map((comment) => (comment.id === id ? updatedComment : comment)));
    } catch {
      setError("Failed to update comment.");
    } finally {
      setIsLoading(false);
    }
  };

  const removeComment = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    setIsLoading(true);
    try {
      await deleteCommentFromAPI(id);
      setComments((prev) => prev.filter((comment) => comment.id !== id));
    } catch {
      setError("Failed to delete comment.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-20">
      <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">Comments</h2>
      {error && <p className="text-red-500 text-center">{error}</p>}
      <div className="mb-4 flex justify-center">
        <button onClick={addComment} className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600" disabled={isLoading}>
          {isLoading ? "Adding..." : "Add Comment"}
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading
          ? Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-gray-200 p-4 rounded shadow animate-pulse">
                <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-5/6"></div>
              </div>
            ))
          : comments.map((comment) => (
              <div key={comment.id} className="bg-white p-4 rounded shadow">
                <p className="text-gray-700">{comment.body}</p>
                <div className="flex justify-end space-x-2 mt-2">
                  <button onClick={() => editComment(comment.id, comment.body)} className="text-yellow-500">✎</button>
                  <button onClick={() => removeComment(comment.id)} className="text-red-500">✖</button>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
};

export default Comments;