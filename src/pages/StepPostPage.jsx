// StepPostPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const steps = [
  "title", "category", "description", "location", "date", "capacity", "fee", "images", "preview"
];

const StepPostPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    location: "",
    date: "",
    timeStart: "",
    timeEnd: "",
    capacity: "",
    fee: ""
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
            {step > 6 && (
              <div className="text-center text-gray-500 p-4 border border-dashed rounded">
                {steps[step]} 입력 영역 (UI 구성 예정)
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
    </div>
  );
};

export default StepPostPage;
