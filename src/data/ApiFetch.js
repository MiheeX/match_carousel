const apiUrl =
  "https://lmt.fn.sportradar.com/demolmt/en/Etc:UTC/gismo/event_fullfeed/0/1/12074";

const flagUrl = "https://img.sportradar.com/ls/crest/big/{flagId}.png";

export const fetchData = async () => {
  const response = await fetch(
    apiUrl //, {method: "GET"}
  );
  if (!response.ok) {
    throw new Error("Error getting data!");
  } else {
    return response.json();
  }
};

export function getFlagUrl(pTeamId) {
  const retFlagUrl = flagUrl.replace("{flagId}", pTeamId);
  return retFlagUrl;
}
