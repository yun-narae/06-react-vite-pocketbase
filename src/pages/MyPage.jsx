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
        </div>
    );
};

export default MyPage;
