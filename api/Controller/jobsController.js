import Jobs from "../Model/Jobs.js";
import mongoose from "mongoose";
import moment from "moment";

// Create a new Job:
export const Createjobs = async (req, res, next) => {

    try {

        const { company, position } = req.body;
        if (!company || !position) {
            return next("Please Provide All Fields...");
        }

        req.body.createdBy = req.user.id;
        const jobData = await Jobs.create(req.body);
        res.status(201).json({ jobData });
    }
    catch (error) {
        return next("Couldn't create");
    }
}

// Get all Jobs:
export const getAlljobs = async (req, res, next) => {

    try {
        // Search Filter:
        const { status, worktype, search, sort } = req.query;

        // Conditions for searching filters:
        const queryObject = { createdBy: req.user.id }

        // Logic filter:
        if (status && status !== "all") {
            queryObject.status = status;
        }

        if (worktype && worktype !== "all") {
            queryObject.worktype = worktype;
        }

        // Search filters:
        if (search) {
            queryObject.position = { $regex: search, $options: "i" }
        }

        let Showjobs = Jobs.find(queryObject);


        // Sort filters:
        if (sort === "latest") {
            Showjobs = Showjobs.sort("-createdAt");
        }
        if (sort === "oldest") {
            Showjobs = Showjobs.sort("createdAt");
        }
        if (sort === "a-z") {
            Showjobs = Showjobs.sort("position");
        }
        if (sort === "z-a") {
            Showjobs = Showjobs.sort("-position");
        }

        // Pagination filters:
        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 10
        const skip = (page - 1) * limit

        Showjobs = Showjobs.skip(skip).limit(limit);

        // Jons count:
        const totalJobs = await Jobs.countDocuments(Showjobs);
        const numofPage = Math.ceil(totalJobs / limit);

        const jobsData = await Showjobs;


        // const Showjobs = await Jobs.find({ createdBy: req.user.id });
        res.status(200).json({ totalJobs: totalJobs, jobsData, numofPage });
    }
    catch (error) {
        return next("Jobs Data Not Found...");
    }
}

// Update Jobs:
export const Updatejobs = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { company, position } = req.body;

        if (!company || !position) {
            return next("Please Provide All Fields...");
        }

        const checkjob = await Jobs.findOne({ _id: id });
        if (!checkjob) {
            return next("Job Data Not Found...");
        }

        if (req.user.id !== checkjob.createdBy.toString()) {
            return next("Your Not Authorized to Update this Job");
        }

        const updatejobs = await Jobs.findOneAndUpdate({ _id: id }, req.body, { new: true, runValidators: true });

        res.status(200).json({ updatejobs });
    }
    catch (error) {
        return next("Job Data Not Found...");
    }
}

// Delete Jobs:
export const Deletejobs = async (req, res, next) => {
    try {
        const { id } = req.params;
        const checkjobdata = await Jobs.findOne({ _id: id });

        if (!checkjobdata) {
            return next("Job Data Not Found...");
        }

        if (req.user.id !== checkjobdata.createdBy.toString()) {
            return next("Your Not Authorized to Delete this Job");
        }

        const deletejobs = await Jobs.findOneAndDelete({ _id: id });
        res.status(200).json({ message: 'Job Data Delete Successfully...', deletejobs });
    }
    catch (error) {
        return next("Job Data Not Found...");
    }
}

// Stats & Filters Jobs:
export const Filterjobs = async (req, res, next) => {
    try {
        const Statsfilter = await Jobs.aggregate([
            // Search by User Jobs:
            {
                $match: {
                    createdBy: new mongoose.Types.ObjectId(req.user.id)
                }
            },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);

        // Default Stats:
        const defaultStats = {
            pending: Statsfilter.pending || 0,
            reject: Statsfilter.reject || 0,
            interview: Statsfilter.interview || 0
        };

        // Monthly & Yearly Stats:
        let monthlyApplication = await Jobs.aggregate([

            {
                $match: {
                    createdBy: new mongoose.Types.ObjectId(req.user.id)
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" }
                    },
                    count: { $sum: 1 }
                }
            }
        ]);

        // Monthly & Yearly Stats Modified Short:
        monthlyApplication = monthlyApplication.map((item) => {
            const { _id: { year, month }, count } = item;
            const date = moment().month(month - 1).year(year).format('MMM Y');
            return { date, count };
        }).reverse();

        res.status(200).json({ totalJobs: Statsfilter.length, defaultStats, monthlyApplication });
    }
    catch (error) {
        return next("Job Data Not Found...");
    }
}