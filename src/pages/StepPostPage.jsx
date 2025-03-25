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
          <div className="w-full p-4 border border-dashed rounded text-center text-gray-500">
            {steps[step]} 입력 영역 (UI 구성 예정)
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
