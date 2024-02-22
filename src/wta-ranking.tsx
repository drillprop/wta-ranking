import { Action, ActionPanel, Color, List } from "@raycast/api";
import { useFetch } from "@raycast/utils";
import { useState } from "react";
import { ListTag } from "./components/ListTag";
import { getCountryInfo } from "./utils/getCountryInfo";
import { getSignedNumberNotationInString } from "./utils/getSignedNumberNotation";
import { normalizeString } from "./utils/normalizeString";

type Player = {
	ranking: number;
	careerHigh: number;
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
	const { data: players, isLoading } = useFetch<Player[]>("http://127.0.0.1:8080/live-ranking");
	const [showDetails, setShowDetails] = useState(false);
	const [searchInput, setSearchInput] = useState<string>();

	const getRankingColor = (num: number) => {
		if (num === 0) {
			return Color.SecondaryText;
		}
		if (num > 0) {
			return Color.Green;
		}
		if (num < 0) {
			return Color.Red;
		}
	};

	const getAccesories = (player: Player): List.Item.Accessory[] | null | undefined => {
		if (showDetails) {
			return null;
		}
		return [
			...(player.pointsChange
				? [
						{
							tag: {
								value: getSignedNumberNotationInString(player.pointsChange),
								color: getRankingColor(player.pointsChange),
							},
						},
				  ]
				: []),
			{ text: `Points: ${player.points.toString()}` },
		];
	};

	const filteredPlayers = players?.filter((player) => {
		const normalizedName = normalizeString(player.name);
		const normalizedSearch = normalizeString(searchInput || "");
		return normalizedName.includes(normalizedSearch);
	});

	return (
		<List
			navigationTitle="Live wta ranking"
			isLoading={isLoading}
			searchBarPlaceholder="Search player"
			isShowingDetail={showDetails}
			filtering={false}
			onSearchTextChange={setSearchInput}
		>
			<List.Section title="Live WTA ranking">
				{filteredPlayers?.map((player, idx) => (
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
						title={`${player.ranking}. ${getCountryInfo(player.country).emoji} ${player.name}`}
						subtitle={player.rankingChange ? getSignedNumberNotationInString(player.rankingChange || 0) : undefined}
						accessories={getAccesories(player)}
						detail={
							<List.Item.Detail
								metadata={
									<List.Item.Detail.Metadata>
										<List.Item.Detail.Metadata.Label
											title={player.name}
											text={`${getCountryInfo(player.country).name} ${getCountryInfo(player.country).emoji}`}
										/>
										<List.Item.Detail.Metadata.Label title="Age" text={player.age.toString()} />
										<List.Item.Detail.Metadata.Label title="Points" text={player.points?.toString()} />
										<List.Item.Detail.Metadata.Separator />
										<ListTag title="Current ranking" text={player.ranking.toString()} color={Color.SecondaryText} />
										<ListTag
											title="Career high"
											text={player.careerHigh.toString()}
											color={player.ranking === player.careerHigh ? Color.Yellow : Color.SecondaryText}
										/>
										<ListTag
											title="Country rank"
											text={player.countryRank.toString()}
											color={player.countryRank === 1 ? Color.Yellow : Color.SecondaryText}
										/>
										<List.Item.Detail.Metadata.Separator />
										<ListTag
											title="Ranking change from previous release"
											text={getSignedNumberNotationInString(player.rankingChange || 0)}
											color={getRankingColor(player.rankingChange || 0)}
										/>
										<ListTag
											title="Points change from previous release"
											text={getSignedNumberNotationInString(player.pointsChange || 0)}
											color={getRankingColor(player.pointsChange || 0)}
										/>
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
