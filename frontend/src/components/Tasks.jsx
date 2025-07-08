import React, { useEffect, useState } from "react";
import api from "./Api";
import SolanaInvestment from "./SolanaInvestment";
import { useSearchParams } from 'react-router-dom';
import TelegramConnect from "./TelegramConnect";
import InviteFriendSection from "./InviteTask";
import checkAndRefreshToken from "./CheckRegistration";
import Header from "./Header";
import Footer from "./Footer";
import LoadingSpinner from "./LoadingSpinner"
import { tasksPlaceholder } from "./PlaceholderProvider";


const BackEndUrl = import.meta.env.VITE_BACKEND_URL;

function Tasks() {
  const [completedTasks, setCompletedTasks] = useState(tasksPlaceholder);
  const [incompletedTasks, setIncompletedTasks] = useState(tasksPlaceholder);
  const [refreshFlag, setRefreshFlag] = useState(0);
  const [verifyComplete, setVerifyComplete] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState(null);
  const [searchParams] = useSearchParams();
  const [tgConnectError, setTgConnectError] = useState("");
  const [taskLoading, setTaskLoading] = useState(false)


  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken"); 
        const response = await api.get(`${BackEndUrl}/user-task`, {headers: {Authorization: `Bearer ${accessToken}`,},});
        if (response.data.success) {
          setCompletedTasks(response.data.completedTasks || []);
          setIncompletedTasks(response.data.incompleteTasks || []);
        }
        setTgConnectError(searchParams.get('tgError'));
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }finally{
        setTaskLoading(false)
      }
    };

    fetchTasks();
  }, [refreshFlag]);

  const handleTaskCompletion = async (taskId, reward_point) => {
    try {
      await checkAndRefreshToken();
      setTaskLoading(true)
      const accessToken = localStorage.getItem("accessToken");  
      await api.post(`${BackEndUrl}/complete-task`, { taskId, reward_point }, {headers: {Authorization: `Bearer ${accessToken}`,},});
    } catch (error) {
      console.error("Error completing task:", error);
    } finally {
      setRefreshFlag((prev) => prev + 1);
    }
  };

  const renderTaskCard = (task, isCompleted = false) => (
    <div
      key={task.id}
      className={`p-5 rounded-xl shadow-md bg-gray-800 flex flex-col gap-2 ${isCompleted ? "opacity-60" : ""}`}
    >
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">{task.title}</h2>
        <span className="text-sm bg-purple-700 text-white px-2 py-1 rounded">
          +{task.reward_point} pts
        </span>
      </div>

      <span className="text-sm text-gray-400 capitalize">Platform: {task.platform}</span>

      {verifyComplete && task.id === currentTaskId ? null : (
        task.platform === "Telegram" ? (
          <TelegramConnect errorMessage={tgConnectError} url={task.url} setId={() => { setCurrentTaskId(task.id); setVerifyComplete(true); }} isCompleted={isCompleted} />)
          :
          (<a
            href={task.url}
            onClick={() => { setCurrentTaskId(task.id); setVerifyComplete(true); }}
            target="_blank"
            rel="noopener noreferrer"
            className={`mt-3 px-4 py-2 rounded text-sm text-center font-medium transition ${isCompleted
              ? "bg-gray-600 cursor-not-allowed flex items-center gap-1"
              : "bg-purple-700 hover:bg-purple-600"
              }`}
          >
            Go to task →
          </a>)
      )}

      {verifyComplete && task.id === currentTaskId && (
        taskLoading ? <LoadingSpinner /> :
        (
          <button
            onClick={() => handleTaskCompletion(task.id, task.reward_point)}
            disabled={isCompleted}
            className={`mt-3 px-4 py-2 rounded text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200
              ${isCompleted
                ? "bg-gray-600 cursor-not-allowed text-gray-300"
                : "bg-teal-600 hover:bg-teal-500 border border-teal-400 text-white shadow-md hover:shadow-teal-400/30"
              }`}
          >
            {isCompleted ? <>Task Completed</> : <>Verify Task Completion</>}
          </button>
        )
      )}
    </div>
  );


  return (
    <div className="w-full min-h-screen bg-gray-950 text-white">

      {/* Navbar */}
      <Header tasks={true} />

      {/* Main Content */}
      <main className="px-4 py-10 max-w-5xl mx-auto">


        <h1 className="text-3xl font-bold mb-6 text-purple-400">🚀 Tasks</h1>
        <p className="text-md text-gray-300 mb-6 max-w-3xl mx-auto text-center">
          Welcome to your <span className="text-purple-400 font-semibold">Task Dashboard</span> — a place to explore, track, and complete various tasks for rewards.
          Whether you’re investing SOL or completing challenges, each task gets you closer to earning exciting perks.
          Connect your wallet and start making progress today!
        </p>

        {incompletedTasks.length > 0 && (
          <div className="mb-10">
            <h2 className="text-2xl font-semibold text-white mb-4">🕒 Incomplete Tasks</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {incompletedTasks.map((task) => renderTaskCard(task))}
            </div>
          </div>
        )}

        {completedTasks.length > 0 && (
          <div className="mb-10">
            <h2 className="text-2xl font-semibold text-white mb-4">✅ Completed Tasks</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {completedTasks.map((task) => renderTaskCard(task, true))}
            </div>
          </div>
        )}


        {/* Invite Friends Section */}
        <div className="mb-10">
          <InviteFriendSection />
        </div>


         {/* Invest Solana Section */}
          <SolanaInvestment />
        


        </main>

        <Footer />
    </div>
  );
}

export default Tasks;
