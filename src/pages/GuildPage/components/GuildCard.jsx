import React from 'react';
import reactStringReplace from 'react-string-replace';
import { Card, ExternalLink, GuildTag, HorizontalLine } from 'src/components';
import { Br, Pair, Progress, ProgressBar, Title } from 'src/components/Stats';
import { GUILD, HYPIXEL } from 'src/constants/hypixel';
import { useAPIContext } from 'src/hooks';
import * as Utils from 'src/utils';
import { HypixelLeveling } from 'src/utils/hypixel';

/**
 * The card on the left side of the page that contains info about the guild
 */
export function GuildCard() {
	const { guild } = useAPIContext();
	const hasTag = Boolean(guild.tag);
	const hasDesc = Boolean(guild.desc);


	return (
		<Card className="p-2 pb-3">
			{hasTag && 
				<div className="w-100 text-center text-shadow mb-1">
					<GuildTag guild={guild} size="xl" />
				</div> 
			}
			{hasDesc && 
				<div className="w-100 mb-3">
					{reactStringReplace(
						guild.desc,
						// Simpler and working regex pattern for matching URLs
						/(https?:\/\/[^\s/$.?#].[^\s]*)/g,
						(match, i) => <ExternalLink href={match} key={i}>{match}</ExternalLink>
					)}
				</div> 
			}
			{(hasTag || hasDesc) && <HorizontalLine className="mb-3" />}
			
			<Pair title="Created">{Utils.dateFormat(guild.time * 1000)}</Pair>
			<Br />
			<Pair title="Members">{guild.members.length}</Pair>
			
			<Pair title="Experience">{guild.xp}</Pair>

		</Card>
		);
}