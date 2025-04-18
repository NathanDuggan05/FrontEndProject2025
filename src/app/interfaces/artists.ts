export interface Artist {
  name: string;
  playcount: string;
  listeners: string;
  mbid: string;
  url: string;
  streamable: string;
  image: Image[];
  bio?: {
    summary: string;
    tags: string[];
    topAlbums: Album[];
  };
  showBio?: boolean;
  loadingBio?: boolean;
}

interface Image {
  '#text': string;
  size: string;
}

interface Album {
  name: string;
  playcount: number;
  url: string;
  image: Image[];
}