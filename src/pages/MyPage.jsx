import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import pb from "../lib/pocketbase";

const MyPage = () => {
    const { userId } = useParams();
    const [profile, setProfile] = useState(null);
    const [editing, setEditing] = useState(false);
    const [avatar, setAvatar] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await pb.collection("users").getOne(userId); // ✅ 이걸 기준으로 가져와야 함
                setProfile(data);
            } catch (err) {
                console.error("유저 정보 불러오기 실패:", err);
            }
        };

        if (userId) fetchUser();
    }, [userId]);

    const avatarUrl = profile?.avatar
        ? pb.files.getURL(profile, profile.avatar)
        : "https://via.placeholder.com/150";

    if (!profile) return <div>로딩 중...</div>;

    return (
        <div>
            <h1>{profile.name}님의 마이페이지</h1>
            <img src={avatarUrl} alt="프로필" className="w-32 h-32 rounded-full" />

            {/* 로그인 유저와 비교 후 수정 기능 */}
            {pb.authStore.model?.id === userId && (
                <>
                    <button onClick={() => setEditing(!editing)}>수정하기</button>
                    {editing && (
                        <form
                            onSubmit={async (e) => {
                                e.preventDefault();
                                const formData = new FormData();
                                formData.append("nickname", nickname);
                                if (avatar) formData.append("avatar", avatar);
                                await pb.collection("users").update(userId, formData);
                                alert("수정 완료");
                                location.reload(); // 또는 상태 갱신
                            }}
                        >
                            <input value={nickname} onChange={(e) => setNickname(e.target.value)} />
                            <input type="file" onChange={(e) => setAvatar(e.target.files[0])} />
                            <button type="submit">저장</button>
                        </form>
                    )}
                </>
            )}
        </div>
    );
};

export default MyPage;
