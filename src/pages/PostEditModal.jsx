import React, { useState, useRef } from "react";
import pb from "../lib/pocketbase";
import useImageViewer from "../hooks/useImageViewer"; // 🔥 커스텀 훅 추가
import PostImageModal from "./PostImageModal";

const PostEditModal = ({ onClick, editPost, setEditPost, setEditModal, fetchPosts }) => {
    const fileInputRef = useRef(null);
    const [title, setTitle] = useState(editPost.title);
    const [description, setDescription] = useState(editPost.description);
    const [postImgs, setPostImgs] = useState([]);
    const [previewImgs, setPreviewImgs] = useState([]);
    const [uploading, setUploading] = useState(false);
    const { selectedImage, setSelectedImage, handleImageClick } = useImageViewer(); // 🔥 커스텀 훅 사용

    // 🔹 파일 업로드 핸들러
    const uploadFiles = (e) => {
        const files = Array.from(e.target.files);
        if ((editPost?.images?.length || 0) + postImgs.length + files.length > 3) {
            alert("업로드 이미지 개수를 초과하였습니다. (최대 3개)");
            return;
        }
        const newPreviewImgs = files.map(file => URL.createObjectURL(file));
        setPostImgs(prev => [...prev, ...files].slice(0, 3 - (editPost?.images?.length || 0)));
        setPreviewImgs(prev => [...prev, ...newPreviewImgs].slice(0, 3 - (editPost?.images?.length || 0)));

        // ✅ 파일 선택 후 `input` 값 초기화
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // 🔹 파일 선택 버튼 클릭 시 파일 입력 창 열기
    const handleFileButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    // 🔹 미리보기 이미지 삭제 핸들러
    const removePreviewImage = (index) => {
        setPreviewImgs(prev => prev.filter((_, i) => i !== index));
        setPostImgs(prev => prev.filter((_, i) => i !== index));
    };

    // 🔹 기존 이미지 삭제 핸들러
    const removeExistingImage = (index) => {
        if (editPost.images.length <= 1) {
            alert("최소 1개의 이미지는 있어야 합니다.");
            return;
        }
        const updatedImages = editPost.images.filter((_, i) => i !== index);
        setEditPost({ ...editPost, images: updatedImages });
    };

    // 🔹 게시물 수정 핸들러
    const handleUpdate = async (e) => {
        e.preventDefault();
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("description", description);

            // ✅ 기존 이미지 추가
            if (editPost.images) {
                editPost.images.forEach((img) => formData.append("images", img));
            }

            // ✅ 새로운 이미지 추가
            postImgs.forEach((img) => formData.append("images", img));

            await pb.collection("post").update(editPost.id, formData);

            console.log("수정 완료되었습니다!");
            fetchPosts();
            setEditModal(false);
        } catch (error) {
            console.error("게시물 수정 실패:", error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div 
            onClick={onClick}
            className="fixed inset-0 bg-gray-800 bg-opacity-10 flex justify-center items-center z-10"
        >
            <div className="bg-white p-4 rounded shadow-lg w-96">
                <h2 className="text-lg font-bold">게시물 수정</h2>
                <form onSubmit={handleUpdate} className="mt-4">
                    <input 
                        type="text" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        placeholder="제목 입력" 
                        className="w-full p-2 border rounded"
                    />
                    <textarea 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)} 
                        placeholder="내용 입력" 
                        className="w-full p-2 border rounded mt-2"
                    />

                    {/* ✅ 파일 입력 필드 */}
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={uploadFiles} 
                        hidden // ✅ 완전히 숨김
                        multiple 
                        accept="image/*" 
                    />
                    <button 
                        type="button" 
                        onClick={handleFileButtonClick} 
                        className="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600 mt-2"
                    >
                        파일 선택
                    </button>

                    {/* ✅ 기존 이미지 미리보기 */}
                    <div className="mt-2 flex space-x-2">
                        {editPost?.images?.map((img, index) => (
                            <div key={index} className="relative">
                                <img
                                    src={`${import.meta.env.VITE_PB_API}/files/${editPost.collectionId}/${editPost.id}/${img}`} 
                                    alt="기존 이미지"
                                    className="w-20 h-20 object-cover rounded cursor-pointer hover:shadow-xl hover:opacity-80"
                                    onClick={() => handleImageClick(img, editPost, true)}
                                />
                                <button 
                                    type="button"
                                    onClick={() => removeExistingImage(index)} 
                                    className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                                >
                                    X
                                </button>
                            </div>
                        ))}
                        {/* ✅ 새로운 업로드 이미지 미리보기 */}
                        {previewImgs.map((img, index) => (
                            <div key={index} className="relative">
                                <img 
                                    src={img} 
                                    alt="미리보기" 
                                    onClick={() => handleImageClick(img, null, false)}
                                    className="w-20 h-20 object-cover rounded cursor-pointer hover:shadow-xl hover:opacity-80"
                                />
                                <button 
                                    type="button"
                                    onClick={() => removePreviewImage(index)} 
                                    className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                                >
                                    X
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* ✅ 수정 버튼 */}
                    <button 
                        type="submit"
                        className="mt-4 px-4 py-2 w-full bg-green-500 text-white rounded hover:bg-green-600"
                        disabled={uploading}
                    >
                        {uploading ? "업로드 중..." : "수정 완료"}
                    </button>

                    {/* ✅ 취소 버튼 */}
                    <button 
                        type="button"
                        onClick={() => setEditModal(false)} 
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

export default PostEditModal;
