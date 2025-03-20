import React, { useEffect } from "react";
import pb from "../lib/pocketbase";
import { Navigation } from 'swiper/modules';
import PostEditModal from "./PostEditModal";
import useImageViewer from "../hooks/useImageViewer"; // 🔥 커스텀 훅 추가
import PostImageModal from "./PostImageModal";
import { useNavigate } from "react-router-dom";
import PostContent from "./PostContent";

const PostItem = ({ 
    user, 
    post, 
    fetchPosts, 
    editPost, 
    setEditPost, 
    editModal, 
    setEditModal, 
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
            className="border p-4 mb-2 rounded cursor-pointer hover:bg-slate-100"
            onClick={() => navigate(`/post/${post.id}`)} // ✅ `state`로 값 전달
        >
            <PostContent 
                onClick={(e) => e.stopPropagation()} /* ✅ 부모 이벤트 방지 적용 */
                post={post} 
                user={user} 
                isMobile={isMobile}
                handleDelete={handleDelete} 
                handleEdit={handleEdit}
                handleImageClick={handleImageClick}
            />

            {/* ✅ PostImageModal 추가하여 클릭한 이미지 확대 가능 */}
            {selectedImage && (
                <PostImageModal 
                    selectedImage={selectedImage} 
                    setSelectedImage={setSelectedImage} 
                />
            )}

            {editModal && editPost && (
                <PostEditModal 
                    onClick={(e) => e.stopPropagation()} /* ✅ 부모 이벤트 방지 적용 */
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
