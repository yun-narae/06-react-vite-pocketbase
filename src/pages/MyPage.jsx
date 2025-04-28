import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import pb from "../lib/pocketbase";

const MyPage = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [editing, setEditing] = useState(false);
    const [avatar, setAvatar] = useState(null);
    const [nickname, setNickname] = useState(""); // ✅ nickname 추가
    const [userPosts, setUserPosts] = useState([]); // ✅ 내가 작성한 게시글 상태 추가

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

    const avatarUrl = profile?.avatar
        ? pb.files.getURL(profile, profile.avatar)
        : "https://via.placeholder.com/150";

    if (!profile) return <div>로딩 중...</div>;

    const handlePostClick = (postId) => {
        navigate(`/post/${postId}`);
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
                            <input
                                className="border p-2 rounded"
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                            />
                            <input
                                type="file"
                                onChange={(e) => setAvatar(e.target.files[0])}
                            />
                            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
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
        </div>
    );
};

export default MyPage;
