import React, { memo } from 'react';
import { Accordion, HorizontalLine } from 'src/components';
import { Box, Cell, Pair, Row, Table } from 'src/components/Stats';
import { BEDWARS as consts } from 'src/constants/hypixel';

import { useAPIContext } from 'src/hooks';
import * as Utils from 'src/utils';
import { getMostPlayed } from 'src/utils/hypixel';

/**
 * Stats accordion for Arena Brawl
 *
 * @param {number} props.index    The order in which to display the row (used by the dnd package)
 */
export const BedWars = memo((props) => {
	const {voxyl } = useAPIContext();
	const json = voxyl.stats || {};

 //  Boolean(Utils.add(json[`${id}`]?.['kills'], json[`${id}`]?.['wins'])) && 
	const gamemodes = consts.MODES.map(({id}) => id)
	function total(stat) {
		return Utils.add(...gamemodes.map(mode => json[mode]?.[stat]));
	}

	function getMostPlayedMode() {
		let mostPlayed = {};
		let mostPlays = 0;
		for (const mode of consts.MODES) {
			const plays = Utils.add(json[mode.id]?.['kills'], json[mode.id]?.['wins']);
			if (plays > mostPlays && mode.id) {
				mostPlays = plays;
				mostPlayed = mode;
			}
		}
		return mostPlayed;
	}

	// TODO: Implement this
	const mostPlayedMode = getMostPlayedMode(consts.MODES, 
		({id}) => Utils.add(json[`wins_${id}`], json[`losses_${id}`]));
	//

	const header = (
		<React.Fragment>
			<Box title="Kills">{total('kills')}</Box>
      		<Box title="Wins">{total('wins')}</Box>
		</React.Fragment>
		);

	const table = (
		<Table>
			<thead>
				<tr>
					<th>Mode</th>
					<th>Kills</th>
					<th>Wins</th>
					<th>Finals</th>
					<th>Beds</th>

				</tr>
			</thead>
			<tbody>
				{consts.MODES.map(({id, name}) => 
						<Row key={id} isHighlighted={id === mostPlayedMode.id}> 
						<Cell>{name}</Cell>
						<Cell>{json[`${id}`]?.['kills']}</Cell>
						<Cell>{json[`${id}`]?.['wins']}</Cell>
						<Cell>{json[`${id}`]?.['finals']}</Cell>
						<Cell>{json[`${id}`]?.['beds']}</Cell>
					</Row>
				)}
				{
					Boolean(Utils.add(total('wins'), total('kills'))) &&
					<Row id="">
						<Cell>Overall</Cell>
						<Cell>{total('kills')}</Cell>
						<Cell>{total('wins')}</Cell>
						<Cell>{total('finals')}</Cell>
						<Cell>{total('beds')}</Cell>

					</Row>
				}
			</tbody>
		</Table>
		);

	return Utils.isEmpty(json) ?
		<Accordion title={consts.TITLE} index={props.index} />
		:
		<Accordion title={consts.TITLE} header={header} index={props.index}>

			{table}
		</Accordion>
});