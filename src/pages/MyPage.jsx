import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import pb from "../lib/pocketbase";
import { useUser } from "../context/UserContext";

const MyPage = () => {
    const { userId } = useParams();
    const user = useUser(); // 로그인한 사용자
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [editing, setEditing] = useState(false);
    const [avatar, setAvatar] = useState(null);
    const [nickname, setNickname] = useState("");
    const [userPosts, setUserPosts] = useState([]); // ✅ 내가 작성한 게시글 상태 추가
    const [isNicknameAvailable, setIsNicknameAvailable] = useState(true);
    const [hasCheckedNickname, setHasCheckedNickname] = useState(false); // ✅ 중복확인 버튼 누른 적 있는지
    const [checkingNickname, setCheckingNickname] = useState(false); // ✅ 중복 체크 중 여부
    const [reservedPosts, setReservedPosts] = useState([]); // 예약관련 리스트
    const isMyPage = user?.id === userId; // 로그인한 본인의 마이페이지인지 여부
    
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await pb.collection("users").getOne(userId);
                setProfile(data);
                setNickname(data.name); // name 기반 nickname 기본값
            } catch (err) {
                console.error("유저 정보 불러오기 실패:", err);
            }
        };

        const fetchUserPosts = async () => {
            try {
                const result = await pb.collection("post").getList(1, 50, { // ✅ 1페이지, 50개 불러오기
                    filter: `user = "${userId}"`,
                    expand: "user",
                });
                setUserPosts(result.items);
            } catch (err) {
                console.error("게시물 가져오기 실패:", err);
            }
        };

        if (userId) {
            fetchUser();
            fetchUserPosts();
        }
    }, [userId]);

    useEffect(() => {
        if (editing) {
            // 수정모드 켜졌을 때
            if (profile) {
                setNickname(profile.name);
                setIsNicknameAvailable(false); // 저장 불가능 상태로 초기화
                setCheckingNickname(false);    // 중복확인 중 상태 초기화
                setHasCheckedNickname(false); // 중복확인 여부 초기화
            }
        } else {
            // 수정모드 꺼졌을 때
            setNickname("");
            setIsNicknameAvailable(false);
            setCheckingNickname(false);
        }
    }, [editing, profile]);

    const fetchReservedPosts = async () => {
        const allPosts = await pb.collection("post").getFullList({ expand: "user" });
      
        const filtered = allPosts.filter(post => {
          try {
            const reservations = JSON.parse(post.reservations || "[]");
            return reservations.some(r => r.userId === userId); // 마이페이지 주인 기준!
          } catch {
            return false;
          }
        });
      
        setReservedPosts(filtered);
      };

    useEffect(() => {
        if (userId) fetchReservedPosts();
    }, [userId]);

    const avatarUrl = profile?.avatar
        ? pb.files.getURL(profile, profile.avatar)
        : "https://via.placeholder.com/150";

    if (!profile) return <div>로딩 중...</div>;

    const handlePostClick = (postId) => {
        navigate(`/post/${postId}`);
    };

    // 닉네임 중복 체크
    const handleNicknameCheck = async () => {
        if (nickname.trim() === "") {
            alert("닉네임을 입력해주세요.");
            return;
        }
    
        setCheckingNickname(true);
        setHasCheckedNickname(true); // ✅ 버튼 누르면 true로 변경
        try {
            const result = await pb.collection("users").getList(1, 1, {
                filter: `name = "${nickname}" && id != "${userId}"`,
            });
            if (result.totalItems > 0) {
                setIsNicknameAvailable(false);
            } else {
                setIsNicknameAvailable(true);
            }
        } catch (err) {
            console.error("닉네임 중복 체크 실패:", err);
            setIsNicknameAvailable(false);
        } finally {
            setCheckingNickname(false);
        }
    };
    
    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">{profile.name}님의 마이페이지</h1>
            <img src={avatarUrl} alt="프로필" className="w-32 h-32 rounded-full mb-6" />

            {pb.authStore.model?.id === userId && (
                <>
                    <button onClick={() => setEditing(!editing)} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">
                        {editing ? "수정 취소" : "수정하기"}
                    </button>
                    {editing && (
                        <form
                            onSubmit={async (e) => {
                                e.preventDefault();
                                const formData = new FormData();
                                formData.append("name", nickname); // ✅ 수정
                                if (avatar) formData.append("avatar", avatar);
                                await pb.collection("users").update(userId, formData);
                                alert("수정 완료");
                                location.reload(); // 또는 fetchUser() 호출해서 다시 가져오기
                            }}
                            className="flex flex-col gap-2"
                        >
                            <div className="flex gap-2 items-center">
                                <div className="w-full">
                                    <input
                                        className="w-full border p-2 rounded flex-1"
                                        value={nickname}
                                        onChange={(e) => setNickname(e.target.value)}
                                    />
                                    {hasCheckedNickname && checkingNickname && (
                                        <p className="text-blue-500 text-sm mt-1">닉네임 중복 확인 중...</p>
                                    )}

                                    {hasCheckedNickname && !checkingNickname && !isNicknameAvailable && (
                                        <p className="text-red-500 text-sm mt-1">이미 사용 중인 닉네임입니다.</p>
                                    )}

                                    {hasCheckedNickname && !checkingNickname && isNicknameAvailable && nickname.trim() !== "" && (
                                        <p className="text-green-500 text-sm mt-1">사용 가능한 닉네임입니다.</p>
                                    )}

                                </div>
                                <button
                                    type="button"
                                    onClick={handleNicknameCheck} // ✅ 중복 확인 버튼
                                    className="bg-blue-500 text-white px-4 py-2 rounded"
                                >
                                    중복 확인
                                </button>
                                
                            </div>
                            <input
                                type="file"
                                onChange={(e) => setAvatar(e.target.files[0])}
                            />
                            <button
                                type="submit"
                                className={`px-4 py-2 rounded ${
                                    isNicknameAvailable ? "bg-green-500 text-white" : "bg-gray-400 text-white cursor-not-allowed"
                                }`}
                                disabled={!isNicknameAvailable || nickname.trim() === ""}
                            >
                                저장
                            </button>
                        </form>
                    )}
                </>
            )}

            <h2 className="text-xl font-semibold mt-8 mb-4">작성한 게시글</h2>
            {userPosts.length > 0 ? (
                <ul className="space-y-4">
                    {userPosts.map((post) => (
                        <li
                            key={post.id}
                            onClick={() => handlePostClick(post.id)}
                            className="cursor-pointer border p-4 rounded hover:bg-gray-100"
                        >
                            <h3 className="font-bold text-lg">{post.title}</h3>
                            <p className="text-gray-600">{post.description}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>작성한 게시글이 없습니다.</p>
            )}

            <h2 className="text-xl font-semibold mt-8 mb-4">예약한 모임</h2>
            {reservedPosts.length > 0 ? (
            <ul className="space-y-4">
                {reservedPosts.map((post) => {
                const reservations = JSON.parse(post.reservations || "[]");
                const thisUser = reservations.find(r => r.userId === userId);

                return (
                    <li 
                        key={post.id} 
                        className="border p-4 rounded"
                        onClick={() => navigate(`/post/${post.id}`)}
                    >
                        <h3 className="font-bold text-lg">{post.title}</h3>
                        <p className="text-sm text-gray-600">{post.date} | {post.timeStart} ~ {post.timeEnd}</p>

                        {/* ✅ 현재 로그인 유저가 이 페이지의 유저일 때만 취소 버튼 표시 */}
                        {isMyPage && user?.id === thisUser?.userId && (
                            <button
                            onClick={async (e) => {
                                e.stopPropagation(); // ⭐️ 리스트 클릭 방지
                                const updated = reservations.filter(r => r.userId !== userId);
                                await pb.collection("post").update(post.id, {
                                reservations: JSON.stringify(updated)
                                });
                                alert("예약이 취소되었습니다.");
                                fetchReservedPosts();
                            }}
                            className="mt-2 px-3 py-1 bg-red-500 text-white text-sm rounded"
                            >
                            예약 취소
                            </button>
                        )}
                    </li>
                );
                })}
            </ul>
            ) : (
            <p className="text-gray-500">예약한 모임이 없습니다.</p>
            )}


        </div>
    );
};

export default MyPage;
