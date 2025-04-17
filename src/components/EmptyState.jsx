import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

const EmptyState = ({
  icon: Icon,
  title = "কোন খেলোয়াড় যোগ করা হয়নি",
  message = "খেলোয়াড়দের তালিকায় গিয়ে নতুন খেলোয়াড় যোগ করুন",
  action = null,
  className = "text-center",
  nextStep = null,
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center py-12 ${className}`}
    >
      {Icon && <Icon className="text-gray-400 text-5xl mb-4" />}
      <h2 className="text-xl text-gray-600">{title}</h2>
      <p className="text-gray-500 mt-2">{message}</p>
      {action && <div className="mt-6">{action}</div>}

      {nextStep && (
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 mb-3">পরবর্তী ধাপ</p>
          <Link
            to={nextStep.to}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm group"
          >
            {nextStep.text}
            <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      )}
    </div>
  );
};

export default EmptyState;
