const App = require("../models/App");
const User = require("../models/user")

exports.createApp = (req, res, next) => {

    const { date, status, comment, job, user } = req.body;
    const app = new App({ date, status, comment, job, user });
    app
        .save()
        .then(createdApp => {
            res.status(201).json({
                message: "App added successfully",
                App: {
                    ...createdApp,
                    id: createdApp._id
                }
            });
        })
        .catch(error => {
            res.status(500).json({
                message: "Creating a App failed! " + error
            });
        });
};

exports.filtrerApps = (req, res, next) => {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const uid = req.query.uid;
    const status = req.query.status;
    let appQuery = App.find();
    let appQueryCount = App.find();

    if (uid) {
        const user = User.findById(uid)
        appQuery = appQuery.where({ user: user });
        appQueryCount = appQueryCount.where({ user: user });
    }

    if (status) {
        appQuery = appQuery.where({ status: status });
        appQueryCount = appQueryCount.where({ status: status });

    }
    count = 0
    appQueryCount
        .then(function (models) {
            count = models.length
        })


    if (pageSize && currentPage) {
        appQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }

    appQuery
        .populate('job')
        .sort({ date: 'desc' })
        .then(documents => {
            res.status(200).json({
                message: "Apps fetched successfully!",
                Apps: documents,
                maxApps: count
            });
        })
        .catch(error => {
            res.status(500).json({
                message: "Fetching Apps failed! " + error
            });
        });
};

exports.getApp = (req, res, next) => {
    App.findById(req.params.id)
        .populate('job')
        .then(app => {
            if (app) {
                res.status(200).json(app);
            } else {
                res.status(404).json({ message: "App not found!" });
            }
        })
        .catch(error => {
            res.status(500).json({
                message: "Fetching App failed!"
            });
        });
};

exports.deleteApp = (req, res, next) => {
    App.deleteOne({ _id: req.params.id })
        .then(result => {
            res.status(200).json({ message: "Deletion successful!" });
        })
        .catch(error => {
            res.status(500).json({
                message: "Deleting App failed!"
            });
        });
};

exports.updateApp = (req, res, next) => {

    const { _id, date, status, comment, job, user } = req.body;
    const app = new App({ _id, date, status, comment, job, user });

    App.updateOne({ _id: req.params.id }, app)
        .then(result => {
            res.status(200).json({ message: "Update successful!" });
        })
        .catch(error => {
            res.status(500).json({
                message: "Couldn't update App!"
            });
        });
};