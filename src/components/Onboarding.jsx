import { useState, useEffect } from "react";
import { FaArrowRight, FaTimes, FaUsers } from "react-icons/fa";
import { Link } from "react-router-dom";

const Onboarding = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem("hasSeenOnboarding");
    if (hasSeenOnboarding) {
      setIsVisible(false);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem("hasSeenOnboarding", "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-lg border border-blue-100 md:max-w-md md:left-4 md:right-auto">
      <button
        onClick={handleDismiss}
        className="absolute -top-3 -right-3 p-2 text-gray-400 hover:text-gray-600 bg-white rounded-full shadow-md hover:shadow-lg transition-all"
        title="বন্ধ করুন"
      >
        <FaTimes />
      </button>

      <div className="p-4 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center bg-blue-100 rounded-lg">
            <FaUsers className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              ফুটবল টিম ম্যানেজারে স্বাগতম
            </h3>
            <p className="text-sm text-gray-500">
              অ্যাপটি ব্যবহার করার পদ্ধতি দেখে নিন
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
            <div className="w-8 h-8 flex items-center justify-center bg-blue-100 rounded-full text-blue-500">
              1
            </div>
            <div>
              <h4 className="font-medium text-gray-900">খেলোয়াড় যোগ করুন</h4>
              <p className="text-sm text-gray-500">
                প্রথমে খেলোয়াড়দের তালিকায় নতুন খেলোয়াড় যোগ করুন
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
            <div className="w-8 h-8 flex items-center justify-center bg-blue-100 rounded-full text-blue-500">
              2
            </div>
            <div>
              <h4 className="font-medium text-gray-900">ক্যাপ্টেন নির্বাচন</h4>
              <p className="text-sm text-gray-500">
                টিম তৈরি করার আগে কমপক্ষে দুইজন ক্যাপ্টেন নির্বাচন করুন
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
            <div className="w-8 h-8 flex items-center justify-center bg-blue-100 rounded-full text-blue-500">
              3
            </div>
            <div>
              <h4 className="font-medium text-gray-900">টিম তৈরি করুন</h4>
              <p className="text-sm text-gray-500">
                টিমের সংখ্যা নির্ধারণ করে অটোমেটিক টিম তৈরি করুন।
              </p>
              <Link to="/team-generator">
                <p className="text-sm text-blue-500 underline">
                  টিম তৈরি করতে যান
                </p>
              </Link>
            </div>
          </div>
        </div>

        <button
          onClick={handleDismiss}
          className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-sm flex items-center justify-center gap-2"
        >
          <span>বুঝেছি</span>
          <FaArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Onboarding;
