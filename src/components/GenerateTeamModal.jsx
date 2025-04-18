import { useState } from "react";
import { FaRandom } from "react-icons/fa";
import Modal from "./Modal";
import { convertToBengaliNumber } from "../utils/api";

const GenerateTeamModal = ({ isOpen, onClose, players, onGenerateTeams }) => {
  const [numberOfTeams, setNumberOfTeams] = useState(2);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <>
          <FaRandom className="text-blue-500" />
          টিম তৈরি করুন
        </>
      }
    >
      <div className="space-y-6 p-4 bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-sm">
        <div className="flex flex-col space-y-6">
          <div className="w-full">
            <label className="block text-gray-800 font-medium mb-2 text-lg">
              টিমের সংখ্যা নির্বাচন করুন
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                min="2"
                max={Math.min(Math.floor(players.length / 2), 10)}
                value={convertToBengaliNumber(numberOfTeams)}
                onChange={(e) => {
                  const value = parseInt(e.target.value.replace(/[^0-9]/g, ""));
                  if (
                    !isNaN(value) &&
                    value >= 2 &&
                    value <= Math.min(Math.floor(players.length / 2), 10)
                  ) {
                    setNumberOfTeams(value);
                  }
                }}
                className="w-full p-4 text-center text-2xl font-semibold bg-white border-2 border-blue-100 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                placeholder="টিমের সংখ্যা লিখুন"
              />
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => {
                const minTeams = 2;
                if (numberOfTeams > minTeams) {
                  setNumberOfTeams(numberOfTeams - 1);
                }
              }}
              className="w-16 h-16 flex items-center justify-center text-2xl font-bold text-blue-600 bg-blue-50 rounded-full hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-sm"
              disabled={numberOfTeams <= 2}
            >
              -
            </button>
            <button
              onClick={() => {
                const maxTeams = Math.min(Math.floor(players.length / 2), 10);
                if (numberOfTeams < maxTeams) {
                  setNumberOfTeams(numberOfTeams + 1);
                }
              }}
              className="w-16 h-16 flex items-center justify-center text-2xl font-bold text-blue-600 bg-blue-50 rounded-full hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-sm"
              disabled={
                numberOfTeams >= Math.min(Math.floor(players.length / 2), 10)
              }
            >
              +
            </button>
          </div>

          <button
            onClick={() => onGenerateTeams(numberOfTeams)}
            className="w-full py-4 inline-flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-lg font-medium rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg active:translate-y-0"
          >
            <FaRandom className="w-5 h-5" />
            টিম তৈরি করুন
          </button>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600  py-2 rounded-lg inline-block">
            সর্বনিম্ন ২টি এবং সর্বোচ্চ{" "}
            <span className="font-medium text-blue-600">
              {convertToBengaliNumber(
                Math.min(Math.floor(players.length / 2), 10)
              )}
            </span>{" "}
            টি টিম তৈরি করা যাবে
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default GenerateTeamModal;
