import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, ExternalLink, HorizontalLine, SocialMedia } from 'src/components';
import { Br, Box, Pair, Title, Progress, ProgressBar } from 'src/components/Stats';
import { APP } from 'src/constants/app';
import { HYPIXEL as consts } from 'src/constants/hypixel';
import { useAPIContext } from 'src/hooks';
import * as Utils from 'src/utils';
import { calculateNetworkLevel, getPlayerRank, getGuildMemberRank, getGuildMemberDailyGEXP, 
	getGuildMemberWeeklyGEXP, calculateChallengesCompleted } from 'src/utils/hypixel';

/**
 * Displays general Hypixel stats about the player in the Hypixel Context
 */
export function PlayerCard() {
	
	const {guild, mojang, status, voxyl } = useAPIContext();
	const json = voxyl || {};
	const beginningLevels = {
		1: 2000,
		2: 3000,
		3: 4000,
		4: 5000,
	}
	const networkLevel = json.level + Math.floor((json.exp / (json.level % 100 <= 4 ? beginningLevels[json.level % 100] : 5000)) * 100) / 100;

	function getPrestige(level) {
		level = Math.max(0, level); // Prevent negative levels
		const levelFloor = Math.floor(level);
		const prestige = (() => {
			for (const pres of consts.PRESTIGES.slice().reverse()) {
				if (pres.level <= levelFloor) return pres;
			}
		})();
		const prestigeIcon = (() => {
			for (const icon of consts.PRESTIGE_ICONS.slice().reverse()) {
				if (icon.level <= levelFloor) return icon.symbol;
			}
		})();

		const tag = `[${levelFloor}${prestigeIcon}]`;
		const coloredTag = tag.split('').map((char, index) => {
			const color = prestige.colormap[index];
			return color ? `§${color}${char}` : char;
		}).join('');

		return {tag: coloredTag, icon: prestigeIcon, ...prestige};
	}

	const prestige = getPrestige(networkLevel);

	function getProgressBar(level) {
		const levelFloor = Math.floor(level);
		const exp = level - levelFloor;
		const proportion = exp;
		const dataTip = `${Utils.formatNum(exp * 100)}%`;
		const beginningLevels = {
			1: 2000,
			2: 3000,
			3: 4000,
			4: 5000,
		}
		return (
			<React.Fragment>
			<span className={`px-1 c-${getPrestige(Math.floor(networkLevel)).color}`}>
				{Math.floor(networkLevel)}
			</span>
			<div className="flex-1">
				<ProgressBar 
					dataTip={`${Utils.formatNum(json.exp)}/${Utils.formatNum(Math.floor(networkLevel) % 100 <= 4 ? beginningLevels[Math.floor(networkLevel) % 100] : 5000)} XP`}>
					<Progress 
						proportion={networkLevel - Math.floor(networkLevel)}
						color={prestige.color}
						dataTip={`${Utils.formatNum(json.exp)}/${Utils.formatNum(Math.floor(networkLevel) % 100 <= 4 ? beginningLevels[Math.floor(networkLevel) % 100] : 5000)} XP`} />
				</ProgressBar>
			</div>
			<span className={`px-1 c-${getPrestige(Math.floor(networkLevel) + 1).color}`}>
				{Math.floor(networkLevel) + 1}
			</span>
		</React.Fragment>
		);
	}
	
	
	const overallStats = (
		<React.Fragment>
			
			<Pair title="Total Kills">
				{Utils.sumProperty(json.stats, 'kills')}
			</Pair>
			<Pair title="Total Wins">
				{Utils.sumProperty(json.stats, 'wins')}
			</Pair>
			<Pair title="Total Finals">
				{Utils.sumProperty(json.stats, 'finals')}
			</Pair>
			<Pair title="Total Beds">
				{Utils.sumProperty(json.stats, 'beds')}
			</Pair>
			{/* <Br /> */}
			{/* <Pair title={<Link to={`/achievements/${mojang.username}`} className="link">Achievements</Link>}>
				{'50/62'}
			</Pair> */}
			<Br />
		</React.Fragment>
	);

	const loginDates = ( 
		<React.Fragment>
			{json.lastLoginTime !== undefined &&
				<Pair title="Last Login">
					{Utils.dateFormat(json.lastLoginTime * 1000)}
				</Pair>
			}
			{/* <Br/> */}
		</React.Fragment>
	);

	
	function guildInfo() {
		if (guild) {
			const member = guild.player
			const rank = member.guildRole
			
			// hardcoded because api doesnt provide anything + users can only be these roles in a guild
			const rankJson = {
				MEMBER: {name: 'Member'},
				MODERATOR: {name: 'Moderator'},
				ADMIN: {name: 'Admin'},
				OWNER: {name: 'Owner'},
			}
			const userRankJson = rankJson[rank]

			
			return (
				<React.Fragment>
					<HorizontalLine className="mt-3"/>
					<Link to={`/guild/${mojang.username}`} className="link">
						<Title>Guild</Title>
					</Link>
					<Pair title="Name" color={guild.tagColor}>{guild.name}</Pair>
					<Pair title="Members">{guild.members.length}</Pair>
					<Br />
					<Pair title="Rank">
						<span>{userRankJson.name}</span>
					</Pair>
					<Pair title="Joined">{Utils.dateFormat(member.joinTime * 1000)}</Pair>
				</React.Fragment>
				);
		}
	}

	//hopefully they add status endpoint in the future

	// function statusInfo() {
	// 	const { online, gameType, mode, map } = status;
	// 	if (online) {
	// 		const displayGameType = Utils.traverse(HYPIXEL.GAMES, String(gameType), gameType);
	// 		const displayMode = mode === 'LOBBY' ? 'Lobby' : Utils.traverse(HYPIXEL.MODES, `${gameType}.${mode}`, mode);
	// 		const showMode = (() => {
	// 			const noModeGameTypes = ['REPLAY'];
	// 			return Boolean(mode) && !noModeGameTypes.includes(gameType);
	// 		})();
	// 		const showMap = (() => {
	// 			const noMapGameTypes = ['BUILD_BATTLE', 'HOUSING', 'REPLAY'];
	// 			const noMapArcadeModes = ['DAYONE', 'DEFENDER', 'DRAGONWARS2', 'DROPPER', 'SOCCER', 'STARWARS', 'SIMON_SAYS', 'PARTY', 'DRAW_THEIR_THING', 'PIXEL_PARTY', 'THROW_OUT'];
	// 			return Boolean(map) && !noMapGameTypes.includes(gameType) && !(gameType === 'ARCADE' && noMapArcadeModes.includes(mode));
	// 		})();

	// 		return (
	// 			<React.Fragment>
	// 				<HorizontalLine className="mt-3"/>
	// 				<Title>Online Status</Title>
	// 				{Boolean(gameType) && 
	// 					<Pair title="Game">{displayGameType}</Pair>
	// 				}
	// 				{showMode &&
	// 					<Pair title="Mode">{displayMode}</Pair>
	// 				}
	// 				{showMap && 
	// 					<Pair title="Map">{map}</Pair>
	// 				}
	// 			</React.Fragment>
	// 			);
	// 	}
	// }

	return (
		<Card className="px-2 pt-1 pb-3 my-1">
			<div className="h-flex w-100 justify-content-center">
				<Box title="Level" color="white">
					{prestige.tag}
				</Box>
			</div>
			<div className="h-flex w-100 justify-content-center">
				{getProgressBar(networkLevel)}
			</div>
			<HorizontalLine className="mb-3"/>
			{overallStats}
			{loginDates}
			{guildInfo()}
			{/* {statusInfo()} */}
		</Card>
		);
}