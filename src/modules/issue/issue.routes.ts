import { Router } from "express";
import { createIssue, getIssues, updateIssue, deleteIssue } from "./issue.controller";
import validateIssue from "../middleware/validateIssue";

const route = Router();

route.get("/", getIssues);
route.post("/", createIssue);
route.patch("/:id", validateIssue, updateIssue);
route.delete("/:id", deleteIssue);

export default route;