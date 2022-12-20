const Transaksi = require("../models/transaksi");

//homepage
module.exports.home = (req, res) => {
  Transaksi.find({}, function (error, result) {
    if (error) {
      console.log(error);
    }
    res.render("index", { title: "Homepage", items: result });
  });
};

module.exports.home_get = (req, res) => {
  res.redirect("/");
};

//transaction
module.exports.transaction_get = (req, res) => {
  Transaksi.find({ progress: false }, function (error, result) {
    if (error) {
      console.log(error);
      console.log("ERROR");
    }
    res.render("transaction/transaksi_onProgress", {
      title: "Transaction",
      items: result,
    });
  });
};

module.exports.transaction_render_add = (req, res) => {
  res.render("transaction/transaksi_create", { title: "Transaction Form" });
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
  //Default waktu dan tanggal pesan
  if (Object.keys(req.body.tglPesan).length === 0) {
    req.body.tglPesan = dateFormat;
  }

  if (Object.keys(req.body.waktuPesan).length === 0) {
    req.body.waktuPesan = timeFormat;
  }

  if (req.body.paket == "1") {
    req.body.paket = "Paket cucian basah";
  }

  //Default waktu dan tanggal pengambilan
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

  //Default pembayaran
  const paket = req.body.paket;
  const berat = req.body.berat;
  const meterOrbuah = req.body.meterOrbuah;
  if (checkDurasi == 6) {
    if (paket == "Cuci Basah") {
      req.body.harga = berat * 9000;
    } else if (paket == "Cuci Kering") {
      req.body.harga = berat * 10000;
    } else if (paket == "Cuci Kering Lipat") {
      req.body.harga = berat * 12000;
    } else if (paket == "Cuci Kering Setrika") {
      req.body.harga = berat * 14000;
    } else if (paket == "Setrika") {
      req.body.harga = berat * 11000;
    } else if (paket == "Gorden Tipis") {
      req.body.harga = meterOrbuah * 11000;
    } else if (paket == "Gorden Tebal") {
      req.body.harga = meterOrbuah * 16000;
    } else if (paket == "Selimut") {
      req.body.harga = meterOrbuah * 40000;
    } else if (paket == "Bed Cover") {
      req.body.harga = meterOrbuah * 50000;
    } else if (paket == "Jas") {
      req.body.harga = meterOrbuah * 55000;
    } else {
      console.log("Did not choose anything");
    }
  } else if (checkDurasi == 1) {
    if (paket == "Cuci Basah") {
      req.body.harga = berat * 7000;
    } else if (paket == "Cuci Kering") {
      req.body.harga = berat * 8000;
    } else if (paket == "Cuci Kering Lipat") {
      req.body.harga = berat * 9500;
    } else if (paket == "Cuci Kering Setrika") {
      req.body.harga = berat * 11000;
    } else if (paket == "Setrika") {
      req.body.harga = berat * 9000;
    } else if (paket == "Gorden Tipis") {
      req.body.harga = meterOrbuah * 9000;
    } else if (paket == "Gorden Tebal") {
      req.body.harga = meterOrbuah * 14000;
    } else if (paket == "Selimut") {
      req.body.harga = meterOrbuah * 30000;
    } else if (paket == "Bed Cover") {
      req.body.harga = meterOrbuah * 40000;
    } else if (paket == "Jas") {
      req.body.harga = meterOrbuah * 45000;
    } else {
      console.log("Did not choose anything");
    }
  } else if (checkDurasi == 2) {
    if (paket == "Cuci Basah") {
      req.body.harga = berat * 5000;
    } else if (paket == "Cuci Kering") {
      req.body.harga = berat * 6000;
    } else if (paket == "Cuci Kering Lipat") {
      req.body.harga = berat * 7000;
    } else if (paket == "Cuci Kering Setrika") {
      req.body.harga = berat * 8500;
    } else if (paket == "Setrika") {
      req.body.harga = berat * 7500;
    } else if (paket == "Gorden Tipis") {
      req.body.harga = meterOrbuah * 7500;
    } else if (paket == "Gorden Tebal") {
      req.body.harga = meterOrbuah * 12500;
    } else if (paket == "Selimut") {
      req.body.harga = meterOrbuah * 20000;
    } else if (paket == "Bed Cover") {
      req.body.harga = meterOrbuah * 30000;
    } else if (paket == "Jas") {
      req.body.harga = meterOrbuah * 35000;
    } else {
      console.log("Did not select paket");
    }
  } else {
    console.log("Did not select durasi");
  }
  try {
    const transaction = new Transaksi(req.body);
    await transaction.save();
    console.log("Success add new transaction");
    res.redirect("/transaction");
  } catch (error) {
    console.log(error);
  }
};

module.exports.transaction_render_edit = async (req, res) => {
  const item = await Transaksi.findById(req.params.id);
  res.render("transaction/transaksi_edit", {
    title: "Transaction Edit Form",
    item: item,
  });
};

module.exports.transaction_edit = async (req, res) => {
  const item = await Transaksi.findById(req.params.id);

  item.name = req.body.name;
  item.paket = req.body.paket;
  item.durasi = req.body.durasi;
  item.waktuPesan = req.body.waktuPesan;
  item.tglPesan = req.body.tglPengambilan;
  item.waktuPengambilan = req.body.waktuPengambilan;
  item.tglPengambilan = req.body.tglPengambilan;
  item.berat = parseInt(req.body.berat);
  item.meterOrbuah = parseInt(req.body.meterOrbuah);
  item.harga = parseInt(req.body.harga);

  try {
    const transaction = new Transaksi(item);
    await transaction.save();
    console.log("Success edit transaction");
    res.redirect("/transaction");
  } catch (error) {
    console.log(error);
  }
};

module.exports.transaction_delete = async (req, res) => {
  await Transaksi.findByIdAndDelete(req.params.id);
  console.log("Success delete transaction");
  res.redirect("/transaction");
};

module.exports.transaction_finished_post = async (req, res) => {
  const item = await Transaksi.findById(req.params.id);
  item.progress = true;
  try {
    await item.save();
    console.log("Transaction finished");
    res.redirect("/transaction");
  } catch (error) {
    console.log(error);
  }
};

//transaction finished
module.exports.transaction_finished = async (req, res) => {
  Transaksi.find({ progress: true }, function (error, result) {
    if (error) {
      console.log(error);
      console.log("ERROR");
    }
    res.render("transaction/transaksi_finished", {
      title: "Transaction Finished",
      items: result,
    });
  });
};

module.exports.transaction_finished_redo = async (req, res) => {
  const item = await Transaksi.findById(req.params.id);
  item.progress = false;
  try {
    await item.save();
    console.log("Transaction finished");
    res.redirect("/transaction-finished");
  } catch (error) {
    console.log(error);
  }
};

//income
module.exports.income_get = async (req, res) => {
  Transaksi.find({ progress: true }, async function (error, result) {
    if (error) {
      console.log(error);
      console.log("ERROR");
    }
    res.render("income/income", {
      title: "Income",
      items: result,
    });
  });
};
