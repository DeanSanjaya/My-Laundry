const exspress = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const app = exspress();
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");
const { requireAuth, checkUser } = require("./middleware/authmiddleware");

const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");

//middleware
app.use(exspress.static("assets"));
app.use(exspress.json());
app.use(cookieParser());

//user authRoutes
app.use(authRoutes);

//view engine
app.set("view engine", "ejs");

//connect to mongoDB
const dbURI =
  "mongodb+srv://admin1:admin123@mylaundry.4krhzfc.mongodb.net/?retryWrites=true&w=majority";
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

app.listen(3000, () => {
  console.log("Server is runnning on port 3000");
});

//routers
//check user on all get request
app.get("*", checkUser);
//home
app.get("/", (req, res) => {
  res.render("homepage", { title: "Homepage" });
});

//home redirect
app.get("/home", (req, res) => {
  res.redirect("/");
});

app.get("/home/createHomeDesc", (req, res) => {
  res.render("createHomeDesc", requireAuth, { title: "Create Homepage Desc" });
});

app.get("/transaction", (req, res) => {
  res.render("transaction", requireAuth, { title: "Transaction" });
});

app.get("/income", (req, res) => {
  res.render("income", requireAuth, { title: "Income" });
});

// login and signup
app.use((req, res) => {
  res.status(404).render("404", { title: "404" });
});
