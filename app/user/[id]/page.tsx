"use client";
import React from "react";
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

const getRandomSongs = async (
  accessToken: string,
  id: string
): Promise<Songs[]> => {
  try {
    let song1: Songs[] = [];
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    const body1 = {
      spotifyId: id,
    };
    const response = await axios.post(
      "http://localhost:3000/songs/random",
      body1,
      {
        headers,
      }
    );
    song1[0] = response.data[0];

    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

const VerifyUserPage = ({ params: { id } }: props) => {
  const [accessToken, setAccessToken] = React.useState<Token>({
    accessToken: "",
  });
  const [songs, setSongs] = React.useState<Songs[]>([]);

  React.useEffect(() => {
    getAccessToken(id).then((data) => {
      setAccessToken(data);
    });
  }, []);

  React.useEffect(() => {
    if (accessToken.accessToken) {
      getRandomSongs(accessToken.accessToken, id).then((data) => {
        setSongs(data);
      });
    }
  }, [accessToken]);

  return (
    <div className="p-2">
      <div className="text-4xl m-4 font-franie text-green-600 text-center">
        <h1>
          Rate the songs according to
          <span className="text-amber-300"> Ahtisham's </span>
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
                defaultValue={2}
                getLabelText={(value: number) =>
                  `${value} Heart${value !== 1 ? "s" : ""}`
                }
                size="large"
                precision={1}
                icon={<FavoriteIcon fontSize="inherit" />}
                emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center items-start mb-10">
        <button className="btn btn-outline btn-success w-[7rem]">Done</button>
      </div>
    </div>
  );
};

export default VerifyUserPage;
