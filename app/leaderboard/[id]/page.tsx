"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
const domain = "http://localhost:3000";

interface props {
  params: { id: string };
}

interface Leaderboard {
  sessionid: string;
  spotifyId: string;
  name: string;
  accuracyScore: number;
}

const getLeaderboard = async (id: string): Promise<Leaderboard[]> => {
  try {
    const response = await axios.get(`${domain}/leaderboard/${id}`);
    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

const LeaderboardPage = ({ params: { id } }: props) => {
  const [leads, setLeads] = useState<Leaderboard[]>([]);
  const [link, setLink] = useState<string>(
    typeof window !== "undefined" ? `${window.location.origin}/guess/${id}` : ""
  );

  useEffect(() => {
    getLeaderboard(id).then((data) => {
      if (data.length === 0) {
        alert("No data found");
      }
      setLeads(data);
      console.log(data);
    });
  }, [id]);
  const copyToClipboard = () => {
    navigator.clipboard.writeText(link);
    alert("Link copied to clipboard!");
  };

  return (
    <div className="p-2">
      <div className="text-4xl m-4 flex items-center justify-center font-franie text-green-600 text-center">
        <h1>Leaderboard</h1>
      </div>
      <div className="flex justify-center items-center">
        <div className="flex items-center gap-4 text-white ">
          <input
            type="text"
            value={link}
            readOnly
            className="input input-bordered w-[25rem] px-2 py-1 rounded"
          />

          <a onClick={copyToClipboard} className="btn">
            <ContentCopyIcon />
          </a>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-7 justify-center items-center flex-wrap my-7 mx-auto">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Name</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {leads
                .sort((a, b) => b.accuracyScore - a.accuracyScore)
                .map((lead, index) => (
                  <tr key={lead.sessionid}>
                    <th>{index + 1}</th>
                    <td>{lead.name}</td>
                    <td>{lead.accuracyScore}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
