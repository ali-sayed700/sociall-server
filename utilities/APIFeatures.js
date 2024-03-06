class ApiFeature {
    constructor(MongooseQuery, queryString) {
      this.mongooseQuery = MongooseQuery;
      this.queryString = queryString;
    }

    search(modelName) {
        if (this.queryString.keyword) {
          let query = {};
          if (modelName === "user") {
            query.$or = [
              { firstname: { $regex: this.queryString.keyword, $options: "i" } },
              { username: { $regex: this.queryString.keyword, $options: "i" } },
              { livesin: { $regex: this.queryString.keyword, $options: "i" } },
              { country: { $regex: this.queryString.keyword, $options: "i" } },
              { worksAt: { $regex: this.queryString.keyword, $options: "i" } },
            ];
          } else {
            query = { desc: { $regex: this.queryString.keyword, $options: "i" } };
          }
          this.mongooseQuery = this.mongooseQuery.find(query);
        }
        return this;
      }


      sort() {
       
          this.mongooseQuery = this.mongooseQuery.sort("-createdAt");
        return this;
      }

     
}


module.exports = ApiFeature;