import React, { useState } from 'react';
import pb from '../../lib/pocketbase';

const Comment = ({ comment, user, post, setComments, onCommentCountChange }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [edited, setEdited] = useState(comment.content);

    const handleUpdate = async () => {
        try {
            const updated = await pb.collection("comments").update(comment.id, {
                content: edited
            });
            setComments(prev => prev.map(c => (c.id === comment.id ? updated : c)));
            setIsEditing(false);
        } catch (err) {
            console.error("댓글 수정 실패:", err);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("정말 삭제하시겠습니까?")) return;
        try {
            await pb.collection("comments").delete(comment.id);
            setComments(prev => {
                const updated = prev.filter(c => c.id !== comment.id);
                onCommentCountChange?.(updated.length);
                return updated;
            });
        } catch (err) {
            console.error("댓글 삭제 실패:", err);
        }
    };

    const isOwner = user?.name === comment.username;

    // ✅ 상대 시간 포맷 함수
    const getRelativeTime = (timestamp) => {
        const now = new Date();
        const past = new Date(timestamp);
        const diffMs = now - past;
        const diffSec = Math.floor(diffMs / 1000);
        const diffMin = Math.floor(diffSec / 60);
        const diffHr = Math.floor(diffMin / 60);
        const diffDay = Math.floor(diffHr / 24);

        if (diffSec < 60) return "방금 전";
        if (diffMin < 60) return `${diffMin}분 전`;
        if (diffHr < 24) return `${diffHr}시간 전`;
        if (diffDay < 7) return `${diffDay}일 전`;

        // 그 이상이면 날짜로 출력
        const yyyy = past.getFullYear();
        const mm = String(past.getMonth() + 1).padStart(2, '0');
        const dd = String(past.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    };

    return (
        <li className="border-b-2 border-gray-100 pb-2">
            <div className="mb-1 text-sm flex justify-between items-center">
                <strong>{comment.username}</strong>
                <span className="text-xs text-gray-500">
                    {getRelativeTime(comment.updated)}
                </span>
            </div>

            {isEditing ? (
                <div className="text-sm flex gap-2 mt-2 mb-2">
                    <input
                        type="text"
                        value={edited}
                        onChange={(e) => setEdited(e.target.value)}
                        className="w-full bg-gray-100 border border-gray-200 rounded pl-2"
                    />
                    <div className="flex gap-2">
                        <button 
                            onClick={handleUpdate} 
                            className="p-2 border border-gray-300 text-gray-800 rounded hover:border-gray-500 hover:bg-gray-100 break-keep"
                            >
                                저장
                        </button>
                        <button 
                            onClick={() => setIsEditing(false)} 
                            className="p-2 text-gray-500 hover:text-gray-900 rounded break-keep"
                            >
                                취소
                        </button>
                    </div>
                </div>
            ) : (
                <div>
                    <p className="text-sm text-gray-800 mb-2">{comment.content}</p>
                    {isOwner && (
                        <div className="flex float-right text-gray-600 text-sm">
                            <button 
                                onClick={() => setIsEditing(true)} 
                                className="p-1 hover:text-black break-keep">
                                    수정
                            </button>
                            <p className="p-1">/</p>
                            <button 
                                onClick={handleDelete} 
                                className="p-1 hover:text-black break-keep">
                                삭제
                            </button>
                        </div>
                    )}
                </div>
            )}
        </li>
    );
};

export default Comment;
