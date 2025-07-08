import React, { useState, useEffect } from 'react';
import { referralTasksPlaceholder } from './PlaceholderProvider';
const FrontEndUrl = import.meta.env.VITE_FRONTEND_URL;
const BackEndUrl = import.meta.env.VITE_BACKEND_URL;
import api from './Api';

const InviteFriendSection = () => {
    const [referralCode, setRefferalCode] = useState("");
    const [copied, setCopied] = useState(false);
    const [completedTasks, setCompletedTasks] = useState(referralTasksPlaceholder);
    const [incompleteTasks, setIncompleteTasks] = useState(referralTasksPlaceholder);


    const referralLink = `${FrontEndUrl}/register?ref=${referralCode}`;

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const accessToken = localStorage.getItem("accessToken");
                const response = await api.get(`${BackEndUrl}/referral-tasks`, { headers: { Authorization: `Bearer ${accessToken}`, }, });
                if (response.data.success) {
                    setCompletedTasks(response.data?.completedTasks || []);
                    setIncompleteTasks(response.data?.incompleteTasks || []);
                    setRefferalCode(response.data?.referralCode || '');
                }
            } catch (error) {
                console.error("Error fetching tasks:", error);
            }
        };
        fetchTasks();
    }, []);

    const copyLink = () => {
        navigator.clipboard.writeText(referralLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-gray-900 text-white rounded-2xl shadow-xl p-6 w-full">
            <h2 className="text-3xl font-extrabold mb-6">🎉 Referral Task</h2>
            <p className="mb-6 text-gray-300">
                Share your referral link and complete tasks to earn bonus points!
            </p>

            <div className="mb-6">
                <label className="block mb-2 text-sm font-medium">Your referral link</label>
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={referralLink}
                        readOnly
                        className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-sm"
                    />
                    <button
                        onClick={copyLink}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm"
                    >
                        {copied ? 'Copied!' : 'Copy'}
                    </button>
                </div>
            </div>

            {/* Incomplete Tasks */}
            {incompleteTasks.length > 0 && (
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">Incomplete Referral Tasks</h2>
                    <div className="grid gap-4">
                        {incompleteTasks.map(task => (
                            <div
                                key={task.id}
                                className="bg-gray-800 border border-gray-700 rounded-xl p-4 flex items-center justify-between"
                            >
                                <div>
                                    <div className="font-medium text-base">{task.title}</div>
                                    <div className="text-gray-400 text-sm">Reward</div>
                                </div>
                                <div className="font-bold text-lg">
                                    +{task.reward_point} pts
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Completed Tasks */}
            {completedTasks.length > 0 && (
                <div>
                    <h2 className="text-xl font-semibold mb-2">Completed Referral Tasks</h2>
                    <div className="grid gap-4">
                        {completedTasks.map(task => (
                            <div
                                key={task.id}
                                className="bg-gray-800 border border-gray-700 rounded-xl p-4 flex items-center justify-between opacity-60"
                            >
                                <div>
                                    <div className="font-medium text-base line-through">{task.title}</div>
                                    <div className="text-gray-500 text-sm">Completed</div>
                                </div>
                                <div className="text-gray-400 font-bold text-lg line-through">
                                    +{task.reward_point} pts
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default InviteFriendSection;
