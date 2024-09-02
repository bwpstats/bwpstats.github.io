import { FaAward, FaUser, FaShieldAlt, FaScroll, FaPaw } from 'react-icons/fa';
import * as Page from 'src/pages';
export const PAGES = [
	{
		name: 'Player',
		about: 'Search for the stats of a BWP player',
		path: 'player',
		tags: ['player'],
		component: Page.PlayerPage,
		icon: FaUser
	},
	{
		name: 'Guild',
		about: 'Search for the guild of a BWP player',
		path: 'guild',
		tags: ['guild', 'g'],
		component: Page.GuildPage,
		icon: FaShieldAlt
	},
	// {
	// 	name: 'Achievements',
	// 	about: 'Search for the achievements of a Hypixel player',
	// 	path: 'achievements',
	// 	tags: ['achievements', 'a'],
	// 	component: Page.AchievementsPage,
	// 	icon: FaAward
	// },
]