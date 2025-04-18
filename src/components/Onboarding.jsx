import { useState, useEffect } from "react";
import { FaArrowRight, FaTimes, FaUsers } from "react-icons/fa";
import { Link } from "react-router-dom";

const Onboarding = () => {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
          <div className="w-8 h-8 flex items-center justify-center bg-blue-100 rounded-full text-blue-500">
            1
          </div>
          <div>
            <h4 className="font-medium text-gray-900">খেলোয়াড় যোগ করুন</h4>
            <p className="text-sm text-gray-500">
              প্রথমে খেলোয়াড়দের তালিকায় নতুন খেলোয়াড় যোগ করুন
            </p>
            <Link
              to="/players"
              className="text-sm text-blue-500 hover:text-blue-600 mt-1 inline-block"
            >
              খেলোয়াড় যোগ করতে যান →
            </Link>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
          <div className="w-8 h-8 flex items-center justify-center bg-blue-100 rounded-full text-blue-500">
            2
          </div>
          <div>
            <h4 className="font-medium text-gray-900">ক্যাপ্টেন নির্বাচন</h4>
            <p className="text-sm text-gray-500">
              টিম তৈরি করার আগে কমপক্ষে দুইজন ক্যাপ্টেন নির্বাচন করুন
            </p>
            <Link
              to="/players"
              className="text-sm text-blue-500 hover:text-blue-600 mt-1 inline-block"
            >
              ক্যাপ্টেন নির্বাচন করতে যান →
            </Link>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
          <div className="w-8 h-8 flex items-center justify-center bg-blue-100 rounded-full text-blue-500">
            3
          </div>
          <div>
            <h4 className="font-medium text-gray-900">টিম তৈরি করুন</h4>
            <p className="text-sm text-gray-500">
              টিমের সংখ্যা নির্ধারণ করে অটোমেটিক টিম তৈরি করুন
            </p>
            <Link
              to="/team-generator"
              className="text-sm text-blue-500 hover:text-blue-600 mt-1 inline-block"
            >
              টিম তৈরি করতে যান →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
