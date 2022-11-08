const exspress = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const app = exspress();
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");

const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");

//middleware
app.use(exspress.static("assets"));
app.use(exspress.json());
app.use(cookieParser());

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
app.get("/booking", (req, res) => {
  let booking = [];

  db.collection("booking")
    .find()
    .sort({ name: 1 })
    .forEach((book) => {
      booking.push(book);
    })
    .then(() => {
      res.status(200).json(booking);
    })
    .catch(() => {
      res.status(500).json({ error: "Could not fetch the documents" });
    });
});

//home
app.get("/", (req, res) => {
  res.render("homepage", { title: "Homepage" });
});

//home redirect
app.get("/home", (req, res) => {
  res.redirect("/");
});

app.get("/home/createHomeDesc", (req, res) => {
  res.render("createHomeDesc", { title: "Create Homepage Desc" });
});

// login and signup
app.use(authRoutes);

// cookies
app.get("/set-cookies", (req, res) => {
  // res.setHeader('Set-Cookie', 'newUser=true');

  res.cookie("newUser", false);
  res.cookie("isEmployee", true, {
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true,
  });

  res.send("you got the cookies!");
});

app.get("/read-cookies", (req, res) => {
  const cookies = req.cookies;
  console.log(cookies.newUser);

  res.json(cookies);
});

//google auth
// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser((user, done) => {
//   done(null, user);
// });

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID:
//         "500097970363-11p3qtsntvr9nf94vn7f9bsm01mkh3v4.apps.googleusercontent.com",
//       clientSecret: "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",
//       callbackURL: "http://localhost:3000/google/callback",
//     },
//     function (accessToken, refrestToken, profile, callback) {
//       callback(null, profile);
//     }
//   )
// );

// app.get("/google", passport.authenticate("google"), { scope: ["profile"] });
// app.get(
//   "/google/callback",
//   passport.authenticate("google", { failireRedirect: "/login" }),
//   function (req, res) {
//     console.log("Login Sucessful");
//     res.redirect("/");
//   }
// );
//404
app.use((req, res) => {
  res.status(404).render("404", { title: "404" });
});
