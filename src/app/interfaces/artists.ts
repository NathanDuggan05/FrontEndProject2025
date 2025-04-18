export interface Artist {
  name: string;
  playcount: string;
  listeners: string;
  mbid: string;
  url: string;
  streamable: string;
  image: Image[];
}

interface Image {
  '#text': string;
  size: string;
}