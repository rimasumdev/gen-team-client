import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaUsers,
  FaCalendar,
  FaTrash,
  FaSpinner,
  FaChevronDown,
  FaChevronRight,
  FaTrashAlt,
  FaClock,
  FaUserAlt,
} from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import Modal from "../components/Modal";
import { getServerUrl } from "../utils/api";
import { Link } from "react-router-dom";

const API_URL = `${getServerUrl()}/api`;

const pageVariants = {
  initial: { opacity: 0 },
  in: { opacity: 1 },
  out: { opacity: 0 },
};

const pageTransition = {
  type: "tween",
  ease: "easeInOut",
  duration: 0.2,
};

const TeamListPage = () => {
  const [teams, setTeams] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState({});
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    isOpen: false,
    type: "", // 'single' or 'all'
    date: null,
    teamId: null,
  });

  const fetchTeams = async () => {
    try {
      setLoading(true);
      let url = `${API_URL}/teams`;
      if (selectedDate) {
        url += `?date=${selectedDate}`;
      }
      const response = await axios.get(url);
      setTeams(response.data);
    } catch (error) {
      toast.error("টিমের তথ্য লোড করতে সমস্যা হয়েছে!");
      console.error("Error fetching teams:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, [selectedDate]);

  const handleDeleteTeam = async (teamId) => {
    try {
      await axios.delete(`${API_URL}/teams/${teamId}`);
      toast.success("টিম সফলভাবে মুছে ফেলা হয়েছে!");
      fetchTeams();
      if (selectedTeam?._id === teamId) {
        setSelectedTeam(null);
      }
    } catch (error) {
      toast.error("টিম মুছে ফেলতে সমস্যা হয়েছে!");
      console.error("Error deleting team:", error);
    }
  };

  const handleDeleteTeamsByDate = async (date) => {
    try {
      const response = await axios({
        method: "delete",
        url: `${API_URL}/teams/by-date`,
        data: { date },
      });
      toast.success(response.data.message);
      fetchTeams();
    } catch (error) {
      toast.error("টিমগুলো মুছে ফেলতে সমস্যা হয়েছে!");
      console.error("Error deleting teams by date:", error);
    }
  };

  const getPositionColor = (position) => {
    const colors = {
      Striker: "text-red-500",
      Midfielder: "text-green-500",
      Defender: "text-blue-500",
      Goalkeeper: "text-yellow-500",
    };
    return colors[position] || "text-gray-500";
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("bn-BD", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
  };

  const groupTeamsByDateTime = (teams) => {
    const groups = teams.reduce((acc, team) => {
      const date = new Date(team.createdAt);
      const dateKey = date.toLocaleDateString("bn-BD", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      const hour = date.getHours();
      const minute = date.getMinutes();
      const period = hour >= 12 ? "অপরাহ্ন" : "পূর্বাহ্ন";
      const hour12 = hour % 12 || 12;

      const timeKey = `${hour12}:${minute
        .toString()
        .padStart(2, "0")} ${period}`;

      if (!acc[dateKey]) {
        acc[dateKey] = {};
      }

      if (!acc[dateKey][timeKey]) {
        acc[dateKey][timeKey] = [];
      }

      acc[dateKey][timeKey].push(team);
      return acc;
    }, {});

    return Object.entries(groups)
      .sort((a, b) => {
        const dateA = new Date(a[1][Object.keys(a[1])[0]][0].createdAt);
        const dateB = new Date(b[1][Object.keys(b[1])[0]][0].createdAt);
        return dateB - dateA;
      })
      .map(([date, timeGroups]) => {
        const sortedTimeGroups = Object.entries(timeGroups).sort((a, b) => {
          const timeA = new Date(a[1][0].createdAt);
          const timeB = new Date(b[1][0].createdAt);
          return timeB - timeA;
        });
        return [date, sortedTimeGroups];
      });
  };

  const toggleGroup = (date) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [date]: !prev[date],
    }));
  };

  const groupedTeams = groupTeamsByDateTime(teams);

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="space-y-6 py-4"
    >
      <Modal
        isOpen={!!selectedTeam}
        onClose={() => setSelectedTeam(null)}
        title={
          <>
            <FaUsers className="text-blue-500" />
            {selectedTeam?.name}
          </>
        }
      >
        {selectedTeam && (
          <div className="overflow-x-auto rounded-lg border border-gray-100">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50">
                <tr>
                  <th className="w-12 px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-3 sm:py-2.5">
                    #
                  </th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-3 sm:py-2.5">
                    নাম
                  </th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-3 sm:py-2.5">
                    পজিশন
                  </th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-3 sm:py-2.5">
                    ভূমিকা
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                <tr className="bg-gradient-to-r from-blue-50 to-blue-100">
                  <td className="whitespace-nowrap px-2 py-2 sm:px-3 sm:py-2.5">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700 sm:h-6 sm:w-6">
                      ১
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-2 py-2 sm:px-3 sm:py-2.5">
                    <span className="font-medium text-blue-700">
                      {selectedTeam.captain.name}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-2 py-2 sm:px-3 sm:py-2.5">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium shadow-sm ${getPositionColor(
                        selectedTeam.captain.position
                      )} bg-opacity-10`}
                    >
                      {selectedTeam.captain.position}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-2 py-2 sm:px-3 sm:py-2.5">
                    <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-700">
                      ক্যাপ্টেন
                    </span>
                  </td>
                </tr>
                {selectedTeam.players
                  .filter((p) => p._id !== selectedTeam.captain._id)
                  .map((player, playerIndex) => (
                    <tr key={player._id}>
                      <td className="whitespace-nowrap px-2 py-2 sm:px-3 sm:py-2.5">
                        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-700 sm:h-6 sm:w-6">
                          {playerIndex + 2}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-2 py-2 sm:px-3 sm:py-2.5">
                        <span className="font-medium text-gray-900">
                          {player.name}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-2 py-2 sm:px-3 sm:py-2.5">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium shadow-sm ${getPositionColor(
                            player.position
                          )} bg-opacity-10`}
                        >
                          {player.position}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-2 py-2 sm:px-3 sm:py-2.5">
                        <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
                          খেলোয়াড়
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={deleteConfirmation.isOpen}
        onClose={() =>
          setDeleteConfirmation({
            isOpen: false,
            type: "",
            date: null,
            teamId: null,
          })
        }
        title={
          <>
            <FaTrash className="text-red-500" />
            {deleteConfirmation.type === "single"
              ? "টিম মুছে ফেলুন"
              : "সব টিম মুছে ফেলুন"}
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            {deleteConfirmation.type === "single"
              ? "আপনি কি নিশ্চিত যে আপনি এই টিমটি মুছে ফেলতে চান?"
              : `আপনি কি নিশ্চিত যে আপনি ${new Date(
                  deleteConfirmation.date
                ).toLocaleDateString("bn-BD", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })} তারিখের সব টিম মুছে ফেলতে চান?`}
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() =>
                setDeleteConfirmation({
                  isOpen: false,
                  type: "",
                  date: null,
                  teamId: null,
                })
              }
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
            >
              বাতিল
            </button>
            <button
              onClick={() => {
                if (deleteConfirmation.type === "single") {
                  handleDeleteTeam(deleteConfirmation.teamId);
                } else {
                  handleDeleteTeamsByDate(deleteConfirmation.date);
                }
                setDeleteConfirmation({
                  isOpen: false,
                  type: "",
                  date: null,
                  teamId: null,
                });
              }}
              className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600 transition-colors"
            >
              মুছে ফেলুন
            </button>
          </div>
        </div>
      </Modal>

      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 flex items-center justify-center bg-blue-50 rounded-lg shrink-0">
              <FaUserAlt className="w-5 h-5 text-blue-500" />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-bold text-gray-800 truncate">
                তৈরি করা টিমসমূহ
              </h2>
              <p className="text-sm text-gray-500 flex items-center gap-2">
                <FaUsers className="text-blue-400" />
                মোট {teams.length} টি টিম
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:ml-auto w-full sm:w-auto">
            <Link
              to="/team-generator"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-sm"
            >
              <FaUsers className="w-4 h-4" />
              <span>নতুন টিম তৈরি করুন</span>
            </Link>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-2">
            তারিখ নির্বাচন করুন
          </label>
          <div className="relative">
            <FaCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full pl-10 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <FaSpinner className="animate-spin text-blue-500 text-2xl" />
          </div>
        ) : teams.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            কোন টিম পাওয়া যায়নি
          </div>
        ) : (
          <div className="space-y-4">
            {groupedTeams.map(([date, timeGroups]) => (
              <div key={date} className="border rounded-lg overflow-hidden">
                <div
                  onClick={() => toggleGroup(date)}
                  className="bg-gray-50 p-3 sm:p-4 flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <h3 className="text-sm sm:text-lg font-semibold text-gray-800 flex items-center gap-1 sm:gap-2">
                    {expandedGroups[date] ? (
                      <FaChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      <FaChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                    {date}
                  </h3>
                  <div className="flex items-center gap-2 sm:gap-4">
                    <span className="text-xs sm:text-sm text-gray-500">
                      মোট{" "}
                      {timeGroups.reduce(
                        (total, [_, teams]) => total + teams.length,
                        0
                      )}
                      টি টিম
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const formattedDate =
                          timeGroups[0][1][0].createdAt.split("T")[0];
                        setDeleteConfirmation({
                          isOpen: true,
                          type: "all",
                          date: formattedDate,
                          teamId: null,
                        });
                      }}
                      className="p-1.5 sm:p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors flex items-center gap-1 sm:gap-2"
                      title="এই তারিখের সব টিম মুছে ফেলুন"
                    >
                      <FaTrashAlt className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span className="text-xs sm:text-sm">সব মুছুন</span>
                    </button>
                  </div>
                </div>

                {expandedGroups[date] && (
                  <div className="divide-y divide-gray-100">
                    {timeGroups.map(([time, teams]) => (
                      <div key={time} className="bg-white p-4">
                        <div className="mb-4">
                          <h4 className="text-md font-medium text-gray-700 flex items-center gap-2">
                            <FaClock className="text-blue-400" />
                            সময়ঃ {time}
                          </h4>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          {teams.map((team) => (
                            <div
                              key={team._id}
                              onClick={() => setSelectedTeam(team)}
                              className="bg-gradient-to-br from-white to-blue-50 p-2 sm:p-6 rounded-xl border border-blue-100 hover:shadow-xl hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                            >
                              <div className="flex items-center justify-between mb-4 pb-3 border-b border-blue-100">
                                <div className="flex items-center gap-3">
                                  <div className="w-7 h-7 flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg shadow-sm">
                                    <FaUsers className="text-blue-600 w-5 h-5" />
                                  </div>
                                  <h3 className="text-md sm:text-xl font-bold text-gray-800 truncate">
                                    {team.name}
                                  </h3>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-blue-100 text-blue-700 border border-blue-200 shadow-sm">
                                    <FaUsers className="w-4 h-4 mr-1.5" />
                                    {team.players.length} জন
                                  </span>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setDeleteConfirmation({
                                        isOpen: true,
                                        type: "single",
                                        date: null,
                                        teamId: team._id,
                                      });
                                    }}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors shadow-sm hover:shadow-md"
                                    title="টিম মুছে ফেলুন"
                                  >
                                    <FaTrash className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                              <div className="flex flex-row items-center justify-between gap-3 text-sm">
                                <div className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-blue-100 px-3 py-1.5 rounded-lg">
                                  <FaUserAlt className="text-blue-500 w-3 h-3" />
                                  <span className="font-normal text-blue-700">
                                    {team.captain.name}
                                  </span>
                                  <span className="text-blue-600 text-xs">
                                    (ক্যাপ্টেন)
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                  <span className="font-medium">
                                    খেলোয়াড়:
                                  </span>
                                  <span className="text-blue-600 font-medium">
                                    {team.players.length - 1} জন
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TeamListPage;
