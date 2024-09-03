import React from 'react';
import { MinecraftText } from 'src/components';
import * as Utils from 'src/utils';
import { getPlayerRank } from 'src/utils/hypixel';

/**
 * Hypixel player username with rank & colors in Minecraft font
 *
 * @param {string} props.username    Player's username
 * @param {Object} props.player      Player data JSON object
 * @param {string} props.size        Font size
 */
export function PlayerName(props) {

	const voxyl = props.voxyl || {};
	// console.log(voxyl);
	const stats = {
		name: props.username || '',
		rank: voxyl.role || 'None',
	}

	function getNameWithRank(stats) {
		const ranks = {
			undefined : `§7${stats.name}`,
			None : `§7${stats.name}`,
			Adept: `§2[Adept] ${stats.name}`,
			Expert : `§9[§lExpert] ${stats.name}`,
			Master : `§6[Master] ${stats.name}`,
			Mod : `§e[Mod] ${stats.name}`,
			SrMod : `§e[SrMod] ${stats.name}`,
			Builder: `§d[Builder] ${stats.name}`,
			Admin : `§c[Admin] ${stats.name}`,
			Manager : `§4[Manager] ${stats.name}`,
			Owner : `§c[Owner] ${stats.name}`,
			Youtube : `§c[§fYoutube§c] ${stats.name}`,
		}
		if (stats.prefix !== undefined) {
			return `${stats.prefix} ${stats.name}`
		}
		return ranks[stats.rank];
	}

	return (
		<MinecraftText size={props.size}>
			{getNameWithRank(stats)}
		</MinecraftText>
		);
}