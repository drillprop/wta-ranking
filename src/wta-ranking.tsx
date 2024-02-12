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
            detail={
              <List.Item.Detail
                metadata={
                  <List.Item.Detail.Metadata>
                    <List.Item.Detail.Metadata.Label title="Age" text={player.age.toString()} />
                    <List.Item.Detail.Metadata.Label title="Country" text={player.country} />
                    <List.Item.Detail.Metadata.Separator />
                    <List.Item.Detail.Metadata.Label title="Current ranking" text={player.ranking.toString()} />
                    <List.Item.Detail.Metadata.Label
                      title="Ranking change from previous release"
                      text={player.rankingChange?.toString() || "0"}
                    />
                    <List.Item.Detail.Metadata.Label title="Points" text={player.points?.toString()} />
                    <List.Item.Detail.Metadata.Label
                      title="Points change from previous release"
                      text={player.pointsChange?.toString() || "0"}
                    />
                    <List.Item.Detail.Metadata.Label title="Country rank" text={player.countryRank.toString()} />
                    <List.Item.Detail.Metadata.Separator />
                    <List.Item.Detail.Metadata.Label
                      title="Current tournament"
                      text={player.currentTournament || "-"}
                    />
                    <List.Item.Detail.Metadata.Label
                      title="Next points(if player wins next match)"
                      text={player.next?.toString() || "-"}
                    />
                    <List.Item.Detail.Metadata.Label
                      title="Max points(if player wins tournament)"
                      text={player.max?.toString() || "-"}
                    />
                  </List.Item.Detail.Metadata>
                }
              />
            }
          />
        ))}
      </List.Section>
    </List>
  );
};

export default WtaRanking;
