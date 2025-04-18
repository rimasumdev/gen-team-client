import { FaChartBar, FaUsers, FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import EmptyState from "./EmptyState";
import { convertToBengaliNumber } from "../utils/api";

const PlayerStats = ({ players }) => {
  const totalPlayers = players.length;
  const captainCount = players.filter((player) => player.isCaptain).length;
  const captains = players?.filter((player) => player.isCaptain) || [];
  const showTeamGeneratorLink = players?.length >= 4 && captains.length >= 2;

  if (!players || players.length === 0) {
    return (
      <EmptyState
        icon={FaChartBar}
        title="কোন খেলোয়াড় যোগ করা হয়নি"
        message="পরিসংখ্যান দেখতে প্রথমে খেলোয়াড়দের তালিকায় গিয়ে নতুন খেলোয়াড় যোগ করুন"
        nextStep={{
          to: "/",
          text: "খেলোয়াড়দের তালিকায় যান",
        }}
      />
    );
  }

  const positionCounts = players.reduce((acc, player) => {
    acc[player.position] = (acc[player.position] || 0) + 1;
    return acc;
  }, {});

  const positions = ["Striker", "Midfielder", "Defender", "Goalkeeper"];

  const getPositionColor = (position) => {
    const colors = {
      Striker: {
        bg: "bg-red-100",
        text: "text-red-700",
        border: "border-red-200",
        bar: "bg-red-500",
      },
      Midfielder: {
        bg: "bg-green-100",
        text: "text-green-700",
        border: "border-green-200",
        bar: "bg-green-500",
      },
      Defender: {
        bg: "bg-blue-100",
        text: "text-blue-700",
        border: "border-blue-200",
        bar: "bg-blue-500",
      },
      Goalkeeper: {
        bg: "bg-yellow-100",
        text: "text-yellow-700",
        border: "border-yellow-200",
        bar: "bg-yellow-500",
      },
    };
    return (
      colors[position] || {
        bg: "bg-gray-100",
        text: "text-gray-700",
        border: "border-gray-200",
        bar: "bg-gray-500",
      }
    );
  };

  return (
    <div className="space-y-6">
      {/* Updated Header Container Style */}
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 hover:shadow-xl transition-all duration-300 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          {" "}
          {/* Adjusted border color */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 flex items-center justify-center bg-blue-50 rounded-lg shrink-0">
                <FaChartBar className="w-5 h-5 text-blue-500" />
              </div>
              <div className="min-w-0">
                <h2 className="text-lg font-bold text-gray-800 truncate">
                  খেলোয়াড়দের পরিসংখ্যান
                </h2>
                <p className="text-sm text-gray-500">
                  মোট {convertToBengaliNumber(players.length)} জন খেলোয়াড়
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:ml-auto w-full sm:w-auto">
              {showTeamGeneratorLink && (
                <Link
                  to="/team-generator"
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-sm transform hover:-translate-y-0.5"
                >
                  <FaUsers className="w-4 h-4" />
                  <span>টিম তৈরি করুন</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {players.length < 4 && (
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-600">
          টিম তৈরি করতে কমপক্ষে ৪ জন খেলোয়াড় প্রয়োজন। আরও{" "}
          {4 - players.length} জন খেলোয়াড় যোগ করুন।
        </div>
      )}

      {players.length >= 4 && captains.length < 2 && (
        <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 text-sm text-yellow-600">
          টিম তৈরি করতে কমপক্ষে ২ জন ক্যাপ্টেন প্রয়োজন। আরও{" "}
          {2 - captains.length} জন ক্যাপ্টেন নির্বাচন করুন।
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FaUsers className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-600">মোট খেলোয়াড়</p>
              <h3 className="text-2xl font-bold text-blue-700">
                {convertToBengaliNumber(totalPlayers)} জন
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-4 rounded-xl border border-yellow-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <FaStar className="w-6 h-6 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-yellow-600">ক্যাপ্টেন</p>
              <h3 className="text-2xl font-bold text-yellow-700">
                {convertToBengaliNumber(captainCount)} জন
              </h3>
            </div>
          </div>
        </div>

        <div className="sm:col-span-2 bg-gradient-to-br from-slate-50 to-gray-50 p-4 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            পজিশন অনুযায়ী খেলোয়াড়
          </h3>
          <div className="space-y-4">
            {positions.map((position) => {
              const count = positionCounts[position] || 0;
              const percentage = totalPlayers
                ? (count / totalPlayers) * 100
                : 0;
              const colors = getPositionColor(position);

              return (
                <div key={position} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      {/* Standardized Badge Padding */}
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text} border ${colors.border}`}
                      >
                        {position}
                      </span>
                      <span className="text-sm text-gray-500">
                        {convertToBengaliNumber(count)} জন
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {convertToBengaliNumber(percentage.toFixed(1))}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${colors.bar} transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Player List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="border-b border-gray-200 px-4 py-3">
          <h3 className="text-lg font-semibold text-gray-800">
            খেলোয়াড়দের তালিকা
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  নাম
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  পজিশন
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  ভূমিকা
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {players.map((player) => {
                const colors = getPositionColor(player.position);
                return (
                  <tr key={player._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {player.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {/* Standardized Badge Padding */}
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text} border ${colors.border}`}
                      >
                        {player.position}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {/* Standardized Badge Padding */}
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                          player.isCaptain
                            ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
                            : "bg-gray-100 text-gray-700 border border-gray-200"
                        }`}
                      >
                        {player.isCaptain ? "ক্যাপ্টেন" : "খেলোয়াড়"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PlayerStats;
