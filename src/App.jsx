import React, { useState } from "react";
import {
  ControlBar,
  GridLayout,
  LiveKitRoom,
  ParticipantTile,
  RoomAudioRenderer,
  useTracks,
} from "@livekit/components-react";

import "@livekit/components-styles";
import { Track } from "livekit-client";

const serverUrl = "wss://fifth-tt62loqo.livekit.cloud";

export default function App() {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);

  // Function to fetch the room token
  const getRoomToken = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://roomtoken.onrender.com/getToken"); // Replace with your actual API endpoint
      const data = await response.json();
      setToken(data); // Assuming the API returns a JSON with a token field
    } catch (error) {
      console.error("Error fetching token:", error);
    } finally {
      setLoading(false);
    }
  };
  // Function to fetch the room token using POST
  // const getRoomToken = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await fetch("https://voicebotconfig.softcube.co.in/get_room_token", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         // Add necessary payload here if the API expects it
  //         unique_code: "PRRHRA", // example payload
  //         // identity: "user123",   // example identity
  //       }),
  //     });

  //     const data = await response.json();

  //     setToken(data.data?.room_token); // Assuming the token is in data.token
  //   } catch (error) {
  //     console.error("Error fetching token:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div>
      <button onClick={getRoomToken} disabled={loading}>
        {loading ? "Loading..." : "AI Assistant"}
      </button>

      {token ? (
        <LiveKitRoom
          video={true}
          audio={true}
          token={token}
          serverUrl={serverUrl}
          data-lk-theme="default"
          style={{ height: "100vh" }}
        >
          <MyVideoConference />
          <RoomAudioRenderer />
          <ControlBar />
        </LiveKitRoom>
      ) : (
        <p>Please click the AI Assistant button to join the room</p>
      )}
    </div>
  );
}

function MyVideoConference() {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  );

  return (
    <GridLayout
      tracks={tracks}
      style={{ height: "calc(100vh - var(--lk-control-bar-height))" }}
    >
      <ParticipantTile />
    </GridLayout>
  );
}
