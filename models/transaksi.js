const mongoose = require("mongoose");

const transaksiSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    paket: {
      type: String,
      require: true,
    },
    durasi: {
      type: String,
      require: true,
    },
    berat: {
      type: Number,
      //require: true,
    },
    meterOrbuah: {
      type: Number,
      //require: true,
    },
    harga: {
      type: Number,
      //require: true,
    },
    tglPesan: {
      type: String,
    },
    waktuPesan: {
      type: String,
    },
    tglPengambilan: {
      type: String,
      //require: true,
    },
    waktuPengambilan: {
      type: String,
      //require: true,
    },
    progress: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Transaksi = mongoose.model("transaction", transaksiSchema);
module.exports = Transaksi;
