const asyncHandler = require("express-async-handler");
const ApiFeature = require("../utilities/APIFeatures");
const ApiError = require("../utilities/ApiError");



// create modal

exports.CreateModal = (modal) =>
  asyncHandler(async (req, res) => {
    const document = await modal.create(req.body);

    res.status(201).json({ data: document });
  });



// get all modal 
  exports.GetAllModal = (model, modelName = "" ) =>
  asyncHandler(async (req, res, next) => {
    let filter = {};
    if (req.filterObj) {
      filter = req.filterObj;
    }
   
    const ApiFeatures = new ApiFeature(model.find(filter), req.query)
    .search(modelName)
    .sort()
 
    const { mongooseQuery } = ApiFeatures;
    const document = await mongooseQuery;
    res
      .status(200)
      .json({ results: document.length, data: document });
  });




// get specific modal

  exports.GetSpecificModal = (model, populationOpt) =>
  asyncHandler(async (req, res, next) => {
    let query = model.findById(req.params.id);
    if (populationOpt) {
      query = query.populate(populationOpt);
    }
    const document = await query;
    if (!document) {

      return next(new ApiError(`no document for this ${document}`, 404));
    }

    delete document._doc.password;
    res.status(200).json({ data: document });
  });


// update modal

  exports.UpdateModal = (model) =>
  asyncHandler(async (req, res, next) => {
    const document = await model.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // to back modal after update not before
    );
    if (!document) {

      return next(
        new ApiError(`no ${document} for this ${req.params.id}`, 404)
      );
    }
    // traigger  "save" event ot update document
    // document.save();
    res.status(200).json({ data: document });
  });


//   delete modal


exports.DeleteModal = (model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const document = await model.findByIdAndDelete(id);
    if (!document) {

      return next(new ApiError(`no ${document} for this ${id}`, 404));
    }
    // traigger  "remove" event ot update document
    document.deleteOne();
    res.status(204).send();
  });