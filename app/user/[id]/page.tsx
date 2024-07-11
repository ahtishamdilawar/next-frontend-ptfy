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
  },
  "& .MuiRating-iconHover": {
    color: "#ff3d47",
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
    <div>
      <StyledRating
        name="customized-color"
        defaultValue={2}
        getLabelText={(value: number) =>
          `${value} Heart${value !== 1 ? "s" : ""}`
        }
        precision={0.5}
        icon={<FavoriteIcon fontSize="inherit" />}
        emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
      />
      {songs.map((song) => (
        <div key={song.trackid}>
          <Spotify
            link={"https://open.spotify.com/track/" + song.trackid}
            height="152"
            width="100%"
            frameBorder="1"
            theme="0"
            style={{ borderRadius: "14px" }}
            className="card-title"
          />
          <h3 className="card-body h-auto w-mx">{song.trackname}</h3>
          <p className="card-actions">{song.trackArtist}</p>
        </div>
      ))}
    </div>
  );
};

export default VerifyUserPage;
