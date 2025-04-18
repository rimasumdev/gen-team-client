import { useState } from "react";
import { FaUserPlus } from "react-icons/fa";
import Modal from "./Modal";
import { toast } from "react-toastify";

const PlayerForm = ({ onAddPlayer, setIsModalOpen, players, initialData }) => {
  const [playerData, setPlayerData] = useState(
    initialData || {
      name: "",
      position: "Striker",
      isCaptain: false,
      teamName: "",
      useNameAsTeam: false,
    }
  );

  const positions = ["Striker", "Midfielder", "Defender", "Goalkeeper"];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!playerData.name) return;

    // Check for duplicate player name and position
    const isDuplicate = players.some(
      (player) =>
        player.name.toLowerCase() === playerData.name.toLowerCase() &&
        player.position === playerData.position
    );

    if (isDuplicate) {
      toast.error("এই নামের একজন খেলোয়াড় ইতিমধ্যে এই পজিশনে আছে!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    // If useNameAsTeam is checked, set teamName to player's name
    const finalPlayerData = {
      ...playerData,
      teamName: playerData.useNameAsTeam
        ? playerData.name
        : playerData.teamName,
    };

    onAddPlayer(finalPlayerData);
    setPlayerData({
      name: "",
      position: "Striker",
      isCaptain: false,
      teamName: "",
      useNameAsTeam: false,
    });
    setIsModalOpen(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-gray-700 mb-2">নাম</label>
        <input
          type="text"
          value={playerData.name}
          onChange={(e) =>
            setPlayerData({ ...playerData, name: e.target.value })
          }
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="খেলোয়াড়ের নাম"
        />
      </div>
      <div>
        <label className="block text-gray-700 mb-2">পজিশন</label>
        <select
          value={playerData.position}
          onChange={(e) =>
            setPlayerData({ ...playerData, position: e.target.value })
          }
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {positions.map((pos) => (
            <option key={pos} value={pos}>
              {pos}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={playerData.isCaptain}
            onChange={(e) =>
              setPlayerData({ ...playerData, isCaptain: e.target.checked })
            }
            className="mr-2"
          />
          <label className="text-gray-700">ক্যাপ্টেন</label>
        </div>

        {playerData.isCaptain && (
          <>
            <div className="flex items-center ml-6 mt-2">
              <input
                type="checkbox"
                checked={playerData.useNameAsTeam}
                onChange={(e) =>
                  setPlayerData({
                    ...playerData,
                    useNameAsTeam: e.target.checked,
                    teamName: e.target.checked ? playerData.name : "",
                  })
                }
                className="mr-2"
              />
              <label className="text-gray-700">
                ক্যাপ্টেনের নামে টিমের নাম দিন
              </label>
            </div>

            {!playerData.useNameAsTeam && (
              <div className="ml-6">
                <label className="block text-gray-700 mb-2">টিমের নাম</label>
                <input
                  type="text"
                  value={playerData.teamName}
                  onChange={(e) =>
                    setPlayerData({ ...playerData, teamName: e.target.value })
                  }
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="টিমের নাম লিখুন"
                />
              </div>
            )}
          </>
        )}
      </div>
      <button
        type="submit"
        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-sm transform hover:-translate-y-0.5"
      >
        {initialData ? "আপডেট করুন" : "যোগ করুন"} {/* Dynamic button text */}
      </button>
    </form>
  );
};

export default PlayerForm;
