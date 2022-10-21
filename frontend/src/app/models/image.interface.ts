import { Metadata } from "./metadata.interface";

export interface Image {
    name: string,
    file?: File,
    url?: string | ArrayBuffer | null,
    metadata?: Metadata
}