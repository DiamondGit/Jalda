import mongoose from "mongoose";
import FrequentRequests from "../models/frequentRequests.js";

export const getFrequentRequests = async (req, res) => {
    try {
        const frequentRequests = await FrequentRequests.find();

        res.status(200).json(frequentRequests);
    } catch (error) {
        res.status(404).json(error);
    }
};

export const getFrequentRequest = async (req, res) => {
    const { id } = req.params;

    try {
        const frequentRequest = await FrequentRequests.findById(id);

        res.status(200).json(frequentRequest);
    } catch (error) {
        res.status(404).json(error);
    }
};

export const createFrequentRequest = async (req, res) => {
    const frequentRequestData = req.body;

    const frequentRequest = new FrequentRequests(frequentRequestData);
    try {
        await frequentRequest.save();

        res.status(201).json(frequentRequest);
    } catch (error) {
        res.status(404).json(error);
    }
};

export const updateFrequentRequest = async (req, res) => {
    const { id } = req.params;
    const frequentRequest = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send("No frequentRequest with that Id");

    const updatedfrequentRequest = await FrequentRequests.findByIdAndUpdate(id, { ...frequentRequest, id }, { new: true });

    res.json(updatedfrequentRequest);
};

export const deleteFrequentRequest = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send("No frequentRequest with that Id");

    await FrequentRequests.findByIdAndRemove(id);

    res.json({ message: "frequentRequest deleted successfully" });
};
