export interface MovieImage {
  aspect_ratio: number;
  height: number;
  width: number;
  file_path: string;
  vote_average: number;
  vote_count: number;
}

export interface MovieImages {
  backdrops: MovieImage[];
  posters: MovieImage[];
}
