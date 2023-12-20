import { Media } from "./media.model";
import { Project } from "./project.model";

export interface PortfolioCreation {
    title: string;
    description: string
    userId: string
    projects : Project[];
    mediaId?: number;
}

export interface Portfolio extends PortfolioCreation {
    id: number
    creationDate: Date
    lastUpdateDate?: Date
    media?: Media;
}