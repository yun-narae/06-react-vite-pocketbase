import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import pb from "../lib/pocketbase";

const PostDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");

    useEffect(() => {
        fetchPost();
        fetchComments();
    }, []);

    const fetchPost = async () => {
        try {
            const postData = await pb.collection("post").getOne(id);
            setPost(postData);
        } catch (error) {
            console.error("게시물 로드 실패:", error);
        }
    };

    const fetchComments = async () => {
        try {
            const commentsData = await pb.collection("comments").getFullList({
                filter: `post="${id}"`,
            });
            setComments(commentsData);
        } catch (error) {
            console.error("댓글 로드 실패:", error);
        }
    };

    const handleAddComment = async () => {
        if (!newComment.trim()) return;

        try {
            const newCommentData = await pb.collection("comments").create({
                post: id,
                text: newComment,
            });
            setComments([...comments, newCommentData]);
            setNewComment("");
        } catch (error) {
            console.error("댓글 추가 실패:", error);
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm("댓글을 삭제하시겠습니까?")) return;

        try {
            await pb.collection("comments").delete(commentId);
            setComments(comments.filter((c) => c.id !== commentId));
        } catch (error) {
            console.error("댓글 삭제 실패:", error);
        }
    };

    if (!post) return <p>게시물을 불러오는 중...</p>;

    return (
        <div className="max-w-2xl mx-auto p-4">
            <button onClick={() => navigate(-1)} className="text-blue-500 mb-4">← 뒤로가기</button>
            <h2 className="text-xl font-bold">{post.title}</h2>
            <p className="text-gray-700">{post.text}</p>

            <div className="mt-6">
                <h3 className="text-lg font-bold">댓글 ({comments.length})</h3>
                <div className="mt-2">
                    {comments.map((comment) => (
                        <div key={comment.id} className="border p-2 mt-2 flex justify-between">
                            <p>{comment.text}</p>
                            <button onClick={() => handleDeleteComment(comment.id)} className="text-red-500">삭제</button>
                        </div>
                    ))}
                </div>
                <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="댓글을 입력하세요"
                    className="w-full p-2 border mt-2"
                />
                <button onClick={handleAddComment} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">댓글 작성</button>
            </div>
        </div>
    );
};

export default PostDetail;
