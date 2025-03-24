import React, { useState, useEffect } from "react";
import CommentList from "./CommentList";
import pb from "../../lib/pocketbase";

export default function WrapComments({ user, post, onCommentCountChange }) {
    const [input, setInput] = useState("");
    const [comments, setComments] = useState([]);

    useEffect(() => {
        if (!post?.id) return;
    
        const fetchComments = async () => {
            try {
                const data = await pb.collection("comments").getFullList({
                    filter: `post = "${post.id}"`,
                    sort: "-updated" // 최신순을 위해 정렬
                });
    
                // ✅ 날짜 포맷 변경: updated → YYYY-MM-DD
                data.forEach(comment => {
                    if (comment.updated) {
                        comment.updated = comment.updated.split("T")[0];
                    }
                });
    
                // ✅ 최신순 정렬 (실제 날짜 비교로 안전하게)
                const sorted = data.sort((a, b) => new Date(b.updated) - new Date(a.updated));
    
                setComments(sorted);
                onCommentCountChange?.(sorted.length);
            } catch (err) {
                console.error("댓글 불러오기 실패:", err);
            }
        };
    
        fetchComments();
    }, [post]);
    

    const handleAddComment = async () => {
        if (input.trim() === "") return;
        const newComment = {
            post: post.id,
            username: user.name,
            content: input.trim(),
        };
        try {
            const created = await pb.collection("comments").create(newComment);
            const updated = [created, ...comments];
            setComments(updated);
            onCommentCountChange?.(updated.length);
            setInput("");
        } catch (err) {
            console.error("댓글 추가 실패:", err);
        }
    };

    return (
        <div className="w-full mt-6 border-t-4 border-gray-200">
            <div className="flex gap-2 mt-6 mb-6">
                <input
                    type="text"
                    placeholder="댓글 달기..."
                    className="text-sm w-full p-2 bg-gray-100 border border-slate-400 rounded pl-4"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
                />
                <button
                    className="text-sm break-keep w-[80px] bg-blue-600 text-white rounded hover:bg-blue-800"
                    onClick={handleAddComment}
                >
                    게시
                </button>
            </div>

            <CommentList
                user={user}
                post={post}
                comments={comments}
                setComments={setComments}
                onCommentCountChange={onCommentCountChange}
            />
        </div>
    );
}
