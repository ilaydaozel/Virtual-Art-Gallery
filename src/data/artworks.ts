import { IArtwork } from "../types";

const artworks: IArtwork[] = [
    {
        id: "1",
        title: "The Starry Night",
        artistName: "Vincent",
        artistSurname: "van Gogh",
        description: "A masterpiece of Post-Impressionist art.",
        creationYear: "1889",
        medium: "Oil on canvas",
        width: 73.7,
        height: 92.1,
        url: "https://mir-cdn.behance.net/v1/rendition/project_modules/max_3840/fb40d7196884511.66277dacb293d.jpg"
    },
    {
        id: "2",
        title: "Mona Lisa",
        artistName: "Leonardo",
        artistSurname: "da Vinci",
        description: "A portrait painting that's one of the most famous artworks in the world.",
        creationYear: "1503",
        medium: "Oil on poplar panel",
        width: 77,
        height: 53,
        url: "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/40664f196884511.66277dacb0d49.jpg"
    },
    {
        id: "3",
        title: "The Starry Night 2",
        artistName: "Vincent",
        artistSurname: "van Gogh",
        description: "A masterpiece of Post-Impressionist art.",
        creationYear: "1889",
        medium: "Oil on canvas",
        width: 73.7,
        height: 92.1,
        url: "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/f27f0d196884511.66277dacb13c7.jpg"
    },
    // Add more artworks here...
];

export default artworks;