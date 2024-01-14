const Dept = require('../models/Department');
const deptDelete = require('../functions/deptDelete');

exports.getAllDept = async (req, res) => {
    try {
        const depts = await Dept.find(
        {}
        );
        res.status(200).json({
        status: 'OK',
        depts
        });
    } catch (err) {
        res.status(500).json({
        status: 'ERR',
        message: err.message
        });
    }
}

exports.getDept = async (req, res) => {
    try {
        const dept = await Dept.findOne({
            name: req.body.name
        }).exec();
        res.status(200).json({
            status: 'OK',
            dept
        });
    } catch (err) {
        res.status(500).json({
            status: 'ERR',
            message: err.message
        });
    }
}

exports.createDept = async (req, res) => {
    try {
        const dept = new Dept({
            name: req.body.name
        });

        const existing = await Dept.findOne({
            name: req.body.name
        }).exec();

        if (existing) {
            res.status(409).json({
                status: 'ERR',
            });
        } else {
            await dept.save();
            res.status(200).json({
                status: 'OK',
                dept
            });
        }
    } catch (err) {
        res.status(500).json({
            status: 'ERR',
            message: err.message
        });
    }
}

exports.updateDept = async (req, res) => {
    try {
        const dept = await Dept.findOneAndUpdate({
            name: req.body.name
        }, {
            $set: { name: req.body.newName }
        }).exec();
        if (dept) {
            res.status(200).json({
                status: 'OK',
                dept
            });
        } else {
            res.status(404).json({
                status: 'ERR'
            });
        }
    } catch (err) {
        res.status(500).json({
            status: 'ERR',
            message: err.message
        });
    }
}

exports.deleteDept = async (req, res) => {
    try {
        const dept = await Dept.findOne({
            name: req.body.name
        }).exec();
        if (dept) {
            await deptDelete.changeAllDeptsOnRemove(dept.name);
            await dept.deleteOne();
            res.status(200).json({
                status: 'OK',
                dept
            });
        } else {
            res.status(404).json({
                status: 'ERR',
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            status: 'ERR',
            message: err.message
        });
    }
}