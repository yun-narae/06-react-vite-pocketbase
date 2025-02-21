import React, { useEffect, useState, useRef } from "react";
import pb from "../lib/pocketbase";
import getPbImageURL from "../lib/getPbImageURL";

const Post = ({ isLoggedIn, isDarkMode, setDarkMode, isLoading, setIsLoading }) => {
    const user = pb.authStore.model;
    const fileInputRef = useRef(null);
    const [postData, setPostData] = useState([]);
    const [title, setTitle] = useState("");
    const [text, setText] = useState("");
    const [postImgs, setPostImgs] = useState([]);
    const [previewImgs, setPreviewImgs] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [editPost, setEditPost] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchPosts();
    }, []);

    // 게시물 목록을 가져오는 함수
    const fetchPosts = async () => {
        setIsLoading(true);
        try {
            const posts = await pb.collection("post").getFullList({ autoCancel: false });
            setPostData(posts);
        } catch (error) {
            console.error("Error fetching posts:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // 최대 3개의 파일 업로드 및 미리보기 설정
    const uploadFiles = (e) => {
        const files = Array.from(e.target.files).slice(0, 3);
        setPostImgs(files);
        
        let fileUrl = [];
        files.forEach((file, i) => {
            let fileRead = new FileReader();
            fileRead.onload = function (event) {
                fileUrl.push(event.target.result);
                setPreviewImgs([...fileUrl]);
            };
            fileRead.readAsDataURL(file);
        });
    };

    // 새 게시물 업로드 함수
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
            formData.append("editor", user.name);
            formData.append("user", user.id);
            postImgs.forEach((img) => formData.append("field", img));
            await pb.collection("post").create(formData);
            fetchPosts();
            setTitle("");
            setText("");
            setPostImgs([]);
            setPreviewImgs([]);
        } catch (error) {
            console.error("게시물 업로드 실패:", error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <>
            <h1 className="text-2xl pb-4 dark:text-white">Post 기능구현</h1>
            {/* 게시물 작성 폼 */}
            <form onSubmit={handleSubmit} className="mb-4">
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="제목을 입력하세요" className="w-full p-2 border rounded" />
                <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="내용을 입력하세요" className="w-full p-2 border rounded mt-2" />
                <input type="file" ref={fileInputRef} onChange={uploadFiles} className="mt-2" multiple accept="image/*" />
                <div className="mt-2 flex space-x-2">
                    {previewImgs.map((img, index) => (
                        <div key={index} className="relative -z-10">
                            <img src={img} alt="미리보기" className="w-20 h-20 object-cover rounded" />
                        </div>
                    ))}
                </div>
                <button type="submit" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400" disabled={uploading}>{uploading ? "업로드 중..." : "업로드"}</button>
            </form>
            {/* 게시물 목록 */}
            <ul className="mt-4">
                {postData.map((post) => (
                    <li key={post.id} className="border p-4 mb-2 rounded">
                        <p>{post.editor}님</p>
                        <p>{post.title}</p>
                        <p>{post.text}</p>
                        {post.field && Array.isArray(post.field) ? (
                            <div className="flex space-x-2">
                                {post.field.map((img, index) => (
                                    <img key={index} src={`${import.meta.env.VITE_PB_API}/files/${post.collectionId}/${post.id}/${img}`} alt={post.title} className="w-40 h-40 object-cover rounded" />
                                ))}
                            </div>
                        ) : null}
                        {post.editor === user.name && (
                            <>
                                <button onClick={() => handleEdit(post)} className="mt-2 px-2 py-1 bg-yellow-500 text-white rounded">수정</button>
                                <button onClick={() => handleDelete(post)} className="ml-2 px-2 py-1 bg-red-500 text-white rounded">삭제</button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </>
    );
};

export default Post;
