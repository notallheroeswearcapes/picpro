import { Metadata } from "./metadata.interface";

export interface Image {
    name: string,
    new: boolean,
    type?: string,
    size?: number,
    lastModified?: number,
    url?: string | ArrayBuffer | null,
    metadata?: Metadata
}