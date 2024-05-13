export interface IArtwork {
    id: string;
    title: string;
    artistName: string;
    artistSurname: string;
    description?: string;
    creationYear?: string;
    medium?: string;
    width: number;
    height: number;
    url: string;
}
