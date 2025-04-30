import React, { useState } from "react";
import pb from "../lib/pocketbase";
import { useUser } from "../context/UserContext";

const ReserveModal = ({ post, onClose, fetchPosts }) => {
  const user = useUser();
  const [loading, setLoading] = useState(false);

  const handleReserve = async () => {
    if (!user) return alert("로그인이 필요합니다");

    let existing = [];
    try {
      existing = post.reservations ? JSON.parse(post.reservations) : [];
    } catch {
      existing = [];
    }

    const alreadyReserved = existing.find((r) => r.userId === user.id);
    if (alreadyReserved) return alert("이미 예약한 모임입니다");

    const reservedCount = existing.reduce((sum, r) => sum + r.count, 0);
    if (reservedCount + 1 > Number(post.capacity)) {
      return alert("모집 인원을 초과했습니다");
    }

    const newReservations = [...existing, {
      name: user.name,
      userId: user.id,
      count: 1,
    }];

    setLoading(true);
    try {
        await pb.collection("post").update(post.id, {
            reservations: JSON.stringify(newReservations),
        });
        alert("예약 완료!");
        if (fetchPosts) fetchPosts();
        onClose();
    } catch (err) {
        console.error("예약 실패:", err);
        alert("예약에 실패했습니다");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded p-6 w-80">
        <h2 className="text-xl font-bold mb-4">모임 예약</h2>

        {/* post 정보 출력 */}
        <div className="text-sm text-gray-700 mb-4 space-y-1">
          <p><b>날짜:</b> {post.date}</p>
          <p><b>시간:</b> {post.timeStart} ~ {post.timeEnd}</p>
          <p><b>장소:</b> {post.location}</p>
          <p><b>정원:</b> {post.capacity}명</p>
          <p><b>참가비:</b> {post.fee}원</p>
        </div>

        <button
          onClick={handleReserve}
          disabled={loading}
          className="w-full bg-green-500 text-white py-2 rounded mb-2"
        >
          {loading ? "예약 중..." : "예약하기"}
        </button>
        <button
          onClick={onClose}
          className="w-full bg-gray-400 text-white py-2 rounded"
        >
          닫기
        </button>
      </div>
    </div>
  );
};

export default ReserveModal;