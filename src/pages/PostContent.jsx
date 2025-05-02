import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import ReserveModal from "./ReserveModal";
import pb from "../lib/pocketbase";

const PostContent = ({
  avatarUrl,
  commentCount,
  user,
  post,
  handleImageClick,
  isMobile,
  handleDelete,
  handleEdit,
  fetchPosts,
  showReservationsList,
}) => {
  const navigate = useNavigate();
  const [showReserveModal, setShowReserveModal] = useState(false);

  const reservedUsers = (() => {
    try {
      return post.reservations ? JSON.parse(post.reservations) : [];
    } catch {
      return [];
    }
  })();

  const daysLeft = Math.ceil((new Date(post.date) - new Date()) / (1000 * 60 * 60 * 24));
  const isDateClosingSoon = daysLeft > 0 && daysLeft <= 3;

  const reservedCount = reservedUsers.reduce((sum, r) => sum + r.count, 0);
  const isClosed = new Date(post.date) < new Date() || reservedCount >= Number(post.capacity);
  const remainingSpots = Number(post.capacity) - reservedCount;
  const isSpotsFew = remainingSpots <= Number(post.capacity) / 3;

  const isClosingSoon = !isClosed && (isDateClosingSoon || isSpotsFew);

  const getAvatarUrl = (userId, avatar) => {
    if (!avatar) return "https://via.placeholder.com/40";
    return `${pb.baseUrl}/api/files/users/${userId}/${avatar}`;
  };

  const getImageUrl = (image) => {
    return `${import.meta.env.VITE_PB_URL}/api/files/${post.collectionId}/${post.id}/${image}`;
  };

  return (
    <div>
      {/* 상단 정보 */}
      <div className="border-b-2 flex items-center justify-between pb-2">
        <Link to={`/mypage/${post.expand?.user?.id}`} className="text-gray-500 flex font-bold items-center">
          <img src={avatarUrl} alt="프로필" className="w-8 h-8 rounded-full mr-1" />
          <b className="whitespace-nowrap">{post.expand?.user?.name}님</b>
        </Link>
        <div className="flex items-center gap-1">
          {isClosingSoon && (
            <p className="text-xs px-2 py-1 text-white bg-orange-500 rounded-md">마감 임박</p>
          )}
          {isClosed ? (
            <p className="text-xs px-2 py-1 text-white bg-gray-500 rounded-md whitespace-nowrap">모집 마감</p>
          ) : (
            <p className="text-xs px-2 py-1 text-white bg-blue-500 rounded-md whitespace-nowrap">모집중</p>
          )}
        </div>
      </div>

      {/* 본문 */}
      <div onClick={() => navigate(`/post/${post.id}`)}>
        <div className="mb-2">
          <h2 className="text-xl font-bold">{post.title}</h2>
          <p className="text-gray-700 mb-2">{post.description}</p>
          <p className="text-sm text-gray-500">
            {new Date(post.updated).toISOString().split("T")[0]}
          </p>
        </div>

        {/* 이미지 */}
        {post.images && Array.isArray(post.images) && post.images.length > 0 && (
          isMobile ? (
            <Swiper navigation modules={[Navigation]}>
              {post.images.map((img, i) => (
                <SwiperSlide key={i}>
                  <img
                    src={getImageUrl(img)}
                    alt={post.title}
                    className="aspect-square object-cover rounded cursor-pointer hover:shadow-xl hover:opacity-80"
                    onClick={() => handleImageClick(img, post, true)}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="flex space-x-2">
              {post.images.map((img, i) => (
                <img
                  key={i}
                  src={getImageUrl(img)}
                  alt={post.title}
                  className="w-[32.5%] md:w-[32.8%] aspect-square object-cover rounded cursor-pointer hover:shadow-xl hover:opacity-80"
                  onClick={() => handleImageClick(img, post, true)}
                />
              ))}
            </div>
          )
        )}
      </div>

      {/* 댓글 수 및 수정/삭제 버튼 */}
      <div className="flex justify-between items-center mb-3">
        <p className="font-bold text-xs text-gray-500 mt-2">댓글 ({commentCount}개)</p>
        {post && user && post.editor === user.name && (
          <div>
            <button
              onClick={() => handleEdit(post)}
              className="text-xs px-2 py-1 mt-2 bg-yellow-500 text-white rounded"
            >
              수정
            </button>
            <button
              onClick={() => handleDelete(post)}
              className="text-xs px-2 py-1 ml-2 bg-red-500 text-white rounded"
            >
              삭제
            </button>
          </div>
        )}
      </div>

      {/* 예약 영역 */}
      <div className="flex items-center justify-end">
        <p className="text-xs mr-2">{reservedCount} / {post.capacity}</p>
        {!isClosed && user?.id !== post.expand?.user?.id && (
          <button
            onClick={() => setShowReserveModal(true)}
            className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
          >
            예약하기
          </button>
        )}
        {showReserveModal && (
          <ReserveModal
            post={post}
            fetchPosts={fetchPosts}
            onClose={() => setShowReserveModal(false)}
          />
        )}
      </div>

      {/* 예약자 리스트 */}
      {showReservationsList && reservedUsers.length > 0 && (
        <div className="mt-4">
          <b className="block mb-2">현재 예약한 인원들</b>
          <ul className="flex flex-wrap gap-2">
            {reservedUsers.map((r, i) => (
              <li key={i} className="text-gray-500 flex items-center text-xs">
                <img
                  src={getAvatarUrl(r.userId, r.avatar)}
                  alt={r.name}
                  className="w-6 h-6 rounded-full mr-1"
                />
                <span className="font-bold">{r.name}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PostContent;
