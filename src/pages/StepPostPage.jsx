import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import PostImageModal from "./PostImageModal";
import useImageViewer from "../hooks/useImageViewer";
import { useUser } from "../context/UserContext";
import pb from "../lib/pocketbase";
import useImageCompressor from "../hooks/useImageCompressor";

const steps = [
    "title", "category", "description", "location", "date", "capacity", "fee", "images", "preview"
];

const StepPostPage = ({ post }) => {
    const user = useUser();
    const STORAGE_KEY = `stepPostData_${user.id}`;
    const navigate = useNavigate();
    const [step, setStep] = useState(0);
    const { selectedImage, setSelectedImage, handleImageClick } = useImageViewer();
    const saved = localStorage.getItem(STORAGE_KEY);
    const [hasChoice, setHasChoice] = useState(!!saved);
    const parsed = saved ? JSON.parse(saved) : null;
    const [formData, setFormData] = useState(() => {
    if (parsed?.formData) {
        return {
            title: parsed.formData.title || "",
            category: Array.isArray(parsed.formData.category) ? parsed.formData.category : [],
            description: parsed.formData.description || "",
            location: parsed.formData.location || "",
            date: parsed.formData.date || "",
            timeStart: parsed.formData.timeStart || "",
            timeEnd: parsed.formData.timeEnd || "",
            capacity: parsed.formData.capacity || "",
            fee: parsed.formData.fee || "",
            images: Array.isArray(parsed.formData.images) ? parsed.formData.images : []
        };
    }
        return {
            title: "",
            category: [],
            description: "",
            location: "",
            date: "",
            timeStart: "",
            timeEnd: "",
            capacity: "",
            fee: "",
            images: []
        };
    });
    const [postImgs, setPostImgs] = useState(() => parsed?.formData?.images?.map(name => ({ name })) || []);
    const [previewImgs, setPreviewImgs] = useState(() => parsed?.previewImgs || []);
    const fileInputRef = useRef(null);
    const [errors, setErrors] = useState({});
    const [isManualSave, setIsManualSave] = useState(false); // 임시저장 버튼
    const { compressImages } = useImageCompressor();

    // 포켓베이스
    const handleSubmitPost = async () => {
        try {
          const form = new FormData();
      
          // 필수 텍스트 필드
          form.append("title", formData.title.trim());
          form.append("description", formData.description.trim());
          form.append("location", formData.location.trim());
          form.append("date", formData.date);
          form.append("timeStart", formData.timeStart);
          form.append("timeEnd", formData.timeEnd);
      
          // 숫자 필드 → 문자열로 변환
          form.append("capacity", String(Number(formData.capacity)));
          form.append("fee", String(Number(formData.fee)));
      
          // 유저 정보
          if (!user || !user.id || !user.name) {
            alert("로그인이 필요합니다.");
            return;
          }
          form.append("user", user.id);
          form.append("editor", user.name);
      
          // 카테고리 문자열
          const categoryStr = formData.category.join(",");
          if (!categoryStr) {
            alert("카테고리를 선택해주세요.");
            return;
          }
          form.append("category", categoryStr);
      
          // 이미지 1개 이상 필수
          const validFiles = postImgs.filter(file => file instanceof File);
          if (validFiles.length === 0) {
            alert("이미지를 1개 이상 업로드해주세요.");
            return;
          }
      
          validFiles.forEach((file) => {
            form.append("images", file);
          });
      
          await pb.collection("post").create(form);
          localStorage.removeItem(STORAGE_KEY);
          alert("게시물이 등록되었습니다!");
          navigate("/post");
        } catch (err) {
          console.error("게시물 등록 실패", err);
          alert("게시물 등록에 실패했습니다. 다시 시도해주세요.");
        }
    };
      

    const handleManualSave = () => {
        const serializedImages = postImgs.map(file => file.name);
        const formDataToSave = { ...formData, images: serializedImages };
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ formData: formDataToSave, previewImgs }));
        setIsManualSave(true);
        alert("임시 저장되었습니다.");
    };

    // 페이지 이탈 감지 및 저장 여부 확인 조건
    useEffect(() => {
        const isFormTouched = () => {
            return (
                formData.title.trim() !== "" ||
                formData.description.trim() !== "" ||
                formData.category.length > 0 ||
                formData.location.trim() !== "" ||
                formData.date !== "" ||
                formData.timeStart !== "" ||
                formData.timeEnd !== "" ||
                formData.capacity.trim() !== "" ||
                formData.fee.trim() !== "" ||
                previewImgs.length > 0
            );
        };
    
        const handleBeforeUnload = (e) => {
            if (!isManualSave && isFormTouched()) {
                e.preventDefault();
                e.returnValue = "";
            }
        };
    
        const handleRouteChange = () => {
            if (!isManualSave && isFormTouched()) {
                const confirmLeave = window.confirm("임시 저장 하시겠습니까?");
                if (confirmLeave) handleManualSave();
                else localStorage.removeItem(STORAGE_KEY);
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        window.addEventListener("popstate", handleRouteChange);
        window.addEventListener("hashchange", handleRouteChange);
        window.addEventListener("locationchange", handleRouteChange);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
            window.removeEventListener("popstate", handleRouteChange);
            window.removeEventListener("hashchange", handleRouteChange);
            window.removeEventListener("locationchange", handleRouteChange);
        };
    }, [isManualSave, step, formData.title]);

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: "" }));
    };

    const toggleCategory = (value) => {
        setFormData((prev) => {
            const current = new Set(prev.category);
            current.has(value) ? current.delete(value) : current.add(value);
            return { ...prev, category: Array.from(current) };
        });
    };

      const uploadFiles = async (e) => {
        const files = Array.from(e.target.files);
      
        if ((post?.images?.length || 0) + postImgs.length + files.length > 3) {
          alert("업로드 이미지 개수를 초과하였습니다. (최대 3개)");
          return;
        }
      
        const newPreviewImgs = files.map((file) => URL.createObjectURL(file));
        setPostImgs((prev) => [...prev, ...files].slice(0, 3));
        setPreviewImgs((prev) => [...prev, ...newPreviewImgs].slice(0, 3));
      };
      

    const removePreviewImage = (index) => {
        setPreviewImgs(prev => prev.filter((_, i) => i !== index));
        setPostImgs(prev => prev.filter((_, i) => i !== index));
    };

    const validateStep = () => {
        const isEmpty = (str) => !str || str.trim() === "";
        const current = steps[step];
        const errs = {};

        if (current === "title") {
            if (isEmpty(formData.title) || formData.title.trim().length > 15) {
                errs.title = "제목은 공백만 입력되거나 15자를 넘을 수 없습니다.";
            }
        }

        if (current === "category") {
            if (!formData.category.length) {
                errs.category = "한 가지 이상 선택해주세요.";
            }
        }

        if (current === "description") {
            if (isEmpty(formData.description)) {
                errs.description = "모임 소개를 입력해주세요.";
            }
        }

        if (current === "location") {
            if (isEmpty(formData.location)) {
                errs.location = "모임 위치를 입력해주세요.";
            }
        }

        if (current === "date") {
            if (isEmpty(formData.date) || isEmpty(formData.timeStart) || isEmpty(formData.timeEnd)) {
                errs.date = "날짜와 시간을 모두 입력해주세요.";
            }
        }

        if (current === "capacity") {
            if (isEmpty(formData.capacity)) {
                errs.capacity = "모임 인원을 입력해주세요.";
            } else if (!/^\d+$/.test(formData.capacity.trim())) {
                errs.capacity = "숫자만 입력 가능합니다.";
            }
        }

        if (current === "fee") {
            if (isEmpty(formData.fee)) {
                errs.fee = "참가비를 입력해주세요.";
            } else if (!/^\d+$/.test(formData.fee.trim())) {
                errs.fee = "숫자만 입력 가능합니다.";
            }
        }

        if (current === "images") {
            if (previewImgs.length === 0 && formData.images.length === 0) {
                errs.images = "이미지를 최소 1개 이상 업로드해주세요.";
            }
        }

        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const nextStep = () => {
        if (validateStep()) setStep((s) => Math.min(s + 1, steps.length - 1));
    };

    const prevStep = () => setStep((s) => Math.max(s - 1, 0));

    if (hasChoice) {
        return (
          <div className="max-w-xl mx-auto p-6 space-y-4">
            <h2 className="text-xl font-bold">임시 저장된 글이 있습니다.</h2>
            <p>이어서 작성할까요, 새로 시작할까요?</p>
            <div className="flex gap-4">
              <button
                onClick={() => setHasChoice(false)}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded"
              >이어서 작성</button>
              <button
                onClick={() => {
                  localStorage.removeItem(STORAGE_KEY);
                  setFormData({
                    title: "",
                    category: "",
                    description: "",
                    location: "",
                    date: "",
                    timeStart: "",
                    timeEnd: "",
                    capacity: "",
                    fee: "",
                    images: []
                  });
                  setHasChoice(false);
                }}
                className="px-4 py-2 text-black hover:text-gray-700"
              >새로 작성</button>
            </div>
          </div>
        );
      }

    return (
        <div className="max-w-xl mx-auto p-6">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold ">게시물 작성</h2>
                <button onClick={handleManualSave} className="text-sm text-gray-500 hover:text-gray-800">임시저장</button>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                key={step}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
                >
                <div className="w-full">
                    {step === 0 && (
                    <div>
                        <input
                        value={formData.title}
                        onChange={(e) => handleChange("title", e.target.value)}
                        placeholder="모임 제목"
                        className="w-full p-2 border rounded"
                        />
                        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                    </div>
                    )}
                    {step === 1 && (
                    <div className="space-y-2">
                        <div className="flex flex-wrap gap-2">
                        {["양식", "중식", "일식", "베이커리", "기타"].map((cat) => (
                            <button
                            key={cat}
                            onClick={() => toggleCategory(cat)}
                            className={`px-3 py-1 rounded-full border ${
                                formData.category.includes(cat)
                                ? "bg-blue-500 text-white border-blue-500"
                                : "bg-white text-gray-800 border-gray-300 hover:bg-blue-500 hover:text-white hover:border-blue-500"
                            }`}
                            >
                            {cat}
                            </button>
                        ))}
                        </div>
                        {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
                    </div>
                    )}
                    {step === 2 && (
                    <div>
                        <textarea
                            value={formData.description}
                            onChange={(e) => handleChange("description", e.target.value)}
                            placeholder="모임 소개"
                            className="w-full p-2 border rounded"
                        />
                        {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
                    </div>
                    )}
                    {step === 3 && (
                    <div>
                        <input
                            value={formData.location}
                            onChange={(e) => handleChange("location", e.target.value)}
                            placeholder="모임 위치"
                            className="w-full p-2 border rounded"
                        />
                        {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}
                    </div>
                    )}
                    {step === 4 && (
                    <div className="space-y-2">
                        <input
                            type="date"
                            value={formData.date}
                            onChange={(e) => handleChange("date", e.target.value)}
                            className="w-full p-2 border rounded"
                        />
                        <div className="flex gap-2">
                            <input
                                type="time"
                                value={formData.timeStart}
                                onChange={(e) => handleChange("timeStart", e.target.value)}
                                className="w-full p-2 border rounded"
                            />
                            <input
                                type="time"
                                value={formData.timeEnd}
                                onChange={(e) => handleChange("timeEnd", e.target.value)}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}

                    </div>
                    )}
                    {step === 5 && (
                    <div>
                        <input
                        type="number"
                        value={formData.capacity}
                        onChange={(e) => handleChange("capacity", e.target.value)}
                        placeholder="모임 인원"
                        className="w-full p-2 border rounded"
                        />
                        {errors.capacity && <p className="text-red-500 text-sm mt-1">{errors.capacity}</p>}
                    </div>
                    )}
                    {step === 6 && (
                    <div>
                        <input
                        type="text"
                        value={formData.fee}
                        onChange={(e) => handleChange("fee", e.target.value)}
                        placeholder="참가비 (예: 30000원)"
                        className="w-full p-2 border rounded"
                        />
                        {errors.fee && <p className="text-red-500 text-sm mt-1">{errors.fee}</p>}
                    </div>
                    )}
                    {step === 7 && (
                    <div>
                        <input
                        type="file"
                        ref={fileInputRef}
                        onChange={uploadFiles}
                        className="opacity-0 absolute w-0 h-0"
                        multiple
                        accept="image/*"
                        id="fileUpload"
                        />
                        <label
                        htmlFor="fileUpload"
                        className="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600 inline-block"
                        >
                        파일 선택
                        </label>
                        <div className="flex gap-2 mt-2">
                        {previewImgs.map((img, index) => (
                            <div key={index} className="relative">
                            <img
                                src={img}
                                alt="미리보기"
                                onClick={() => handleImageClick(img, post, true)}
                                className="w-20 h-20 object-cover rounded cursor-pointer hover:shadow-xl hover:opacity-80"
                            />
                            <button
                                onClick={() => removePreviewImage(index)}
                                className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-1"
                            >x</button>
                            </div>
                        ))}
                        </div>
                        {errors.images && <p className="text-red-500 text-sm mt-1">{errors.images}</p>}
                    </div>
                    )}
                    {step === 8 && (
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold">미리보기</h3>
                        <p><strong>제목:</strong> {formData.title}</p>
                        <p><strong>요리 종류:</strong> {formData.category.join(", ")}</p>
                        <p><strong>소개:</strong> {formData.description}</p>
                        <p><strong>위치:</strong> {formData.location}</p>
                        <p><strong>일정:</strong> {formData.date} / {formData.timeStart} - {formData.timeEnd}</p>
                        <p><strong>인원:</strong> {formData.capacity}명</p>
                        <p><strong>참가비:</strong> {formData.fee}</p>
                        <div className="flex gap-2 mt-2">
                        {previewImgs.map((img, index) => (
                            <img
                            key={index}
                            src={img}
                            alt="미리보기"
                            onClick={() => handleImageClick(img, post, true)}
                            className="w-20 h-20 object-cover rounded cursor-pointer hover:shadow-xl hover:opacity-80"
                            />
                        ))}
                        </div>
                    </div>
                    )}
                </div>
                </motion.div>
            </AnimatePresence>

            <div className="flex justify-between gap-1 mt-6">
                {step > 0 && (
                <button onClick={prevStep} className="px-4 py-2 break-keep hover:text-gray-600">이전</button>
                )}
                {step < steps.length - 1 ? (
                <button onClick={nextStep} className="px-4 py-2 w-full bg-blue-500 hover:bg-blue-700 text-white rounded break-keep">다음 {step + 1}/{steps.length}</button>
                ) : (
                <button 
                    onClick={handleSubmitPost} 
                    className="px-4 py-2 bg-orange-500 hover:bg-orange-700 text-white rounded break-keep"
                >
                    완료 후 이동
                </button>
                )}
            </div>

            {selectedImage && (
                <PostImageModal
                selectedImage={selectedImage}
                setSelectedImage={setSelectedImage}
                />
            )}
        </div>
    );
};

export default StepPostPage;