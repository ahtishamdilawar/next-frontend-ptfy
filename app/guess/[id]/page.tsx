"use client";
import React, { useState } from "react";
import axios from "axios";
import { Spotify } from "react-spotify-embed";
import Rating from "@mui/material/Rating";
import { styled } from "@mui/system";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useRouter } from "next/navigation"; // Import the useRouter hook
import { Session } from "inspector";
const domain = "https://3.7.248.219";
interface props {
  params: { id: string };
}

interface Token {
  accessToken: string;
}
interface RatingSession {
  sessionid: string;
  name: string;
  songs: string[]; //yehi kehra hun khapna prhrha sessionId kese layen kiunke redirect kliye id chiye wo idhr tou hardcode kiya mene
}

interface rate {
  songId: string;
  rating: number;
}
interface Guess {
  guesserName: string;
  guesses: { songId: string; guess: number }[];
}
// const [rates, setRates] = React.useState<rate[]>([]);

const StyledRating = styled(Rating)({
  "& .MuiRating-iconFilled": {
    color: "#ff6d75",
    fontsize: "4rem",
  },
  "& .MuiRating-iconHover": {
    color: "#ff3d47",
    fontsize: "4rem",
  },
});

const GuessPage = ({ params: { id } }: props) => {
  const [name, setName] = React.useState<string>("");
  const [ownerName, setOwnerName] = React.useState<string>("");
  const [guesses, setGuesses] = useState<Guess>({
    guesserName: "",
    guesses: [],
  });
  const Router = useRouter();
  const modalRef = React.useRef<HTMLDialogElement>(null);
  const [rates, setRates] = useState<rate[]>([]);
  const [accuracyScore, setAccuracyScore] = useState<number>(0);
  const [ratingSession, setRatingSession] = React.useState<RatingSession>();
  const setGuessesHandler = (songId: string, rating: number) => {
    const newGuesses = guesses.guesses.filter(
      (guess) => guess.songId !== songId
    );
    newGuesses.push({ songId, guess: rating });
    setGuesses({
      guesserName: name,
      guesses: newGuesses,
    });
  };
  const getRating = async (id: string): Promise<RatingSession | null> => {
    try {
      const response = await axios.get(`${domain}/share/${id}`);
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  };
  React.useEffect(() => {
    getRating(id).then((session) => {
      if (session) {
        setRatingSession(session);
      }
    });
  }, [id]);

  const doneHandler = async () => {
    if (guesses.guesses.length !== 5) {
      console.log("Please guess all songs");
      alert("Please guess all songs.");
    }
    if (name === "") {
      alert("Please enter your name");
    }
    try {
      const resp = await axios.post(`${domain}/share/${id}/guess`, guesses);
      setAccuracyScore(resp.data.accuracyScore);
      console.log("Ratings guessed successfully", resp);

      modalRef.current?.showModal();
    } catch (error) {
      console.error("Error posting guess:", error);
    }
  };
  const closeBtnHandler = () => {
    Router.push(`/leaderboard/${id}`);
  };

  return (
    <div className="p-2">
      <div className="text-4xl m-4 font-franie text-green-600 text-center">
        <h1>
          Guess how much{" "}
          <span className="text-amber-300"> {ratingSession?.name} </span>
          rated these songs{" "}
        </h1>{" "}
        <div className="join my-[5rem]">
          <input
            className="namebox input input-bordered join-item"
            placeholder="Name"
            onChange={(e) => setName(e.target.value)}
          />
          {/* <button className="btn join-item rounded-r-full font-sans">
            Enter
          </button> */}
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-7 justify-center items-center flex-wrap max-w-[75rem] my-7 mx-auto">
        {ratingSession?.songs.map((songId) => (
          <div key={songId}>
            <Spotify
              link={"https://open.spotify.com/track/" + songId}
              height="352"
              width="100%"
              frameBorder="1"
              theme="0"
              style={{ borderRadius: "14px" }}
              className="card-title"
            />
            <div className=" py-4 flex justify-center items-start ">
              <StyledRating
                name="customized-color"
                defaultValue={-1}
                getLabelText={(value: number) =>
                  `${value} Heart${value !== 1 ? "s" : ""}`
                }
                size="large"
                precision={1}
                icon={<FavoriteIcon fontSize="inherit" />}
                emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
                onChange={(event, newValue) => {
                  if (newValue !== null) {
                    setGuessesHandler(songId, newValue);
                  }
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center items-start mb-10">
        <button
          className="btn btn-outline btn-success w-[7rem]"
          onClick={doneHandler}
        >
          Done
        </button>
      </div>
      <dialog ref={modalRef} className="modal sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg flex items-center justify-center">
            Your score is {accuracyScore} / 50
          </h3>

          <div className="modal-action flex items-center justify-center">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn" onClick={closeBtnHandler}>
                Check Leaderboard
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default GuessPage;
