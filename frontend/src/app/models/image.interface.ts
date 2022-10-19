import { Metadata } from "./metadata.interface";

export interface Image {
    name: string,
    type: string,
    size: number,
    lastModified: number,
    url: string | ArrayBuffer | null,
    metadata?: Metadata
}