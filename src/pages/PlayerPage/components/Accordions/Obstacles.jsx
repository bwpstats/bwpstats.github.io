import React, { memo } from 'react';
import { Accordion, HorizontalLine } from 'src/components';
import { Box, Cell, Pair, Row, Table } from 'src/components/Stats';
import { OBSTACLES as consts } from 'src/constants/hypixel';

import { useAPIContext } from 'src/hooks';
import * as Utils from 'src/utils';
import { getMostPlayed } from 'src/utils/hypixel';

/**
 * Stats accordion for Arena Brawl
 *
 * @param {number} props.index    The order in which to display the row (used by the dnd package)
 */
export const Obstacles = memo((props) => {
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
			const plays = json[mode.id]?.['wins'];
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
      		<Box title="Wins">{total('wins')}</Box>
		</React.Fragment>
		);

	const table = (
		<Table>
			<thead>
				<tr>
					<th>Mode</th>
					<th>Wins</th>

				</tr>
			</thead>
			<tbody>
				{consts.MODES.map(({id, name}) => 
						<Row key={id} isHighlighted={id === mostPlayedMode.id}> 
						<Cell>{name}</Cell>
						<Cell>{json[`${id}`]?.['wins']}</Cell>
					</Row>
				)}
				{
					Boolean(Utils.add(total('wins'), total('kills'))) &&
					<Row id="">
						<Cell>Overall</Cell>
						<Cell>{total('wins')}</Cell>

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