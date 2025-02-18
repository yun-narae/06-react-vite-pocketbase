import React, { useEffect, useState, useRef } from "react";
import pb from "../lib/pocketbase";
import getPbImageURL from "../lib/getPbImageURL";

const Post = ({ isLoggedIn, isDarkMode, setDarkMode, isLoading, setIsLoading }) => {
    const user = pb.authStore.model;
    const fileInputRef = useRef(null);
    const [postData, setPostData] = useState([]);
    const [title, setTitle] = useState("");
    const [text, setText] = useState("");
    const [postImg, setPostImg] = useState(null);
    const [previewImg, setPreviewImg] = useState(null);
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
            const posts = await pb.collection("post").getFullList({ autoCancel: false, expand: "field" });
            setPostData(posts);
        } catch (error) {
            console.error("Error fetching posts:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // 파일 업로드 및 미리보기 설정
    const uploadFile = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setPostImg(file);
        setPreviewImg(URL.createObjectURL(file));
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
            if (postImg) {
                formData.append("field", postImg);
            }
            await pb.collection("post").create(formData);
            fetchPosts();
            setTitle("");
            setText("");
            setPostImg(null);
            setPreviewImg(null);
        } catch (error) {
            console.error("게시물 업로드 실패:", error);
        } finally {
            setUploading(false);
        }
    };

    // 게시물 삭제 함수
    const handleDelete = async (post) => {
        if (post.editor !== user.name) {
            alert("삭제할 권한이 없습니다.");
            return;
        }
        if (!window.confirm("정말 삭제하시겠습니까?")) return;

        try {
            await pb.collection("post").delete(post.id);
            fetchPosts();
        } catch (error) {
            console.error("게시물 삭제 실패:", error);
        }
    };

    // 게시물 수정 모달 열기
    const handleEdit = (post) => {
        if (post.editor !== user.name) {
            alert("수정할 권한이 없습니다.");
            return;
        }
        setEditPost(post);
        setTitle(post.title);
        setText(post.text);
        setPreviewImg(post.field ? getPbImageURL(post, "field") : null);
        setShowModal(true);
    };

    // 게시물 수정 함수
    const handleUpdate = async () => {
        if (!editPost) return;
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("text", text);
            if (postImg) {
                formData.append("field", postImg);
            }
            await pb.collection("post").update(editPost.id, formData);
            fetchPosts();
            setShowModal(false);
        } catch (error) {
            console.error("게시물 수정 실패:", error);
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
                <input type="file" ref={fileInputRef} onChange={uploadFile} className="mt-2" />
                {previewImg && <img src={previewImg} alt="미리보기" className="w-20 h-20 object-cover rounded mt-2" />}
                <button type="submit" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400" disabled={uploading}>{uploading ? "업로드 중..." : "업로드"}</button>
            </form>
            {/* 게시물 리스트 */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-4 rounded shadow-lg">
                        <h2>게시물 수정</h2>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 border rounded" />
                        <textarea value={text} onChange={(e) => setText(e.target.value)} className="w-full p-2 border rounded mt-2" />
                        <button onClick={handleUpdate} className="mt-4 px-4 py-2 bg-green-500 text-white rounded">수정 완료</button>
                        <button onClick={() => setShowModal(false)} className="ml-2 px-4 py-2 bg-gray-500 text-white rounded">취소</button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Post;
