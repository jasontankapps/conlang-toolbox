function reorganize <T extends unknown>(what: T[], from: number, to: number): T[] {
	const moved = what[from];
	const remains = what.slice(0, from).concat(what.slice(from + 1));
	return remains.slice(0, to).concat(moved, remains.slice(to));
};

export default reorganize
