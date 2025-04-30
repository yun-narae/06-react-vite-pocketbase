import React, { useEffect, useState } from "react";
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
    const [commentCount, setCommentCount] = useState(0); // ✅ 댓글 개수 상태
    
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 500);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // ✅ 댓글 개수 가져오기
    useEffect(() => {
        const fetchCommentCount = async () => {
            try {
                const res = await pb.collection("comments").getList(1, 1, {
                    filter: `post = "${post.id}"`,
                    skipTotal: false,
                });
                setCommentCount(res.totalItems);
            } catch (err) {
                console.error("댓글 개수 불러오기 실패:", err);
            }
        };

        if (post?.id) fetchCommentCount();
    }, [post.id]);

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

    const avatarUrl = post?.expand?.user?.avatar
    ? pb.files.getURL(post.expand.user, post.expand.user.avatar)
    : "https://via.placeholder.com/150";

    return (
        <li 
            className="border p-4 mb-2 rounded cursor-pointer hover:bg-slate-100"
        >
            <PostContent 
                onClick={(e) => e.stopPropagation()} /* ✅ 부모 이벤트 방지 적용 */
                post={post} 
                user={user} 
                isMobile={isMobile}
                handleDelete={handleDelete} 
                handleEdit={handleEdit}
                handleImageClick={handleImageClick}
                commentCount={commentCount}
                avatarUrl={avatarUrl}
                fetchPosts={fetchPosts}
                showReservationsList={false} // ❌ 예약자 목록 숨김
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
