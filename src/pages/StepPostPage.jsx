// StepPostPage.jsx
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import PostImageModal from "./PostImageModal";
import useImageViewer from "../hooks/useImageViewer";

const steps = [
  "title", "category", "description", "location", "date", "capacity", "fee", "images", "preview"
];

const StepPostPage = ({ post }) => {
    const navigate = useNavigate();
    const [step, setStep] = useState(0);
    const { selectedImage, setSelectedImage, handleImageClick } = useImageViewer();
    const [formData, setFormData] = useState({
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
    const fileInputRef = useRef(null);
    const [postImgs, setPostImgs] = useState([]);
    const [previewImgs, setPreviewImgs] = useState([]);

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const uploadFiles = (e) => {
        const files = Array.from(e.target.files);
        if ((post?.field?.length || 0) + postImgs.length + files.length > 3) {
            alert("업로드 이미지 개수를 초과하였습니다. (최대 3개)");
            return;
        }
        const newPreviewImgs = files.map(file => URL.createObjectURL(file));
        setPostImgs(prev => [...prev, ...files].slice(0, 3));
        setPreviewImgs(prev => [...prev, ...newPreviewImgs].slice(0, 3));
    };

    const removePreviewImage = (index) => {
        setPreviewImgs(prev => prev.filter((_, i) => i !== index));
        setPostImgs(prev => prev.filter((_, i) => i !== index));
    };

    const nextStep = () => setStep((s) => Math.min(s + 1, steps.length - 1));
    const prevStep = () => setStep((s) => Math.max(s - 1, 0));

    return (
        <div className="max-w-xl mx-auto p-6">
            <h2 className="text-lg font-bold mb-4">게시물 작성</h2>

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
                    <input
                        value={formData.title}
                        onChange={(e) => handleChange("title", e.target.value)}
                        placeholder="모임 제목"
                        className="w-full p-2 border rounded"
                    />
                    )}
                    {step === 1 && (
                    <select
                        value={formData.category}
                        onChange={(e) => handleChange("category", e.target.value)}
                        className="w-full p-2 border rounded"
                    >
                        <option value="">요리 종류 선택</option>
                        <option value="양식">양식</option>
                        <option value="중식">중식</option>
                        <option value="일식">일식</option>
                        <option value="베이커리">베이커리</option>
                        <option value="기타">기타</option>
                    </select>
                    )}
                    {step === 2 && (
                    <textarea
                        value={formData.description}
                        onChange={(e) => handleChange("description", e.target.value)}
                        placeholder="모임 소개"
                        className="w-full p-2 border rounded"
                    />
                    )}
                    {step === 3 && (
                    <input
                        value={formData.location}
                        onChange={(e) => handleChange("location", e.target.value)}
                        placeholder="모임 위치"
                        className="w-full p-2 border rounded"
                    />
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
                    </div>
                    )}
                    {step === 5 && (
                    <input
                        type="number"
                        value={formData.capacity}
                        onChange={(e) => handleChange("capacity", e.target.value)}
                        placeholder="모임 인원"
                        className="w-full p-2 border rounded"
                    />
                    )}
                    {step === 6 && (
                    <input
                        type="text"
                        value={formData.fee}
                        onChange={(e) => handleChange("fee", e.target.value)}
                        placeholder="참가비 (예: 30000원)"
                        className="w-full p-2 border rounded"
                    />
                    )}
                    {step === 7 && (
                    <div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={uploadFiles}
                            className="opacity-0 absolute w-0 h-0" // ✅ 파일 입력 필드 숨김 (하지만 클릭 가능)
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
                                    onClick={() => handleImageClick(img, post, true)} // ✅ 기존 이미지 클릭 시 PostImageModal 실행
                                    className="w-20 h-20 object-cover rounded cursor-pointer hover:shadow-xl hover:opacity-80"
                                />
                                <button
                                    onClick={() => removePreviewImage(index)} 
                                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-1"
                                >x</button>
                            </div>
                        ))}
                        </div>
                    </div>
                    )}

                    {step === 8 && (
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold">미리보기</h3>
                        <p><strong>제목:</strong> {formData.title}</p>
                        <p><strong>요리 종류:</strong> {formData.category}</p>
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
                                onClick={() => handleImageClick(img, post, true)} // ✅ 기존 이미지 클릭 시 PostImageModal 실행
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
                <button onClick={() => navigate("/post")} className="px-4 py-2 bg-orange-500 hover:bg-orange-700 text-white rounded break-keep">완료 후 이동</button>
                )}
            </div>

            {/* ✅ PostImageModal 추가하여 클릭한 이미지 확대 가능 */}
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
