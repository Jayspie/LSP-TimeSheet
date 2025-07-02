import dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

import express from "express";
import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";
import sql from "./other/db.js";
import methodOverride from "method-override";

//Route Imports
import employ from "./routes/admin/employees.js";
import loc from "./routes/admin/location.js";
import schedule from "./routes/admin/scheedule.js";
import timesheet from "./routes/admin/timeshee.js";
import clock_in from "./routes/public/clock-in.js";
import clock_out from "./routes/public/clock-out.js";
import public_timesheet from "./routes/public/public_timesheet.js";
import public_getloc from "./routes/public/public_getloc.js";
import passport from "passport";
import flash from "express-flash";
import session from "express-session";

//Utilities
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import initialize from "./other/passport-config.js";

const intializePassport = initialize;
const getuserbyadmin_id = async (admin_id) => {
  const result = await sql`SELECT * FROM ADMIN WHERE admin_id = ${admin_id};`;
  return result[0];
};

const getuserbyId = async (admin_name) => {
  const result =
    await sql`SELECT * FROM ADMIN WHERE admin_name = ${admin_name};`;
  return result[0];
};

intializePassport(passport, getuserbyadmin_id, getuserbyId);

//Middleware
app.set("view-engine", "ejs");
app.set("views", path.join(__dirname, "Admin_view"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/Admin_view", express.static(path.join(__dirname, "Admin_view")));
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));

//Admin Routes
app.use("/admin/employees", employ);
app.use("/admin/location", loc);
app.use("/admin/schedule", schedule);
app.use("/admin/timesheet", timesheet);

//Public Routes
app.use("/clock-in", clock_in);
app.use("/clock-out", clock_out);
app.use("/timesheet", public_timesheet);
app.use("/location", public_getloc);

//View Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "clock.html"));
});
app.get("/admin/page", checkAuthenticated, async (req, res) => {
  if (!req.session.isLoggedIn) {
    return res.redirect("/admin/login");
  }

  res.render("dashbord.ejs", {
    admin_id: req.session.admin_id,
  });
});

app.get("/admin/schedule", async (req, res) => {
  if (!req.session.isLoggedIn) {
    return res.redirect("/admin/login");
  }

  res.render("schedule.ejs", {
    admin_id: req.session.admin_id,
  });
  //res.sendFile(path.join(__dirname, "Admin_view", "schedule.html"));
});

app.get("/admin/location", async (req, res) => {
  if (!req.session.isLoggedIn) {
    return res.redirect("/admin/login");
  }

  res.render("location.ejs", {
    admin_id: req.session.admin_id,
  });
  //res.sendFile(path.join(__dirname, "Admin_view", "schedule.html"));
});

//Login
app.get("/admin/login", checkNotAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, "Admin_view", "login.html"));
});

app.post(
  "/admin/login",
  checkNotAuthenticated,
  passport.authenticate("local", {
    failureRedirect: "/admin/login",
    failureFlash: true,
  }),
  (req, res) => {
    //sessionStorage.setItem("key", req.body.admin_id);
    req.session.admin_id = req.body.admin_id;
    req.session.isLoggedIn = true;
    res.redirect("/admin/page");
  }
);

//Register
app.get("/admin/reg", checkNotAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, "Admin_view", "register.html"));
});

app.post("/admin/reg", checkNotAuthenticated, async (req, res) => {
  const { admin_id, admin_name, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await sql`
      INSERT INTO ADMIN (admin_id, admin_name, password)
      VALUES (${Number(admin_id)}, ${admin_name}, ${hashedPassword})
      RETURNING *
    `;

    res.redirect("/admin/login");
  } catch (error) {
    console.error("Registration error:", error);

    // Optional: display friendly message or handle duplicate IDs
    res.redirect("/admin/reg");
  }
});

//user auth
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect("/admin/login");
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/admin/page");
  }

  next();
}
app.listen(8080, () => {
  console.log("[server] Application started on port 8080!");
});
