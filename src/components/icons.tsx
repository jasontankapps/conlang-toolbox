import React, { FC } from "react";
import { IonIcon } from "@ionic/react";
import {
	create,
//	createOutline
} from "ionicons/icons";

interface Map {
	[key: string]: string
}

const map: Map = {
	concepts: "thought-bubble-material-design",
	conceptsOutline: "thought-bubble-outline-material-design",
	lexicon: "notebook-material-design",
	lexiconOutline: "notebook-outline-material-design",
	morphoSyntax: "folder-table-material-design",
//	morphoSyntaxOutline: "folder-table-outline-material-design",
	wordEvolve: "pipe-icon-material-design",
//	wordEvolveOutline: "middleware-outline-material-design",
	syllables: "table-row-material-design",
	transformations: "transfer-right-material-design",
	soundChanges: "transit-connection-variant-material-design",
	declenjugator: "read-more-material-design",
	djGroups: "arrow-split-material-design",
	import: "open-in-new-material-altered"
};

export interface IonIconProps {
	color?: string
	flipRtl?: boolean
	icon?: string
	ios?: string
	lazy?: boolean
	md?: string
	mode?: 'ios' | 'md'
	name?: string
	size?: string
	src?: string
	className?: string
	slot?: string
}

interface IconProps extends IonIconProps {
	which: keyof Map
}

const Icon: FC<IconProps> = (props) => {
	const { which, ...rest } = props;
	return <IonIcon {...rest} src={`svg/${map[which]}.svg`}></IonIcon>;
};

export const ConceptsIcon: FC<IonIconProps> = (props) => <Icon which="concepts" {...props}></Icon>;
export const ConceptsOutlineIcon: FC<IonIconProps> = (props) => <Icon which="conceptsOutline" {...props}></Icon>;
export const LexiconIcon: FC<IonIconProps> = (props) => <Icon flipRtl which="lexicon" {...props}></Icon>;
export const LexiconOutlineIcon: FC<IonIconProps> = (props) => <Icon flipRtl which="lexiconOutline" {...props}></Icon>;
export const MorphoSyntaxIcon: FC<IonIconProps> = (props) => <Icon which="morphoSyntax" {...props}></Icon>;
//export const MorphoSyntaxOutlineIcon: FC<IonIconProps> = (props) => <Icon which="morphoSyntaxOutline" {...props}></Icon>;
export const WordEvolveIcon: FC<IonIconProps> = (props) => <Icon flipRtl which="wordEvolve" {...props}></Icon>;
//export const WordEvolveOutlineIcon: FC<IonIconProps> = (props) => <Icon flipRtl which="wordEvolveOutline" {...props}></Icon>;

export const WordGenIcon: FC<IonIconProps> = (props) => <IonIcon flipRtl {...props} icon={create}></IonIcon>;
//export const WordGenOutlineIcon: FC<IonIconProps> = (props) => <IonIcon flipRtl {...props} icon={createOutline}></IonIcon>;

export const SyllablesIcon: FC<IonIconProps> = (props) => <Icon flipRtl which="syllables" {...props}></Icon>;
export const TransformationsIcon: FC<IonIconProps> = (props) => <Icon flipRtl which="transformations" {...props}></Icon>;
export const SoundChangesIcon: FC<IonIconProps> = (props) => <Icon flipRtl which="soundChanges" {...props}></Icon>;
export const CopyFromOtherIcon: FC<IonIconProps> = (props) => <Icon flipRtl which="import" {...props}></Icon>

export const DeclenjugatorIcon: FC<IonIconProps> = (props) => <Icon flipRtl which="declenjugator" {...props}></Icon>;
export const DJGroupsIcon: FC<IonIconProps> = (props) => <Icon flipRtl which="djGroups" {...props}></Icon>;
