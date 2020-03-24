import Eris from "eris";
import { token } from "../auth.json";

export const bot = new Eris.Client(token);
