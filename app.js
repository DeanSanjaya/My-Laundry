const exspress = require("express");
const mongoose = require("mongoose");
const app = exspress();
const allRoutes = require("./routes/allRoutes");
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");
const { requireAuth, checkUser } = require("./middleware/authmiddleware");

//middleware
app.use(exspress.static("assets"));
app.use(exspress.json());
app.use(exspress.urlencoded());
app.use(cookieParser());

//view engine
app.set("view engine", "ejs");

//connect to mongoDB
const dbURI =
  "mongodb+srv://admin1:admin123@mylaundry.4krhzfc.mongodb.net/myLaundry?retryWrites=true&w=majority";
const database = (module.exports = () => {
  const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  try {
    mongoose.connect(dbURI, connectionParams);
    console.log("Connected to Database");
  } catch (error) {
    console.log(error);
    console.log("Database connection failed");
  }
});

database();

//routers
//check user on all get request
app.get("*", checkUser);

//user authRoutes
app.use(authRoutes);

//allRoutes
app.use(allRoutes);

app.listen(3000, () => {
  console.log("Server is runnning on port 3000");
});

// login and signup
app.use((req, res) => {
  res.status(404).render("404", { title: "404" });
});
