import mongoose, { Document, Schema, Types } from "mongoose";

export interface IEpisode {
  title: string;
  watched: boolean;
  season?: number;
  episode?: number;
  imdburl?: string;
  plot?: string;
  poster?: string;
}

export interface IShow extends Document {
  title: string;
  episodes: IEpisode[];
  userId: Types.ObjectId;
  year?: string;
  genre?: string;
  plot?: string;
  poster?: string;
  imdburl?: string;
  totalSeasons?: number;
}

const ShowSchema: Schema = new Schema({
  title: String,
  year: String,
  genre: String,
  plot: String,
  poster: String,
  imdburl: String,
  totalSeasons: Number,
  episodes: [
    {
      title: String,
      watched: { type: Boolean, default: false },
      season: Number,
      episode: Number,
      imdburl: String,
      plot: String,
      poster: String,
    },
  ],
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

export default mongoose.model<IShow>("Show", ShowSchema);
