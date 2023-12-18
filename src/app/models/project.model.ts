import { Media } from "./media.model";
import { Skill } from "./skill.model";

export interface ProjectCreation {
    title: string;
    description: string
    endingDate?: Date
    portfolioId?: number
    mediaIds: number[]
    skillIds: number[]
}

export interface Project extends ProjectCreation {
    id: number
    creationDate: Date
    lastUpdateDate?: Date
    skill: Skill[]
    media: Media[]
}