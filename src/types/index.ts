export interface IUser {
    id: string;
    name: string;
    surname: string;
    userType: string;
    email: string;
    gender?: string;
    artistProfile?: IArtistProfile;
}
export interface IArtistProfile {
    id: string;
    biography?: string;
    links: string[];
    profilePic?: string;
    artworks: IArtwork[];
    coverImage?: string;
    artistId: string;
    user: IUser;
}

export interface IArtwork {
    id: string;
    title: string;
    artistName: string;
    artistSurname: string;
    description?: string;
    creationYear?: string;
    medium?: string;
    type?: string;
    width: number;
    height: number;
    artworkMedias: string[];
    exhibitionIds: string[];
    exhibitions: IExhibition[];
    artistId?: string;
    artist?: IArtistProfile;
}
export interface IExhibition {
    id: string;
    title: string;
    description?: string;
    startDate: string;
    endDate: string;
    organizedBy?: string;
    coverImage?: string;
    artworkIds: string[];
    artworks: IArtwork[];
}