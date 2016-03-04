/// <reference path='./typings/tsd.d.ts' />
var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/studentapp");
var express = require('express');
var bodyparser = require('body-parser');
var server = express();
server.listen(3000);
var path = require('path');
var pathname = path.resolve(__dirname, "./../client");
server.use(express.static(pathname));
server.use(bodyparser.json());
server.use(bodyparser.urlencoded({ extended: false }));
var studentSchema = new mongoose.Schema({
    name: { type: String, require: true },
    fname: { type: String, require: true },
    age: { type: String, require: true },
    class: { type: String, require: true },
    email: { type: String, require: true },
    contact: { type: String, require: true },
});
var student = mongoose.model("studentmodel", studentSchema);
server.post('/addstudent', function (req, res) {
    var newinformation = new student(req.body);
    newinformation.save(function (err, data) {
        if (err) {
            console.log('error');
        }
        else {
        }
    });
    student.find({}, function (err, data) {
        res.json(data);
    });
});
server.delete('/deleteinformation/:id', function (req, res) {
    var delid = req.params.id;
    student.findOne({ "_id": delid }, function (err, data) {
        if (err) {
            console.log(err);
        }
        else {
            student.remove({ _id: delid }, function () {
                student.find({}, function (err, data) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log(data);
                        res.send(data);
                    }
                });
            });
        }
    });
});
server.post('/editinfo', function (req, res) {
    student.findByIdAndUpdate(req.body._id, req.body, function (err, data) {
        if (err) {
            console.log(err);
        }
        else {
            console.log(data);
            res.send(data);
        }
    });
});
