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

const serverUrl = "wss://prakash-test-yqf3xc8h.livekit.cloud";

export default function App() {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);

  // Function to fetch the room token
  const getRoomToken = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/get_room_token"); // Replace with your actual API endpoint
      const data = await response.json();
      setToken(data.token); // Assuming the API returns a JSON with a token field
    } catch (error) {
      console.error("Error fetching token:", error);
    } finally {
      setLoading(false);
    }
  };

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
