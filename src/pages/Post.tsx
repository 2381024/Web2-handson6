import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

interface Post {
  id: number;
  title: string;
  body: string;
}

const fetchPostList = async () => {
  const response = await fetch("https://dummyjson.com/posts");
  if (!response.ok) throw new Error("Failed to fetch posts");
  return response.json();
};

const updatePost = async ({ id, title, body }: { id: number; title: string; body: string }) => {
  const response = await fetch(`https://dummyjson.com/posts/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, body }),
  });
  if (!response.ok) throw new Error("Failed to update post");
  return response.json();
};

const deletePost = async (id: number) => {
  const response = await fetch(`https://dummyjson.com/posts/${id}`, { method: "DELETE" });
  if (!response.ok) throw new Error("Failed to delete post");
};

const PostSkeleton = () => {
  return (
    <div className="bg-gray-200 p-4 rounded shadow animate-pulse">
      <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-5/6"></div>
    </div>
  );
};

const Posts = () => {
  const queryClient = useQueryClient();
  const getPostList = useQuery({
    queryKey: ["postList"],
    queryFn: fetchPostList,
  });
  const navigate = useNavigate();

  const updateMutation = useMutation({
    mutationFn: updatePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["postList"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["postList"] });
    },
  });

  const handleEdit = (post: Post) => {
    const updatedTitle = prompt("Edit title:", post.title);
    const updatedBody = prompt("Edit body:", post.body);
    if (updatedTitle && updatedBody) {
      updateMutation.mutate({ id: post.id, title: updatedTitle, body: updatedBody });
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="container mx-auto px-4">
      <button className="fixed bottom-4 right-4 bg-blue-500 text-white rounded-full p-4 shadow-lg hover:bg-blue-600" onClick={() => {}}>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
        </svg>
      </button>
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">List of Posts</h2>
          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
            {getPostList.isLoading
              ? Array.from({ length: 6 }).map((_, index) => <PostSkeleton key={index} />)
              : getPostList.data?.posts.map((post: Post) => (
                  <div key={post.id} className="bg-white p-4 rounded shadow">
                    <h3 className="font-bold text-lg">{post.title}</h3>
                    <p className="text-gray-700">{post.body}</p>
                    <div className="flex justify-end space-x-2 mt-2">
                      <button onClick={() => handleEdit(post)} className="text-yellow-500">✎</button>
                      <button onClick={() => handleDelete(post.id)} className="text-red-500">✖</button>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Posts;
