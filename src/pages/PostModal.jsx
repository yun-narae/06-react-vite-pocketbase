import React, { useState, useRef } from "react";
import pb from "../lib/pocketbase";
import PostImageModal from "./PostImageModal";
import useImageViewer from "../hooks/useImageViewer"; // 🔥 커스텀 훅 추가
import { useUser } from "../context/UserContext"; // ✅ Context에서 `user` 가져오기

const PostModal = ({ post, setShowForm, fetchPosts }) => {
    const user = useUser(); // ✅ 부모(`UserProvider`)에서 `user` 받아오기
    const fileInputRef = useRef(null);
    const [title, setTitle] = useState(post ? post.title : "");
    const [text, setText] = useState(post ? post.text : "");
    const [postImgs, setPostImgs] = useState([]);
    const [previewImgs, setPreviewImgs] = useState([]);
    const [uploading, setUploading] = useState(false);
    const { selectedImage, setSelectedImage, handleImageClick } = useImageViewer();


    const uploadFiles = (e) => {
        const files = Array.from(e.target.files);
        if ((post?.field?.length || 0) + postImgs.length + files.length > 3) {
            alert("업로드 이미지 개수를 초과하였습니다. (최대 3개)");
            return;
        }
        const newPreviewImgs = files.map(file => URL.createObjectURL(file));
        setPostImgs(prev => [...prev, ...files].slice(0, 3));
        setPreviewImgs(prev => [...prev, ...newPreviewImgs].slice(0, 3));
    };

    const removePreviewImage = (index) => {
        setPreviewImgs(prev => prev.filter((_, i) => i !== index));
        setPostImgs(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !text || postImgs.length === 0 || !user) {
            alert("제목, 내용, 이미지를 모두 입력해주세요.");
            return;
        }
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("text", text);
            formData.append("editor", user.name);
            formData.append("user", user.id);
            formData.append("updated", new Date().toISOString().split("T")[0]);

            postImgs.forEach((img) => formData.append("field", img));

            if (post) {
                await pb.collection("post").update(post.id, formData);
            } else {
                await pb.collection("post").create(formData);
            }

            fetchPosts();
            setShowForm(false);
        } catch (error) {
            console.error("게시물 저장 실패:", error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="z-10 p-4 fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-4 rounded shadow-lg w-96">
                <h2 className="text-lg font-bold">게시물 작성</h2>
                <form onSubmit={handleSubmit} className="mt-4">
                    <input 
                        type="text" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        placeholder="제목 입력" 
                        className="w-full p-2 border rounded"
                    />
                    <textarea 
                        value={text} 
                        onChange={(e) => setText(e.target.value)} 
                        placeholder="내용 입력" 
                        className="w-full p-2 border rounded mt-2"
                    />
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={uploadFiles} 
                        className="opacity-0 absolute w-0 h-0" // ✅ 파일 입력 필드 숨김 (하지만 클릭 가능)
                        multiple 
                        accept="image/*" 
                        id="fileUpload"
                    />
                    <label 
                        htmlFor="fileUpload" 
                        className="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600 inline-block"
                    >
                        파일 선택
                    </label>

                    {/* 업로드한 이미지 미리보기 */}
                    <div className="mt-2 flex space-x-2">
                        {previewImgs.map((img, index) => (
                            <div key={index} className="relative">
                                <img 
                                    src={img} 
                                    alt="미리보기" 
                                    onClick={() => handleImageClick(img, post, true)} // ✅ 기존 이미지 클릭 시 PostImageModal 실행
                                    className="w-20 h-20 object-cover rounded cursor-pointer hover:shadow-xl hover:opacity-80"
                                />
                                <button 
                                    type="button"
                                    onClick={() => removePreviewImage(index)} 
                                    className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full">X
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* ✅ 작성하기 & 취소 버튼 추가 */}
                    <button 
                        type="submit" 
                        className={`mt-4 px-4 py-2 rounded w-full ${
                            title && text && postImgs.length > 0 ? "bg-green-500 text-white hover:bg-green-600" : "bg-gray-400 text-gray-200 cursor-not-allowed"
                        }`} 
                        disabled={!title || !text || postImgs.length === 0 || uploading}
                    >
                        {uploading ? "업로드 중..." : "게시하기"}
                    </button>
                    <button 
                        type="button" 
                        onClick={() => setShowForm(false)} 
                        className="mt-2 px-4 py-2 bg-gray-500 text-white rounded w-full"
                    >
                        취소
                    </button>
                </form>
            </div>

            {/* ✅ PostImageModal 추가하여 클릭한 이미지 확대 가능 */}
            {selectedImage && (
                <PostImageModal 
                    selectedImage={selectedImage} 
                    setSelectedImage={setSelectedImage} 
                />
            )}
        </div>
    );
};

export default PostModal;
