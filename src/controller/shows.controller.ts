import { AxiosError } from "axios";
import { Request, Response } from "express";
import { compare, hash } from "bcryptjs";
import { Client, TVShow } from "imdb-api";
import { sign } from "jsonwebtoken";

import User from "../models/user";
import Show from "../models/show";
import { imdbTvShowDataMapper } from "../helpers/tv-show-data-mapper";
import { imdbTvShowKeyFormatter } from "../helpers/tv-show-key-formatter";

const imdbClient = new Client({ apiKey: process.env.OMDB_API_KEY });

export const createUser = async (req: Request, res: Response): Promise<Response | void> => {
  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }
    const salt = Number.parseInt(process.env.HASH!);
    const newUser = new User({ username, password: await hash(password, salt) });
    await newUser.save();
    return res.json({ success: true, message: "User created successfully", user: newUser });
  } catch (error_) {
    const error = error_ as AxiosError;
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req: Request, res: Response): Promise<Response | void> => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    const comparePwd = await compare(password, user ? user.password : "");
    if (user && comparePwd) {
      const token = sign(
        { userId: user._id, username: user.username },
        process.env.JWT_SECRET as string,
        { expiresIn: "30 days" },
      );
      return res.json({ success: true, message: "Login successful", token });
    }
    return res.status(401).json({ success: false, message: "Invalid credentials" });
  } catch (error_) {
    const error = error_ as AxiosError;
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getShowList = async (req: Request, res: Response): Promise<Response | void> => {
  const { userId } = req.query;
  try {
    const shows = await Show.find({ userId });
    return res.json({ success: true, shows });
  } catch (error_) {
    const error = error_ as AxiosError;
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const addShow = async (req: Request, res: Response): Promise<Response | void> => {
  const { title, userId } = req.body;
  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isShowAlreadyExist = await Show.findOne({ title, userId });

    if (isShowAlreadyExist) {
      return res.status(403).json({ success: false, message: "Show Already Added in list" });
    }

    const imdbData = await imdbClient.get({ name: title });

    if (!imdbData) {
      return res.status(404).json({ success: false, message: "Show not found on IMDb" });
    }

    const tvShow = new TVShow(imdbTvShowDataMapper(imdbData), { apiKey: process.env.OMDB_API_KEY });
    const episodes = await tvShow.episodes();

    const newShow = new Show({
      ...imdbTvShowKeyFormatter(imdbTvShowDataMapper(imdbData)),
      episodes,
      userId,
    });
    await newShow.save();
    return res.json({ success: true, message: "Show added successfully", show: newShow });
  } catch (error_) {
    const error = error_ as AxiosError;
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const removeShow = async (req: Request, res: Response): Promise<Response | void> => {
  const { userId, id } = req.params;
  try {
    await Show.findByIdAndDelete(id);
    const UpdatedShows = await Show.find({ userId });
    res.json({ success: true, message: "Show removed successfully", shows: UpdatedShows });
  } catch (error_) {
    const error = error_ as AxiosError;
    res.status(500).json({ success: false, message: error.message });
  }
};

export const toogleMarkEpisodeAsWatched = async (
  req: Request,
  res: Response,
): Promise<Response | void> => {
  const { id } = req.params;
  const { userId, watched, episodeIndex } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const show = await Show.findById(id);
    if (!show) {
      return res.status(404).json({ success: false, message: "Show not found" });
    }

    if (show.userId.toString() !== userId) {
      return res.status(403).json({ success: false, message: "Unauthorized to update this show" });
    }

    show.episodes[episodeIndex].watched = watched;
    await show.save();
    const UpdatedShows = await Show.find({ userId });
    return res.json({
      success: true,
      message: `Episode marked as ${watched ? "watched" : "un-watched"}`,
      shows: UpdatedShows,
    });
  } catch (error_) {
    const error = error_ as AxiosError;
    return res.status(500).json({ success: false, message: error.message });
  }
};
