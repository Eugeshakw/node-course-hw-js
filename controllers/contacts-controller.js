import HttpError from '../helpers/index.js';


import Contact from '../models/contacts.js'

import mongoose from 'mongoose';

import ctrlWrapper from '../decorators/ctrlWrappers.js';


const getAll = async (req, res, next) => {
    try {
        const result = await Contact.find();
        res.json(result);
    } catch (err) {
        next(err);
    }
}
    

const addContact = async (req, res, next) => {
    const result = await Contact.create(req.body);
    res.status(201).json(result);
  };


const getById = async (req, res, next) => {
    try {

      const { contactId } = req.params;

      const contact = await Contact.findById(contactId);

      if (!contact) {
        throw HttpError(404, `Not found`);
      }
      res.json(contact);
    } catch (error) {
      next(error);
    }
  };


const updateById = async (req, res, next) => {
    const { contactId } = req.params;

    const result = await Contact.findByIdAndUpdate(contactId, req.body,{new: true});

    if (!result) {
        throw HttpError(404, `Contact with id ${contactId} not found`);
    }

    res.json(result);
}

 const updateFavoruteById = async (req, res, next) => {
    try {
      const { contactId } = req.params;
      const { favorite } = req.body;
  
  
      const existingContact = await Contact.findById(contactId);
      if (!existingContact) {
        return res.status(404).json({ message: "Contact not found" });
      }
  
    
      existingContact.favorite = favorite;
      await existingContact.save();
  
      res.status(200).json(existingContact);
    } catch (error) {
      next(error);
    }
  };

  const deleteContact = async (req, res, next) => {
    try {
      const { contactId } = req.params;
      const result = await Contact.findByIdAndRemove(contactId);
  
      res.json({
        message: "contact deleted",
      });
    } catch (error) {
      next(error);
    }
  };

export default {
    getAll: ctrlWrapper(getAll),
    getById: ctrlWrapper(getById),
    add: ctrlWrapper(addContact),
    updateById: ctrlWrapper(updateById),
    updateFavorite: ctrlWrapper(updateFavoruteById),
    deleteById: ctrlWrapper(deleteContact),
  };