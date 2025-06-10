import express from "express"
const Routine = require("../models/routineSchema");
const router = express.Router();



router.get("/routines", async (req, res) => {
    try {
        const routines = await Routine.find().toArray();
        res.status(200).json(routines);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});


module.exports = router;