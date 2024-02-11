import { Action, ActionPanel, List } from "@raycast/api";
import { useCachedState, useFetch } from "@raycast/utils";
import { getCountryEmoji } from "./utils/getCountryEmoji";

type Player = {
  ranking: number;
  name: string;
  age: number;
  points: number;
  country: string;
  countryRank: number;
  rankingChange: number | null;
  pointsChange: number | null;
  currentTournament: string | null;
  next: number | null;
  max: number | null;
};

const WtaRanking = () => {
  const { data: players, isLoading } = useFetch<Player[]>("http://127.0.0.1:8080/");
  const [showDetails, setShowDetails] = useCachedState("show-details", false);

  const getAccesories = (player: Player): List.Item.Accessory[] | null | undefined => {
    if (showDetails) {
      return null;
    }
    return [{ text: `Points: ${player.points.toString()}` }];
  };

  return (
    <List navigationTitle="Live wta ranking" isLoading={isLoading} isShowingDetail={showDetails}>
      <List.Section>
        {players?.map((player, idx) => (
          <List.Item
            actions={
              <ActionPanel>
                <Action
                  title={showDetails ? "Hide Details" : "Show Details"}
                  onAction={() => setShowDetails((x) => !x)}
                />
              </ActionPanel>
            }
            key={idx}
            title={`${player.ranking}. ${getCountryEmoji(player.country)} ${player.name}`}
            subtitle={player.country}
            accessories={getAccesories(player)}
          />
        ))}
      </List.Section>
    </List>
  );
};

export default WtaRanking;
