import {
  FaUserAlt,
  FaEdit,
  FaStar,
  FaUserPlus,
  FaTrash,
  FaUsers,
} from "react-icons/fa";
import { useState } from "react";
import { Link } from "react-router-dom";
import Modal from "./Modal";
import PlayerForm from "./PlayerForm";
import EmptyState from "./EmptyState";
import { toast } from "react-toastify";
import { convertToBengaliNumber } from "../utils/api";

const PlayerList = ({
  players,
  onToggleCaptain,
  onAddPlayer,
  onEditPlayer,
  onDeletePlayer,
  onSetTeamName,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isTeamNameModalOpen, setIsTeamNameModalOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [teamName, setTeamName] = useState("");
  const [useNameAsTeam, setUseNameAsTeam] = useState(false);

  const captains = players?.filter((player) => player.isCaptain) || [];
  const showTeamGeneratorLink = players?.length >= 4 && captains.length >= 2;

  const getPositionColor = (position) => {
    const colors = {
      Striker: "text-red-500",
      Midfielder: "text-green-500",
      Defender: "text-blue-500",
      Goalkeeper: "text-yellow-500",
    };
    return colors[position] || "text-gray-500";
  };

  // Always render modals regardless of player count
  return (
    <>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          <>
            <FaUserPlus className="text-blue-500" />
            নতুন খেলোয়াড়
          </>
        }
      >
        <PlayerForm
          onAddPlayer={onAddPlayer}
          setIsModalOpen={setIsModalOpen}
          players={players || []}
        />
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedPlayer(null);
        }}
        title={
          <>
            <FaEdit className="text-blue-500" />
            খেলোয়াড় সম্পাদনা
          </>
        }
      >
        {selectedPlayer && (
          <PlayerForm
            onAddPlayer={(updatedData) => {
              onEditPlayer(selectedPlayer._id, updatedData);
              setIsEditModalOpen(false);
              setSelectedPlayer(null);
            }}
            setIsModalOpen={setIsEditModalOpen}
            players={players.filter((p) => p._id !== selectedPlayer._id)}
            initialData={selectedPlayer}
          />
        )}
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedPlayer(null);
        }}
        title={
          <>
            <FaTrash className="text-red-500" />
            খেলোয়াড় মুছে ফেলুন
          </>
        }
      >
        {selectedPlayer && (
          <div className="space-y-4">
            <p className="text-gray-700">
              আপনি কি নিশ্চিত যে আপনি {selectedPlayer.name} কে মুছে ফেলতে চান?
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setSelectedPlayer(null);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
              >
                বাতিল
              </button>
              <button
                onClick={() => {
                  onDeletePlayer(selectedPlayer._id);
                  setIsDeleteModalOpen(false);
                  setSelectedPlayer(null);
                }}
                className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600 transition-colors"
              >
                মুছে ফেলুন
              </button>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={isTeamNameModalOpen}
        onClose={() => {
          setIsTeamNameModalOpen(false);
          setSelectedPlayer(null);
          setTeamName("");
          setUseNameAsTeam(false);
        }}
        title={
          <>
            <FaStar className="text-yellow-500" />
            টিমের নাম দিন
          </>
        }
      >
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={useNameAsTeam}
              onChange={(e) => {
                setUseNameAsTeam(e.target.checked);
                if (e.target.checked) {
                  setTeamName(selectedPlayer?.name || "");
                } else {
                  setTeamName("");
                }
              }}
              className="mr-2"
            />
            <label className="text-gray-700">
              ক্যাপ্টেনের নামে টিমের নাম দিন
            </label>
          </div>

          {!useNameAsTeam && (
            <div>
              <label className="block text-gray-700 mb-2">টিমের নাম</label>
              <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="টিমের নাম লিখুন"
              />
            </div>
          )}
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => {
                setIsTeamNameModalOpen(false);
                setSelectedPlayer(null);
                setTeamName("");
                setUseNameAsTeam(false);
              }}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
            >
              বাতিল
            </button>
            <button
              onClick={() => {
                if (!useNameAsTeam && !teamName.trim()) {
                  toast.error("দয়া করে টিমের নাম দিন!", {
                    position: "top-right",
                    autoClose: 3000,
                  });
                  return;
                }
                onToggleCaptain(selectedPlayer._id);
                onSetTeamName(
                  selectedPlayer._id,
                  useNameAsTeam ? selectedPlayer.name : teamName.trim()
                );
                toast.success("ক্যাপ্টেন সফলভাবে নির্বাচন করা হয়েছে!", {
                  position: "top-right",
                  autoClose: 3000,
                });
                setIsTeamNameModalOpen(false);
                setSelectedPlayer(null);
                setTeamName("");
                setUseNameAsTeam(false);
              }}
              className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors"
            >
              নিশ্চিত করুন
            </button>
          </div>
        </div>
      </Modal>

      {/* Content based on players existence */}
      {!players || players.length === 0 ? (
        <EmptyState
          icon={FaUserAlt}
          title="কোন খেলোয়াড় যোগ করা হয়নি"
          message="নতুন খেলোয়াড় যোগ করতে নীচের বাটনে ক্লিক করুন"
          action={
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-200 flex items-center gap-2"
            >
              <FaUserPlus className="w-5 h-5" />
              নতুন খেলোয়াড় যোগ করুন
            </button>
          }
        />
      ) : (
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 hover:shadow-xl transition-all duration-300 overflow-hidden">
          {/* Header Section */}
          <div className="p-4 sm:p-6 border-b border-gray-200">
            {" "}
            {/* Adjusted border color */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 flex items-center justify-center bg-blue-50 rounded-lg shrink-0">
                  <FaUserAlt className="w-5 h-5 text-blue-500" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-lg font-bold text-gray-800 truncate">
                    খেলোয়াড়দের তালিকা
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
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-medium rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-sm transform hover:-translate-y-0.5"
                >
                  <FaUserPlus className="w-4 h-4" />
                  <span>নতুন</span>
                </button>
              </div>
            </div>
            {/* Warning Messages */}
            {players.length < 4 && (
              <div className="mt-4 flex items-center gap-2 p-3 bg-blue-50 text-blue-700 rounded-lg text-sm">
                <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center bg-blue-100 rounded-lg">
                  <FaUsers className="w-4 h-4" />
                </div>
                <p>
                  টিম তৈরি করতে কমপক্ষে ৪ জন খেলোয়াড় প্রয়োজন। আরও{" "}
                  {convertToBengaliNumber(4 - players.length)} জন খেলোয়াড় যোগ
                  করুন।
                </p>
              </div>
            )}
            {players.length >= 4 && captains.length < 2 && (
              <div className="mt-4 flex items-center gap-2 p-3 bg-yellow-50 text-yellow-700 rounded-lg text-sm">
                <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center bg-yellow-100 rounded-lg">
                  <FaStar className="w-4 h-4" />
                </div>
                <p>
                  টিম তৈরি করতে কমপক্ষে ২ জন ক্যাপ্টেন প্রয়োজন। আরও{" "}
                  {convertToBengaliNumber(2 - captains.length)} জন ক্যাপ্টেন
                  নির্বাচন করুন।
                </p>
              </div>
            )}
          </div>

          {/* Table Section */}
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              {/* Removed top border from table as container now has border */}
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="py-3 pl-4 pr-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:pl-6"
                    >
                      নাম
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      পজিশন
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      ক্যাপ্টেন
                    </th>
                    <th
                      scope="col"
                      className="py-3 pl-3 pr-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider sm:pr-6"
                    >
                      অ্যাকশন
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {players.map((player) => (
                    <tr key={player._id} className="hover:bg-gray-50">
                      <td className="py-3 pl-4 pr-3 text-sm sm:pl-6">
                        <span className="font-medium text-gray-900">
                          {player.name}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-sm">
                        {/* Standardized Badge Padding */}
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getPositionColor(
                            player.position
                          )}`}
                        >
                          {player.position}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <button
                          onClick={() => {
                            if (!player.isCaptain) {
                              setSelectedPlayer(player);
                              setTeamName("");
                              setUseNameAsTeam(false);
                              setIsTeamNameModalOpen(true);
                            } else {
                              onToggleCaptain(player._id);
                            }
                          }}
                          className={`p-2 rounded-full transition-colors ${
                            player.isCaptain
                              ? "bg-yellow-100 hover:bg-yellow-200"
                              : "hover:bg-gray-100"
                          }`}
                        >
                          <FaStar
                            className={`w-4 h-4 ${
                              player.isCaptain
                                ? "text-yellow-500"
                                : "text-gray-400"
                            }`}
                          />
                        </button>
                      </td>
                      <td className="py-3 pl-3 pr-4 text-center sm:pr-6">
                        <div className="flex justify-center items-center space-x-2">
                          <button
                            onClick={() => {
                              setSelectedPlayer(player);
                              setIsEditModalOpen(true);
                            }}
                            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                          >
                            <FaEdit className="w-4 h-4 text-blue-500" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedPlayer(player);
                              setIsDeleteModalOpen(true);
                            }}
                            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                          >
                            <FaTrash className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PlayerList;
