import { useState, useEffect } from "react";
import {
  FaUsers,
  FaRandom,
  FaExclamationCircle,
  FaChevronRight,
  FaSpinner,
  FaUserAlt,
} from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import EmptyState from "./EmptyState";
import Modal from "./Modal";
import GenerateTeamModal from "./GenerateTeamModal";
import { getApiUrl } from "../utils/api";

const API_URL = getApiUrl();

const TeamGenerator = ({ players }) => {
  const navigate = useNavigate();
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [teams, setTeams] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load last generated teams
  useEffect(() => {
    const fetchLastTeams = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${API_URL}/teams/latest`);
        if (response.data && response.data.length > 0) {
          // Sort by createdAt descending to be sure
          const sortedTeams = response.data.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );

          // Get the timestamp of the absolute latest team
          const latestTimestampMs = new Date(
            sortedTeams[0].createdAt
          ).getTime();

          // Define a small tolerance window (e.g., 2 seconds = 2000 milliseconds)
          const toleranceMs = 2000;

          // Filter teams whose timestamp is within the tolerance window of the latest
          const lastGeneratedBatch = sortedTeams.filter((team) => {
            const teamTimestampMs = new Date(team.createdAt).getTime();
            // Check if the difference is within the tolerance
            return Math.abs(latestTimestampMs - teamTimestampMs) < toleranceMs;
          });

          setTeams(lastGeneratedBatch);
        }
      } catch (error) {
        console.error("Error fetching last teams:", error);
        toast.error("শেষ তৈরি করা টিমগুলো লোড করতে সমস্যা হয়েছে!");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLastTeams();
  }, []);

  const getPositionColor = (position) => {
    const colors = {
      Striker: "text-red-500",
      Midfielder: "text-green-500",
      Defender: "text-blue-500",
      Goalkeeper: "text-yellow-500",
    };
    return colors[position] || "text-gray-500";
  };

  const saveTeams = async (generatedTeams) => {
    try {
      const teamsToSave = generatedTeams.map((team) => ({
        ...team,
        name: team.captain.teamName || team.captain.name,
        createdAt: new Date().toISOString(),
      }));

      console.log("Saving teams to server:", teamsToSave);
      const response = await axios.post(`${API_URL}/teams`, teamsToSave);
      console.log("Server response:", response.data);

      // Update teams state with only the newly generated teams
      setTeams(teamsToSave);

      toast.success("টিমগুলো সফলভাবে সংরক্ষণ করা হয়েছে!");
    } catch (error) {
      console.error("Error saving teams:", error);
      toast.error("টিমগুলো সংরক্ষণ করতে সমস্যা হয়েছে!");
    }
  };

  if (!players || players.length === 0) {
    return (
      <EmptyState
        icon={FaUsers}
        title="কোন খেলোয়াড় যোগ করা হয়নি"
        message="টিম তৈরি করতে প্রথমে খেলোয়াড়দের তালিকায় গিয়ে নতুন খেলোয়াড় যোগ করুন"
        nextStep={{
          to: "/",
          text: "খেলোয়াড়দের তালিকায় যান",
        }}
      />
    );
  }

  const captains = players.filter((player) => player.isCaptain);
  if (captains.length === 0) {
    return (
      <EmptyState
        icon={FaUsers}
        title="কোন ক্যাপ্টেন নির্বাচন করা হয়নি"
        message="টিম তৈরি করতে প্রথমে কমপক্ষে দুইজন ক্যাপ্টেন নির্বাচন করুন"
        nextStep={{
          to: "/",
          text: "ক্যাপ্টেন নির্বাচন করতে যান",
        }}
      />
    );
  }

  const generateTeams = (numberOfTeams) => {
    try {
      console.log("Generating teams with players:", players);

      if (players.length === 0) {
        console.log("No players found");
        return;
      }

      // Get captains
      const captains = players.filter((player) => player.isCaptain);
      console.log("Found captains:", captains);

      if (captains.length < numberOfTeams) {
        console.log("Not enough captains");
        setIsConfirmModalOpen(true);
        setIsGenerateModalOpen(false);
        return;
      }

      // Initialize teams with captains
      const generatedTeams = captains
        .slice(0, numberOfTeams)
        .map((captain) => ({
          captain,
          name: captain.teamName || captain.name,
          players: [captain],
        }));

      console.log("Initial teams with captains:", generatedTeams);

      // Group non-captain players by position
      const playersByPosition = players.reduce((acc, player) => {
        if (!player.isCaptain) {
          if (!acc[player.position]) acc[player.position] = [];
          acc[player.position].push(player);
        }
        return acc;
      }, {});

      console.log("Players grouped by position:", playersByPosition);

      // Helper function to find the team with fewest players
      const findSmallestTeam = (teams) => {
        return teams.reduce(
          (minTeam, currentTeam, currentIndex) => {
            if (currentTeam.players.length < minTeam.team.players.length) {
              return { team: currentTeam, index: currentIndex };
            }
            return minTeam;
          },
          { team: teams[0], index: 0 }
        );
      };

      // Distribute players by position
      Object.entries(playersByPosition).forEach(
        ([position, positionPlayers]) => {
          console.log(`Distributing ${position} players:`, positionPlayers);

          // Shuffle players within each position
          const shuffledPlayers = [...positionPlayers].sort(
            () => Math.random() - 0.5
          );

          shuffledPlayers.forEach((player) => {
            // Find team with fewest players
            const { index } = findSmallestTeam(generatedTeams);
            console.log(`Adding ${player.name} to team ${index + 1}`);
            generatedTeams[index].players.push(player);
          });
        }
      );

      console.log("Final generated teams:", generatedTeams);
      setTeams(generatedTeams);

      // Auto-save the generated teams
      saveTeams(generatedTeams);
    } catch (error) {
      console.error("Error generating teams:", error);
      toast.error("টিম তৈরি করতে সমস্যা হয়েছে!");
    }
  };

  const convertToBengaliNumber = (number) => {
    const bengaliNumerals = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return number
      .toString()
      .split("")
      .map((digit) => bengaliNumerals[parseInt(digit)])
      .join("");
  };

  return (
    <>
      <GenerateTeamModal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        players={players}
        onGenerateTeams={generateTeams}
      />

      <Modal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        title={
          <>
            <FaExclamationCircle className="text-yellow-500" />
            ক্যাপ্টেন নির্বাচন করুন
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            টিম তৈরি করতে প্রয়োজনীয় সংখ্যক ক্যাপ্টেন নেই। ক্যাপ্টেন নির্বাচন
            করার পেজে যেতে চান?
          </p>
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setIsConfirmModalOpen(false)}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
            >
              বাতিল
            </button>
            <button
              onClick={() => {
                setIsConfirmModalOpen(false);
                navigate("/");
              }}
              className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors"
            >
              ক্যাপ্টেন নির্বাচন করুন
            </button>
          </div>
        </div>
      </Modal>

      <div className="space-y-6">
        <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 flex items-center justify-center bg-blue-50 rounded-lg shrink-0">
                <FaUserAlt className="w-5 h-5 text-blue-500" />
              </div>
              <div className="min-w-0">
                <h2 className="text-lg font-bold text-gray-800 truncate">
                  টিম তৈরি করুন
                </h2>
                <p className="text-sm text-gray-500">
                  মোট {convertToBengaliNumber(players.length)} জন খেলোয়াড়
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsGenerateModalOpen(true)}
              className="inline-flex w-full sm:w-fit items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-sm transform hover:-translate-y-0.5"
            >
              <FaRandom className="w-4 h-4" />
              তৈরি করুন
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <FaSpinner className="animate-spin text-blue-500 text-2xl" />
          </div>
        ) : (
          teams && (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2 bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-lg font-bold text-gray-800 truncate">
                  বর্তমান টিমসমূহ
                </h2>
                <Link
                  to="/teams"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-sm transform hover:-translate-y-0.5"
                >
                  <FaChevronRight className="w-4 h-4" />
                  পূর্বের টিমসমূহ
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6">
                {teams.map((team, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-200">
                      <div className="flex items-center gap-2">
                        <FaUsers className="text-blue-500 w-6 h-6" />
                        <h3 className="text-xl font-bold text-gray-800">
                          {team.captain.teamName || team.captain.name}
                        </h3>
                      </div>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                        মোট {convertToBengaliNumber(team.players.length)} জন
                      </span>
                    </div>
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
                                {convertToBengaliNumber(1)}
                              </span>
                            </td>
                            <td className="whitespace-nowrap px-2 py-2 sm:px-3 sm:py-2.5">
                              <span className="font-medium text-blue-700">
                                {team.captain.name}
                              </span>
                            </td>
                            <td className="whitespace-nowrap px-2 py-2 sm:px-3 sm:py-2.5">
                              <span
                                className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium shadow-sm ${getPositionColor(
                                  team.captain.position
                                )} bg-opacity-10`}
                              >
                                {team.captain.position}
                              </span>
                            </td>
                            <td className="whitespace-nowrap px-2 py-2 sm:px-3 sm:py-2.5">
                              <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-700">
                                ক্যাপ্টেন
                              </span>
                            </td>
                          </tr>
                          {team.players
                            .filter((p) => p._id !== team.captain._id)
                            .map((player, playerIndex) => (
                              <tr key={player._id}>
                                <td className="whitespace-nowrap px-2 py-2 sm:px-3 sm:py-2.5">
                                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-700 sm:h-6 sm:w-6">
                                    {convertToBengaliNumber(playerIndex + 2)}
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
                  </div>
                ))}
              </div>
            </div>
          )
        )}
      </div>
    </>
  );
};

export default TeamGenerator;
