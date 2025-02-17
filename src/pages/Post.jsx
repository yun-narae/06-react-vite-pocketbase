import React, { useEffect, useState } from "react";
import pb from "../lib/pocketbase";
import getPbImageURL from "../lib/getPbImageURL";

const Post = ({ isLoggedIn, isDarkMode, setDarkMode, isLoading, setIsLoading }) => {
    const user = pb.authStore.model;
    const [postData, setPostData] = useState([]);
    const [dataloading, setDataLoading] = useState(true);
    const [title, setTitle] = useState("");
    const [text, setText] = useState("");
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        setIsLoading(true);
        setDataLoading(true);
        try {
            const posts = await pb.collection("post").getFullList({ autoCancel: false });
            setPostData(
                posts.map((post) => ({
                    id: post.id,
                    imageUrl: getPbImageURL(post, "photo"),
                    title: post.title || "No title",
                    editor: post.editor || "No editor",
                    text: post.text || "No text",
                    update: post.update || "No update",
                }))
            );
        } catch (error) {
            console.error("Error fetching files:", error);
        } finally {
            setIsLoading(false);
            setDataLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !text || !user) {
            alert("제목과 내용을 입력해주세요.");
            return;
        }
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("text", text);
            formData.append("user", user.id);
            if (image) formData.append("photo", image);
            
            await pb.collection("post").create(formData);
            fetchPosts(); // 새로고침 없이 리스트 갱신
            setTitle("");
            setText("");
            setImage(null);
        } catch (error) {
            console.error("게시물 업로드 실패:", error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <>
            <h1 className="text-2xl pb-4 dark:text-white">Post 기능구현</h1>
            <form onSubmit={handleSubmit} className="mb-4">
                <input 
                    type="text" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    placeholder="제목을 입력하세요" 
                    className="w-full p-2 border rounded"
                />
                <textarea 
                    value={text} 
                    onChange={(e) => setText(e.target.value)} 
                    placeholder="내용을 입력하세요" 
                    className="w-full p-2 border rounded mt-2"
                />
                <input 
                    type="file" 
                    onChange={(e) => setImage(e.target.files[0])} 
                    className="mt-2"
                />
                <button 
                    type="submit" 
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
                    disabled={uploading}
                >
                    {uploading ? "업로드 중..." : "업로드"}
                </button>
            </form>
            <ul>
                {postData.map((post) => (
                    <li key={post.id} className="border p-4 mb-2 rounded">
                        <p className="text-black font-bold pb-2">{user.name}님</p>
                        <p className="text-gray-900">{post.title}</p>
                        <p className="text-gray-500">{post.text}</p>
                        {post.imageUrl && (
                            <figure className="rounded-xl overflow-hidden mb-2 flex items-center h-[180px] md:h-[240px] lg:h-[320px]">
                                <img 
                                    src={post.imageUrl} 
                                    alt={post.title} 
                                    loading="lazy"
                                    decoding="async"
                                    width="800px"
                                    height="800px"
                                    className="w-full"
                                />
                            </figure>
                        )}
                    </li>
                ))}
            </ul>
        </>
    );
};

export default Post;
