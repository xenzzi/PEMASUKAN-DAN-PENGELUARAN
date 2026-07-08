// =========================================
// SMART EXPENSE TRACKER
// SCRIPT.JS - BAGIAN 1
// =========================================

// =========================
// DATA
// =========================

let saldoAwal = Number(localStorage.getItem("saldoAwal")) || 0;
let saldoMasuk = Number(localStorage.getItem("saldoMasuk")) || 0;
let total = Number(localStorage.getItem("total")) || 0;

let data = JSON.parse(localStorage.getItem("pengeluaran")) || [];

// =========================
// LOAD AWAL
// =========================

tampilkan();

// =========================
// FORMAT ANGKA
// =========================

function formatInput(input){

    let angka = input.value.replace(/\D/g,"");

    if(angka==""){

        input.value="";

        return;

    }

    input.value = Number(angka).toLocaleString("id-ID");

}

// =========================
// FORMAT RUPIAH
// =========================

function rupiah(angka){

    return Number(angka).toLocaleString("id-ID");

}

// =========================
// HITUNG SISA SALDO
// =========================

function getSaldo(){

    return saldoAwal + saldoMasuk - total;

}

// =========================
// SET SALDO AWAL
// =========================

function setSaldo(){

    let nominal = document
    .getElementById("saldoAwal")
    .value
    .replace(/\D/g,"");

    nominal = Number(nominal);

    if(nominal<=0){

        alert("Masukkan saldo awal yang benar.");

        return;

    }

    saldoAwal = nominal;

    simpan();

    tampilkan();

    document.getElementById("saldoAwal").value="";

}

// =========================
// TAMBAH SALDO
// =========================

function tambahSaldo(){

    let nominal = document
    .getElementById("tambahSaldo")
    .value
    .replace(/\D/g,"");

    nominal = Number(nominal);

    if(nominal<=0){

        alert("Masukkan nominal.");

        return;

    }

    saldoMasuk += nominal;

    simpan();

    tampilkan();

    document.getElementById("tambahSaldo").value="";

}

// =========================
// SIMPAN LOCAL STORAGE
// =========================

function simpan(){

    localStorage.setItem(

        "saldoAwal",

        saldoAwal

    );

    localStorage.setItem(

        "saldoMasuk",

        saldoMasuk

    );

    localStorage.setItem(

        "total",

        total

    );

    localStorage.setItem(

        "pengeluaran",

        JSON.stringify(data)

    );

}
// =========================================
// SCRIPT.JS - BAGIAN 2
// TAMBAH PENGELUARAN & TAMPILKAN DATA
// =========================================

// =========================
// TAMBAH PENGELUARAN
// =========================

function tambah(){

    let nama = document
        .getElementById("nama")
        .value
        .trim();

    let kategori = document
        .getElementById("kategori")
        .value;

    let harga = document
        .getElementById("harga")
        .value
        .replace(/\D/g,"");

    harga = Number(harga);

    // VALIDASI

    if(nama==""){

        alert("Masukkan nama pengeluaran.");

        return;

    }

    if(harga<=0){

        alert("Masukkan nominal.");

        return;

    }

    if(harga > getSaldo()){

        alert("Saldo tidak mencukupi.");

        return;

    }

    // =========================
    // TANGGAL & JAM
    // =========================

    let sekarang = new Date();

    let waktu = sekarang.toLocaleString("id-ID",{

        day:"2-digit",

        month:"2-digit",

        year:"numeric",

        hour:"2-digit",

        minute:"2-digit"

    });

    // =========================
    // SIMPAN DATA
    // =========================

    data.unshift({

        nama:nama,

        kategori:kategori,

        harga:harga,

        waktu:waktu

    });

    total += harga;

    simpan();

    tampilkan();

    // RESET INPUT

    document.getElementById("nama").value="";

    document.getElementById("harga").value="";

    document.getElementById("nama").focus();

}

// =========================
// TAMPILKAN DATA
// =========================

function tampilkan(){

    document.getElementById("saldoMasuk").textContent =
        "Rp " + rupiah(saldoMasuk);

    document.getElementById("total").textContent =
        "Rp " + rupiah(total);

    document.getElementById("sisa").textContent =
        "Rp " + rupiah(getSaldo());

    let html = "";

    if(data.length==0){

        html = `

        <tr>

            <td colspan="6">

                Belum ada transaksi.

            </td>

        </tr>

        `;

    }

    else{

        data.forEach((item,index)=>{

            html += `

            <tr>

                <td>${index+1}</td>

                <td>${item.waktu}</td>

                <td>${item.kategori}</td>

                <td>${item.nama}</td>

                <td>Rp ${rupiah(item.harga)}</td>

                <td>

                    <button

                        class="hapus"

                        onclick="hapus(${index})">

                        Hapus

                    </button>

                </td>

            </tr>

            `;

        });

    }

    document.getElementById("data").innerHTML = html;

}
// =========================================
// SCRIPT.JS - BAGIAN 3
// HAPUS • RESET • EVENT
// =========================================

// =========================
// HAPUS TRANSAKSI
// =========================

function hapus(index){

    if(!confirm("Yakin ingin menghapus transaksi ini?")) return;

    total -= data[index].harga;

    data.splice(index,1);

    simpan();

    tampilkan();

}

// =========================
// RESET SEMUA DATA
// =========================

function resetData(){

    if(!confirm("Semua data akan dihapus. Lanjutkan?")) return;

    saldoAwal = 0;

    saldoMasuk = 0;

    total = 0;

    data = [];

    simpan();

    tampilkan();

}

// =========================
// ENTER UNTUK TAMBAH
// =========================

document.getElementById("harga").addEventListener("keydown",function(e){

    if(e.key==="Enter"){

        tambah();

    }

});

// =========================
// UPDATE DASHBOARD
// =========================

function updateDashboard(){

    document.getElementById("saldoMasuk").textContent =
        "Rp " + rupiah(saldoMasuk);

    document.getElementById("total").textContent =
        "Rp " + rupiah(total);

    document.getElementById("sisa").textContent =
        "Rp " + rupiah(getSaldo());

}

// =========================
// LOAD PERTAMA
// =========================

window.onload = function(){

    tampilkan();

    updateDashboard();

};