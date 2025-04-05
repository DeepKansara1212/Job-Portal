const mongoose = require("mongoose")

const connectDB = async () => {
  try {
    // Add debug mode to see what's happening with queries
    mongoose.set("debug", process.env.NODE_ENV !== "production")

    const conn = await mongoose.connect(process.env.MONGODB_URI)
    console.log(`MongoDB Connected: ${conn.connection.host}`)

    // Test the connection with a simple operation
    const connectionTest = await mongoose.connection.db.admin().ping()
    console.log("Database ping successful:", connectionTest)

    return conn
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`)
    if (error.name === "MongoServerSelectionError") {
      console.error("Could not connect to MongoDB server. Please check your connection string and network.")
    }
    process.exit(1)
  }
}

module.exports = connectDB

