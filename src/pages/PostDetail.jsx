import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import pb from "../lib/pocketbase";
import PostImageModal from "./PostImageModal";
import useImageViewer from "../hooks/useImageViewer";
import PostContent from "./PostContent"; // ✅ 공통 컴포넌트 사용
import PostEditModal from "./PostEditModal";
import { useUser } from "../context/UserContext"; // ✅ Context에서 `user` 가져오기
import WrapComments from "./Comments/WrapComments";

const PostDetail = () => {
    const user = useUser(); // ✅ 부모(`UserProvider`)에서 `user` 받아오기
    const { id } = useParams();
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 500);
    const [editPost, setEditPost] = useState(null);
    const [editModal, setEditModal] = useState(false);
    const [post, setPost] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { selectedImage, setSelectedImage, handleImageClick } = useImageViewer();
    const [commentCount, setCommentCount] = useState(0); // ✅ 댓글 수 상태 추가

    useEffect(() => {
        fetchPost();
    }, []);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 500);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // 해당하는 id의 게시물 가져오기
    const fetchPost = async () => {
        try {
            const postData = await pb.collection("post").getOne(id);
            setPost(postData);
        } catch (error) {
            console.error("게시물 로드 실패:", error);
        }
    };

    // 전체 게시물 목록을 업데이트
    const fetchPosts = async () => {
        setIsLoading(true);
        try {
            await pb.collection("post").getFullList({ autoCancel: false });
            setIsLoading(false);
            fetchPost(); // ✅ 목록을 업데이트한 후 현재 게시물을 다시 가져와 최신 데이터 반영
        } catch (error) {
            console.error("게시물 목록 가져오기 실패:", error);
            setIsLoading(false);
        }
    };

    // 게시물 삭제
    const handleDelete = async (post) => {
        if (post.editor !== user.name) {
            alert("삭제할 권한이 없습니다.");
            return;
        }
        if (!window.confirm("정말 삭제하시겠습니까?")) return;

        try {
            await pb.collection("post").delete(post.id);
            fetchPosts(); // ✅ 목록을 업데이트하고 리렌더링
            navigate(-1); // ✅ 삭제 후 목록으로 이동
        } catch (error) {
            console.error("게시물 삭제 실패:", error);
        }
    };

    // 게시물 수정 모달
    const handleEdit = (post) => {
        setEditPost(post); 
        setEditModal(true); 
    };

    if (!post) return <p>게시물을 불러오는 중...</p>;

    return (
        <div className="max-w-2xl mx-auto p-4">
            <button onClick={() => navigate(-1)} className="text-blue-500 mb-4">← 뒤로가기</button>

            {post && (
                <PostContent 
                    post={post} 
                    user={user} 
                    isMobile={isMobile}
                    handleDelete={handleDelete} 
                    handleEdit={handleEdit}
                    handleImageClick={handleImageClick}
                    commentCount={commentCount}
                    onCommentCountChange={setCommentCount}
                />
            )}

            <WrapComments 
                post={post}
                user={user}
                commentCount={commentCount}
                onCommentCountChange={setCommentCount}
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
                    onClick={(e) => e.stopPropagation()}
                    editPost={editPost} 
                    setEditPost={setEditPost} 
                    setEditModal={setEditModal} 
                    fetchPosts={fetchPosts} 
                />
            )}
        </div>
    );
};

export default PostDetail;
