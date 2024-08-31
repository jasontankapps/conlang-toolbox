import React from 'react';
import {
	settingsSharp,
	chatboxEllipsesSharp,
	gridOutline,
	documentTextOutline,
	optionsOutline,
	enterOutline,
	exitOutline,
	logOutOutline,
	logInOutline,
	helpOutline
} from 'ionicons/icons';

import {
	ConceptsIcon,
	IonIconProps,
	LexiconIcon,
	MorphoSyntaxIcon,
	WordEvolveIcon,
	WordGenIcon,
	DeclenjugatorIcon,
	SyllablesIcon,
	TransformationsIcon,
	SoundChangesIcon,
	DJGroupsIcon
} from './icons';
import { tc } from './translators';

type Parents = 'ms' | 'dj' | 'wg' | 'we';

export interface AppPage {
	url: string
	title: string
	MenuIcon?: React.FC<IonIconProps>
	menuIcon?: string
	Icon?: React.FC<IonIconProps>
	icon?: string
	noIcon?: string
	id: string
	parent?: Parents
	parentOf?: string
	tab?: string
	tabTitle?: string
	hidden?: boolean
}
export interface MenuSection {
	header?: string
	note?: string
	pages: AppPage[]
	id: string
}

export interface AppPageObject {
	wg?: AppPage[]
}

export const appMenuInfo: MenuSection[] = [
	{
		header: tc("appTitle"),
		note: tc("appSubtitle"),
		pages: [
			{
				title: tc("MorphoSyntax"),
				url: '/ms',
				MenuIcon: (props) => <MorphoSyntaxIcon {...props} />,
				id: 'menuitemSyntax',
				parentOf: 'ms'
			},
			{
				title: tc("Overview"),
				url: '/ms/overview',
				id: 'menuitemMSOverview',
				icon: helpOutline,
				parent: 'ms',
				tab: 'Section-Overview',
				hidden: true
			},
			{
				title: tc("Settings"),
				url: '/ms/msSettings',
				id: 'menuitemMSSettings',
				icon: settingsSharp,
				parent: 'ms',
				tab: 'Section-Settings'
			},
			{
				title: tc("1-Morphological Typology", { ns: "ms" }),
				noIcon: '1',
				tab: 'Section-01',
				url: '/ms/ms01',
				id: 'menuitemMS1',
				parent: 'ms'
			},
			{
				title: tc("2-Grammatical Categories", { ns: "ms" }),
				noIcon: '2',
				tab: 'Section-02',
				url: '/ms/ms02',
				id: 'menuitemMS2',
				parent: 'ms'
			},
			{
				title: tc("3-Constituent Order Typology", { ns: "ms" }),
				noIcon: '3',
				tab: 'Section-03',
				url: '/ms/ms03',
				id: 'menuitemMS3',
				parent: 'ms'
			},
			{
				title: tc("4-Noun Operations", { ns: "ms" }),
				noIcon: '4',
				tab: 'Section-04',
				url: '/ms/ms04',
				id: 'menuitemMS4',
				parent: 'ms'
			},
			{
				title: tc("5-Predicate Nominals etc.", { ns: "ms" }),
				noIcon: '5',
				tab: 'Section-05',
				url: '/ms/ms05',
				id: 'menuitemMS5',
				parent: 'ms'
			},
			{
				title: tc("6-Grammatical Relations", { ns: "ms" }),
				noIcon: '6',
				tab: 'Section-06',
				url: '/ms/ms06',
				id: 'menuitemMS6',
				parent: 'ms'
			},
			{
				title: tc("7-Voice/Valence Operations", { ns: "ms" }),
				noIcon: '7',
				tab: 'Section-07',
				url: '/ms/ms07',
				id: 'menuitemMS7',
				parent: 'ms'
			},
			{
				title: tc("8-Other Verb Operations", { ns: "ms" }),
				noIcon: '8',
				tab: 'Section-08',
				url: '/ms/ms08',
				id: 'menuitemMS8',
				parent: 'ms'
			},
			{
				title: tc("9-Pragmatic Marking", { ns: "ms" }),
				noIcon: '9',
				tab: 'Section-09',
				url: '/ms/ms09',
				id: 'menuitemMS9',
				parent: 'ms'
			},
			{
				title: tc("10-Clause Combinations", { ns: "ms" }),
				noIcon: '10',
				tab: 'Section-10',
				url: '/ms/ms10',
				id: 'menuitemMS10',
				parent: 'ms'
			},
			{
				title: tc("WordGen"),
				url: '/wg',
				MenuIcon: (props) => <WordGenIcon {...props} />,
				id: 'menuitemWG',
				parentOf: 'wg'
			},
			{
				title: tc("Overview"),
				url: '/wg/overview',
				tab: 'overview',
				id: 'menuitemWGoverview',
				icon: helpOutline,
				parent: 'wg',
				hidden: true
			},
			{
				title: tc("CharGroups", { ns: "wgwe" }),
				url: '/wg/charGroups',
				tab: 'charGroups',
				tabTitle: tc("CharGroups", { ns: "wgwe", context: "shorter" }),
				id: 'menuitemWGcharGroup',
				icon: gridOutline,
				parent: 'wg'
			},
			{
				title: tc("SyllablesTitle", { ns: "wg" }),
				url: '/wg/syllables',
				tab: 'syllables',
				id: 'menuitemWGsyl',
				Icon: (props) => <SyllablesIcon {...props} />,
				parent: 'wg'
			},
			{
				title: tc("Transformations", { ns: "wgwe" }),
				url: '/wg/transforms',
				tab: 'transforms',
				tabTitle: tc("Transformations", { ns: "wgwe", context: "shorter" }),
				id: 'menuitemWGrew',
				Icon: (props) => <TransformationsIcon {...props} />,
				parent: 'wg'
			},
			{
				title: tc("Output"),
				url: '/wg/output',
				tab: 'output',
				id: 'menuitemWGout',
				icon: documentTextOutline,
				parent: 'wg'
			},
			{
				title: tc("Settings"),
				url: '/wg/settings',
				tab: 'settings',
				id: 'menuitemWGset',
				icon: optionsOutline,
				parent: 'wg'
			},
			{
				title: tc("WordEvolve"),
				url: '/we',
				MenuIcon: (props) => <WordEvolveIcon {...props} />,
				id: 'menuitemWE',
				parentOf: 'we'
			},
			{
				title: tc("Overview"),
				url: '/we/overview',
				tab: 'overview',
				id: 'menuitemWEoverview',
				icon: helpOutline,
				parent: 'we',
				hidden: true
			},
			{
				title: tc("Input"),
				url: '/we/input',
				tab: 'input',
				id: 'menuitemWEinp',
				icon: enterOutline,
				parent: 'we'
			},
			{
				title: tc("CharGroups", { ns: "wgwe" }),
				url: '/we/charGroups',
				tab: 'charGroups',
				tabTitle: tc("CharGroups", { ns: "wgwe", context: "shorter" }),
				id: 'menuitemWEcharGroup',
				icon: gridOutline,
				parent: 'we'
			},
			{
				title: tc("Transformations", { ns: "wgwe" }),
				url: '/we/transformations',
				tab: 'transformations',
				tabTitle: tc("Transformations", { ns: "wgwe", context: "shorter" }),
				id: 'menuitemWEtns',
				Icon: (props) => <TransformationsIcon {...props} />,
				parent: 'we'
			},
			{
				title: tc("SoundChanges", { ns: "we" }),
				url: '/we/soundchanges',
				tab: 'soundchanges',
				tabTitle: tc("SoundChanges", { ns: "we", context: "shorter" }),
				id: 'menuitemWEscs',
				Icon: (props) => <SoundChangesIcon {...props} />,
				parent: 'we'
			},
			{
				title: tc("Output"),
				url: '/we/output',
				tab: 'output',
				id: 'menuitemWEout',
				icon: exitOutline,
				parent: 'we'
			},
			{
				title: tc("Declenjugator"),
				url: '/dj',
				MenuIcon: (props) => <DeclenjugatorIcon {...props} />,
				id: 'menuitemDJ',
				parentOf: 'dj'
			},
			{
				title: tc("Overview"),
				url: '/dj/overview',
				tab: 'overview',
				id: 'menuitemDJoverview',
				hidden: true,
				parent: 'dj'
			},
			{
				title: tc("Input"),
				url: '/dj/input',
				tab: 'input',
				id: 'menuitemDJinp',
				icon: logInOutline,
				parent: 'dj'
			},
			{
				title: tc("Groups", { ns: "dj" }),
				url: '/dj/groups',
				tab: 'groups',
				id: 'menuitemDJgroup',
				Icon: (props) => <DJGroupsIcon {...props} />,
				parent: 'dj'
			},
			{
				title: tc("Output"),
				url: '/dj/output',
				tab: 'output',
				id: 'menuitemDJout',
				icon: logOutOutline,
				parent: 'dj'
			},
			/*{ // https://github.com/apache/cordova-plugin-media
				title: tc("PhonoGraph"),
				url: '/ph',
				menuIcon: volumeHighSharp,
				id: 'menuitemPG'
			},*/
			{
				title: tc("Lexicon"),
				url: '/lex',
				MenuIcon: (props) => <LexiconIcon {...props} />,
				id: 'menuitemLX'
			},
			{
				title: tc("Concepts"),
				url: '/wordlists',
				MenuIcon: (props) => <ConceptsIcon {...props} />,
				id: 'menuitemConcepts'
			}
		],
		id: 'menuMain'
	},
	{
		pages: [
			{
				title: tc("Settings"),
				url: '/settings',
				menuIcon: settingsSharp,
				id: 'menuitemSettings'
			},
			{
				title: tc("Main"),
				url: '/',
				menuIcon: chatboxEllipsesSharp,
				id: 'menuitemAbout'
			}
		],
		id: 'menuOthers'
	},
	{
		pages: [
			{
				title: tc("AppInfo"),
				url: '/appinfo',
				id: 'menuitemAppInfo'
			}
		],
		id: 'menuCredits'
	}
];

const tempObject: {[key in Parents]: AppPage[]} = {
	ms: [],
	dj: [],
	wg: [],
	we: []
};

appMenuInfo[0].pages.forEach(page => {
	const { parent } = page;
	if(parent) {
		const pages: AppPage[] = [];
		const newPages = tempObject[parent] || pages;
		newPages.push(page);
		tempObject[parent] = newPages;
	}
});

export const appPagesObject = tempObject;
