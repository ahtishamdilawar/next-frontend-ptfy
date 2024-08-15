"use client";
import React, { useState } from "react";
import axios from "axios";
import { Spotify } from "react-spotify-embed";
import Rating from "@mui/material/Rating";
import { styled } from "@mui/system";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
interface props {
  params: { id: string };
}

interface Token {
  accessToken: string;
}

interface Songs {
  trackid: string;
  trackname: string;
  trackArtist: string;
}
interface rate {
  songId: string;
  rating: number;
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

const getAccessToken = async (id: string) => {
  const { data } = await axios.get(
    `http://localhost:3000/auth/accessToken/${id}`
  );
  console.log(data);
  return data;
};

const getRating = async (id: string): Promise<Songs[]> => {
  try {
    let song1: Songs[] = [];

    const response = await axios.post(`http://localhost:3000/share/${id}`);
    song1[0] = response.data[0];

    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

const guessPage = ({ params: { id } }: props) => {
  const [accessToken, setAccessToken] = React.useState<Token>({
    accessToken: "",
  });
  const [songs, setSongs] = React.useState<Songs[]>([]);
  const [rates, setRates] = useState<rate[]>([]);
  React.useEffect(() => {
    getAccessToken(id).then((data) => {
      setAccessToken(data);
    });
  }, []);

  React.useEffect(() => {
    if (accessToken.accessToken) {
      getRating(id).then((data) => {
        setSongs(data);
      });
    }
  }, [accessToken]);
  //set the rating of the song in the rates array
  const setRating = (songId: string, rating: number) => {
    const index = rates.findIndex((rate) => rate.songId === songId);
    if (index === -1) {
      setRates([...rates, { songId, rating }]);
    } else {
      const newRates = [...rates];
      newRates[index].rating = rating;
      setRates(newRates);
    }
  };
  const doneHandler = async () => {
    const songs = rates;
    //check if all songs are rated
    if (songs.length !== 5) {
      alert("Please rate all songs");
      return;
    }
    try {
      const data = {
        spotifyId: id,
        songs,
      };
      const config = {
        headers: { Authorization: `Bearer ${accessToken.accessToken}` },
      };

      const resp = await axios.post(
        "http://localhost:3000/songs/rate",
        data,
        config
      );

      console.log("Ratings posted successfully", resp);
      alert("Ratings guessed successfully");
    } catch (error) {
      console.error("Error posting ratings:", error);
    }
  };

  return (
    <div className="p-2">
      <div className="text-4xl m-4 font-franie text-green-600 text-center">
        <h1>
          Rate the songs according to
          <span className="text-amber-300"> your </span>
          preference{" "}
        </h1>{" "}
      </div>
      <div className="flex flex-col md:flex-row gap-7 justify-center items-center flex-wrap max-w-[75rem] my-7 mx-auto">
        {songs.map((song) => (
          <div key={song.trackid}>
            <Spotify
              link={"https://open.spotify.com/track/" + song.trackid}
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
                    setRating(song.trackid, newValue);
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
    </div>
  );
};

export default guessPage;
