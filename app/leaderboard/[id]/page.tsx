// "use client";
// import React, { useState } from "react";
// import axios from "axios";
// import { Spotify } from "react-spotify-embed";
// import Rating from "@mui/material/Rating";
// import { styled } from "@mui/system";
// import FavoriteIcon from "@mui/icons-material/Favorite";
// import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
// interface props {
//   params: { id: string };
// }

// interface Token {
//   accessToken: string;
// }

// interface Leaderboard {
//   sessionid: string;
//   spotifyId: string;
//   name: string;
//   accuracyScore: number;
// }

// // const [rates, setRates] = React.useState<rate[]>([]);

// const StyledRating = styled(Rating)({
//   "& .MuiRating-iconFilled": {
//     color: "#ff6d75",
//     fontsize: "4rem",
//   },
//   "& .MuiRating-iconHover": {
//     color: "#ff3d47",
//     fontsize: "4rem",
//   },
// });

// const getAccessToken = async (id: string) => {
//   const { data } = await axios.get(
//     `http://localhost:3000/auth/accessToken/${id}`
//   );
//   console.log(data);
//   return data;
// };
// const getLeaderboard = async (id: string): Promise<Leaderboard[]> => {
//   try {
//     const response = await axios.post(
//       `http://localhost:3000/leaderboard/6685328cc0feb149f3043fa1`
//     );
//     return response.data;
//   } catch (error) {
//     console.error(error);
//     return [];
//   }
// };

// const leaderboardPage = ({ params: { id } }: props) => {
//   const [accessToken, setAccessToken] = React.useState<Token>({
//     accessToken: "",
//   });
//   const [leads, setLeads] = React.useState<Leaderboard[]>([]);

//   //   React.useEffect(() => {
//   //     getAccessToken(id).then((data) => {
//   //       setAccessToken(data);
//   //     });
//   //   }, []);

//   React.useEffect(() => {
//     if (accessToken.accessToken) {
//     }
//   }, [accessToken]);
//   React.useEffect(() => {
//     getLeaderboard(id).then((data) => {
//       setLeads(data);
//     });
//   });

//   return (
//     <div className="p-2">
//       <div className="text-4xl m-4 font-franie text-green-600 text-center">
//         <h1>Leaderboard</h1>{" "}
//       </div>
//       <div className="flex flex-col md:flex-row gap-7 justify-center items-center flex-wrap max-w-[75rem] my-7 mx-auto">
//         <div className="overflow-x-auto">
//           <table className="table">
//             {/* head */}
//             <thead>
//               <tr>
//                 <th>Rank</th>
//                 <th>Name</th>
//                 <th>Score</th>
//               </tr>
//             </thead>
//             <tbody>
//               {/* row 1 */}
//               <tr>
//                 <th>1</th>
//                 <td>Cy Ganderton</td>
//                 <td>Quality Control Specialist</td>
//               </tr>
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default leaderboardPage;
"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

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
    const response = await axios.get(
      `http://localhost:3000/leaderboard/6685328cc0feb149f3043fa1`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

const LeaderboardPage = ({ params: { id } }: props) => {
  const [leads, setLeads] = useState<Leaderboard[]>([]);

  useEffect(() => {
    getLeaderboard(id).then((data) => {
      setLeads(data);
      console.log(data);
    });
  }, [id]);

  return (
    <div className="p-2">
      <div className="text-4xl m-4 font-franie text-green-600 text-center">
        <h1>Leaderboard</h1>
      </div>
      <div className="flex flex-col md:flex-row gap-7 justify-center items-center flex-wrap max-w-[75rem] my-7 mx-auto">
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
              {leads.map((lead, index) => (
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
