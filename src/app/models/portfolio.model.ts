import { Media } from "./media.model";
import { Project } from "./project.model";

export interface PortfolioCreation {
    title: string;
    description: string
    userId: string
    projects : Project[];
    mediaId?: number;
}

export interface PortfolioUpdate extends PortfolioCreation{
    id: number
}

export interface Portfolio extends PortfolioUpdate {
    creationDate: Date
    lastUpdateDate?: Date
    media?: Media;
}