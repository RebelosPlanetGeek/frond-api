import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

const PlayersData = {};

wss.on("connection", function connection(ws) {
  ws.on("message", function message(data) {
    const ParsedData = JSON.parse(data);
    if (ParsedData.type === "playerdata") {
      const { PlayerID, position, velocity, rotation, health } =
        ParsedData.data;
      PlayersData[PlayerID] = { ws, position, velocity, rotation, health };
      BroadcastInformation(ws, PlayerID);
    }
  });
});
// Object.entries(PlayersData).map(([PlayerID, PlayersData]) => ({
//   PlayerID,
//   ...PlayersData,
// }));
function BroadcastInformation(currentClient, CurrentPlayerID) {
  // const DataToBeUpdated = {
  //   type: "allPlayersData",
  //   data: [],
  // };
  const CurrentPlayerData = {
    PlayerID: CurrentPlayerID,
    ...PlayersData[CurrentPlayerID],
  };
  for (const [PlayerID, playerdata] of Object.entries(PlayersData)) {
    const distante = CalculateDistance(
      playerdata.position,
      PlayersData[CurrentPlayerID].position
    );

    console.log(`PlayerID: ${PlayerID}, distante: ${distante}`);

    if (distante <= 1000) {
      const { ws, ...DataToSend } = CurrentPlayerData;
      playerdata.ws.send(
        JSON.stringify({
          type: "playerUpdate",
          data: DataToSend,
        })
      );
    }
  }
  // const DataToSendString = JSON.stringify(DataToBeUpdated);
  // wss.clients.forEach((client) => {
  //   client.send(DataToSendString);
  // });
}

function CalculateDistance(position1, position2) {
  console.log(position1);
  console.log(position2);
  const x = position1.x - position2.x;
  const y = position1.y - position2.y;
  const z = position1.z - position2.z;
  return Math.sqrt(x * x + y * y + z * z);
}
