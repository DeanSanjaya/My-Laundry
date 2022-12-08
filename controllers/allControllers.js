const Transaksi = require("../models/transaksi");
const { requireAuth, checkUser } = require("../middleware/authmiddleware");

//homepage
module.exports.home = (req, res) => {
  Transaksi.find({}, function (error, result) {
    if (error) {
      console.log(error);
    }
    let checkID = Transaksi.findById("638e4d7cbbd70a468d24796f");
    console.log(checkID);
    res.render("index", { title: "Homepage", items: result });
  });
};

module.exports.home_get = (req, res) => {
  res.redirect("/");
};

//search transaction
// module.exports.track_get = (req, res) => {
// };

//transaction
module.exports.transaction_get = (req, res) => {
  Transaksi.find({}, function (error, result) {
    if (error) {
      console.log(error);
      console.log("ERROR");
    }
    res.render("transaksi_onProgress", {
      title: "Transaction",
      items: result,
    });
  });
};

module.exports.transaction_render_add = (req, res) => {
  res.render("transaksi_create", { title: "Transaction Form" });
};

const dateNow = new Date();
const dateFormat =
  dateNow.getDate() +
  "/" +
  (dateNow.getMonth() + 1) +
  "/" +
  dateNow.getFullYear();

const currentDate = dateNow.getDate();
const currentYear = dateNow.getFullYear();
const currentMonth = dateNow.getMonth() + 1;

//Days in current month
function getDaysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}
const daysInCurrentMonth = getDaysInMonth(currentYear, currentMonth);

//Check date now
function checkDate(checkDurasi) {
  const durasi = checkDurasi;

  if (currentDate + durasi > daysInCurrentMonth) {
    if (currentMonth == "12") {
      const yearNow = parseInt(currentYear) + 1;
      const monthNow = currentMonth - 12;
      const daysInNextMonth = getDaysInMonth(yearNow, monthNow + 1);
      const dateNow = currentDate + durasi - daysInCurrentMonth;
      return dateNow + "/" + (monthNow + 1) + "/" + yearNow;
    } else {
      const dateNow = currentDate + durasi - daysInCurrentMonth;
      const monthNow = currentMonth + 1;
      return dateNow + "/" + monthNow + "/" + currentYear;
    }
  } else {
    return currentDate + durasi + "/" + currentMonth + "/" + currentYear;
  }
}

//Get time now
const timeFormat = dateNow.toLocaleString("en-US", {
  hour: "numeric",
  minute: "numeric",
  hour12: false,
});

//Check time now
function checkTime() {
  const timeSubstringHour = parseInt(timeFormat.substring(-1, 2));
  const timeSubstringMinute = parseInt(timeFormat.substring(3));
  const durasi = timeSubstringHour + 6;
  console.log(timeFormat);
  if (timeSubstringHour > 17 && timeSubstringMinute > 1) {
    return (
      "0" + (durasi - 24).toString() + ":" + timeSubstringMinute.toString()
    );
  } else if (
    parseInt(timeFormat) > 3 &&
    timeSubstringMinute.toString().charAt(0) == 0
  ) {
    return durasi.toString() + ":0" + timeSubstringMinute.toString();
  } else if (parseInt(timeFormat) > 3) {
    return durasi.toString() + ":" + timeSubstringMinute.toString();
  } else if (
    timeFormat.charAt(0) == 0 &&
    timeSubstringMinute.toString().charAt(0) == 0
  ) {
    return "0" + durasi.toString() + ":0" + timeSubstringMinute.toString();
  } else if (timeFormat.charAt(0) == 0) {
    return "0" + durasi.toString() + ":" + timeSubstringMinute.toString();
  } else if (timeSubstringMinute.toString().charAt(0) == 0) {
    return durasi.toString() + ":0" + timeSubstringMinute.toString();
  } else {
    return durasi.toString() + ":" + timeSubstringMinute.toString();
  }
}

module.exports.transaction_add = async (req, res) => {
  if (Object.keys(req.body.tglPesan).length === 0) {
    req.body.tglPesan = dateFormat;
  }

  if (Object.keys(req.body.waktuPesan).length === 0) {
    req.body.waktuPesan = timeFormat;
  }

  if (req.body.paket == "1") {
    req.body.paket = "Paket cucian basah";
  }

  const checkDurasi = parseInt(req.body.durasi);
  if (
    checkDurasi == 6 &&
    Object.keys(req.body.tglPengambilan).length === 0 &&
    Object.keys(req.body.waktuPengambilan).length === 0
  ) {
    req.body.tglPengambilan = dateFormat;
    req.body.waktuPengambilan = checkTime();
  } else if (
    Object.keys(req.body.tglPengambilan).length === 0 &&
    Object.keys(req.body.waktuPengambilan).length === 0
  ) {
    req.body.tglPengambilan = checkDate(checkDurasi);
    req.body.waktuPengambilan = timeFormat;
  } else {
    req.body.tglPengambilan = req.body.tglPengambilan;
    req.body.waktuPengambilan = req.body.waktuPengambilan;
  }
  // console.log(req.body.waktuPengambilan);
  // console.log(Transaksi(req.body));

  // res.redirect("/transaction");

  // try {
  //   let schema = await new Transaksi({
  //     name: req.body.name,
  //   });
  //   console.log(schema);
  //   res.redirect("/transaction");
  // } catch (error) {
  //   return res.render("error", { errorMessage: error.message });
  // }

  console.log(Transaksi(req.body));

  try {
    const transaction = new Transaksi(req.body);
    await transaction.save();
    console.log("success add data");
    res.redirect("/transaction");
  } catch (error) {
    return res.render("error", { errorMessage: error.message });
  }
};

module.exports.transaction_render_edit = (req, res) => {
  res.redirect("/");
};

module.exports.transaction_edit = (req, res) => {
  res.redirect("/");
};

module.exports.transaction_delete = (req, res) => {
  res.redirect("/");
};

// app.get("/income", (req, res) => {
//   res.render("income", requireAuth, { title: "Income" });
// });

module.exports.transaction_finished_get = (req, res) => {
  res.render("transaksi_finished", { title: "Transaction Finished" });
};
