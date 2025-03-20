import React, { useEffect } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import pb from "../lib/pocketbase";
import { Navigation } from 'swiper/modules';
import PostEditModal from "./PostEditModal";
import useImageViewer from "../hooks/useImageViewer"; // 🔥 커스텀 훅 추가
import PostImageModal from "./PostImageModal";
import { useNavigate } from "react-router-dom";


const PostItem = ({ 
    user, 
    post, 
    fetchPosts, 
    editPost, 
    setEditPost, 
    editModal, 
    setEditModal, 
    // handleImageClick, // ✅ 부모에서 handleImageClick 전달받음
    isMobile, 
    setIsMobile 
}) => {
    const { selectedImage, setSelectedImage, handleImageClick } = useImageViewer(); // 🔥 커스텀 훅 사용
    const navigate = useNavigate();
    
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 500);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // 🔹 게시물 삭제 함수 (유저와 작성자가 일치하는 경우에만 가능)
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

    // 🔹 게시물 수정 모달 열기
    const handleEdit = (post) => {
        setEditPost(post); 
        setEditModal(true); 
    };

    return (
        <li 
            className="border p-4 mb-2 rounded"
            onClick={() => navigate(`/post/${post.id}`)}
        >
            <p className="font-bold">{post.editor}님</p>
            <p>{post.title}</p>
            <p>{post.text}</p>
            <p className="text-sm text-gray-500">{new Date(post.updated).toISOString().split("T")[0]}</p>
            <p className="text-sm text-blue-500">댓글 {post.commentCount || 0}개</p>
            
            {post.field && Array.isArray(post.field) ? (
                <div>
                    {isMobile ? (
                        <Swiper navigation modules={[Navigation]} className="">
                            {post.field.map((img, index) => (
                                <SwiperSlide key={index}>
                                    <img 
                                        src={`${import.meta.env.VITE_PB_API}/files/${post.collectionId}/${post.id}/${img}`} 
                                        alt={post.title} 
                                        className="aspect-square object-cover rounded cursor-pointer hover:shadow-xl hover:opacity-80"
                                        onClick={() => handleImageClick(img, post, true)} // ✅ 기존 이미지 클릭 시 PostImageModal 실행
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    ) : (
                        <div className="flex space-x-2 bg-blue-400">
                            {post.field.map((img, index) => (
                                <img 
                                    key={index} 
                                    src={`${import.meta.env.VITE_PB_API}/files/${post.collectionId}/${post.id}/${img}`} 
                                    alt={post.title} 
                                    className="w-[32.5%] md:w-[32.8%] aspect-square object-cover rounded cursor-pointer hover:shadow-xl hover:opacity-80" 
                                    onClick={() => handleImageClick(img, post, true)} // ✅ 기존 이미지 클릭 시 PostImageModal 실행
                                />
                            ))}
                        </div>
                    )}
                </div>
            ) : null}

            {post.editor === user.name && (
                <>
                    <button 
                        onClick={() => handleEdit(post)} 
                        className="mt-2 px-2 py-1 bg-yellow-500 text-white rounded">
                        수정
                    </button>
                    <button 
                        onClick={() => handleDelete(post)} 
                        className="ml-2 px-2 py-1 bg-red-500 text-white rounded">
                        삭제
                    </button>
                </>
            )}

            {/* ✅ PostImageModal 추가하여 클릭한 이미지 확대 가능 */}
            {selectedImage && (
                <PostImageModal 
                    selectedImage={selectedImage} 
                    setSelectedImage={setSelectedImage} 
                />
            )}

            {editModal && editPost && (
                <PostEditModal 
                    editPost={editPost} 
                    setEditPost={setEditPost} 
                    setEditModal={setEditModal} 
                    fetchPosts={fetchPosts} 
                />
            )}
        </li>
    );
};

export default PostItem;
