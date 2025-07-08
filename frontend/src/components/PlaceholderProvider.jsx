import React from "react";
// Skeleton element for placeholder
// export const skeleton = () => (
//   <span className="inline-block h-4 w-full max-w-md bg-gray-700 rounded animate-pulse mx-auto" />
// );

const skeleton = "---"

function taskProvider(len, type) {
    const task = []
    for (let i = 0; i < len; i++) {
        if (type === "task") {
            task.push(
                {
                    id: i,
                    title: skeleton,
                    reward_point: skeleton,
                    platform: skeleton,
                    url: "#",
                }
            )
        } else if (type === "reffer") {
            task.push(
                {
                    id: i,
                    referralCode: skeleton,
                    title: skeleton,
                    reward_point: skeleton,
                }
            )
        } else if (type === "invest") {
            task.push(
                {
                    id: i,
                    title: skeleton,
                    reward_point: skeleton,
                    amount_required: skeleton,
                }
            )
        }


    }

    return task;
}


function leaderboadrProvider(len, type) {
    const leaderboard = []
    for (let i = 0; i < len; i++) {
        if (type === "topThree") {
            leaderboard.push(
            {
                id: i,
                avatar_url: "/img/fallback.png",
                name: skeleton,
                point: skeleton,
                rank: i+1
            }
        )
        }else if(type === "others"){
            leaderboard.push(
            {
                id: i,
                avatar_url: "/img/fallback.png",
                name: skeleton,
                point: skeleton,
                rank: i+4
            }
        )
        }

    }

    return leaderboard;

}


export const dashboardPlaceholder = {
    name: skeleton,
    point: skeleton,
    referral_number: skeleton,
    referBonus: skeleton,
    referral_code: skeleton,
    streak: skeleton
}


export const tasksPlaceholder = taskProvider(4, "task")

export const referralTasksPlaceholder = taskProvider(4, "reffer")

export const investmentTasksPlaceholder = taskProvider(4, "invest")

export const leaderboardPlaceholder = {
    topThree: leaderboadrProvider(3, "topThree"),

    others: leaderboadrProvider(7, "others"),

    currentUser: {
        avatar_url: "/img/fallback.png",
        name: skeleton,
        point: skeleton,
        rank: skeleton,
    }
}