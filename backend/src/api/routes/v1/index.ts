import { Router } from "express";
import auth from "./auth";
import users from "./users";
import enrollments from "./enrollments";
import attendance from "./attendance";
import classes from "./classes";
import students from "./students";
import reports from "./reports";
import history from "./history";

const router = Router();

router.use("/auth", auth);
router.use("/users", users);
router.use("/enrollments", enrollments);
router.use("/attendance", attendance);
router.use("/classes", classes);
router.use("/students", students);
router.use("/reports", reports);
router.use("/history", history);

export { router as routes };
