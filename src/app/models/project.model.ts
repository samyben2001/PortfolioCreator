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

export interface ProjectUpdate extends ProjectCreation {
    id: number
    skill: Skill[]
    media: Media[]
}

export interface Project extends ProjectUpdate {
    id: number
    creationDate: Date
    lastUpdateDate?: Date
    skill: Skill[]
    media: Media[]
}