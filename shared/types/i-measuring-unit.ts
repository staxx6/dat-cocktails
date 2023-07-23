import { IFilter } from "./i-filter";

export interface MeasuringUnit {
	id: number,
	name: string,
	description?: string
}

export interface MeasuringUnitFilter extends IFilter {
}
