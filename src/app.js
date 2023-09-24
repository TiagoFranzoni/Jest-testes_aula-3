const express = require("express");
const EventRepository = require("./repository");
const {MongoClient} = require('mongodb');
const Container = require("./container");
const mongo = require('mongodb');

const app = express();

const container = new Container;
app.set("container", container);
app.use(express.json());

app.get("/events", async(req, res) => {

    const repository = await container.getRepository();
    const events = await repository.findAll();

    res.json(events);
});

app.post("/events", async(req, res) => {
    const repository = await container.getRepository();
    const event = await repository.create(req.body);
    res.status(201).json(event);
})

app.get("/events/:id", async(req, res) => {
    const repository = await container.getRepository();
    const event = await repository.find(req.params.id);

    if (event === null) {
        res.status(404).json({
            error: "Event not found"
        })
    }else{
        res.status(200).json(event);
    }
})

app.put("/events/:id", async(req, res) => {
    const repository = await container.getRepository();
    const result = await repository.update(new mongo.ObjectId(req.params.id), req.body);

    if (!result) {
        res.status(404).json({
            error: "Event not found"
        })
    }else {
        const newEvent = await repository.find(req.params.id);
        res.status(200).json(newEvent);
    }
})

app.delete("/events/:id", async(req, res) => {
    const repository = await container.getRepository();
    const result = await repository.delete(new mongo.ObjectId(req.params.id));
    if (!result){
        res.status(404).json({
            error: "Event not found"
        })
    }else{
        res.status(204).json();
    }
})



module.exports = app
