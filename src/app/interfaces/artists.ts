export interface Artist {
  name: string;
  playcount: string;
  listeners: string;
  mbid: string;
  url: string;
  streamable: string;
  image: Image[];
  defaultImage?: string;
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
  defaultTmage?: string;
}

export const DEFAULT_ARTIST_IMAGE = 'assets/images/default-artist.png';
/* export const DEFAULT_ALBUM_IMAGE = 'assets/images/default_album.png';
 */