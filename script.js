// ========================================
// URL GOOGLE APPS SCRIPT
// ========================================

const SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbzQych7uqqD7RZw8UznTIWwGN_OjIk72_wurEnJgxbesLTOCJxARgma4TaZT-C8amDN/exec";


// ========================================
// ELEMENT WEBSITE
// ========================================

const container =
    document.getElementById("produk-container");

const tambahProduk =
    document.getElementById("tambahProduk");

const totalElement =
    document.getElementById("total");


// ========================================
// TANGGAL HARI INI
// ========================================

const tanggalInput =
    document.getElementById("tanggal");

const tanggalHariIni =
    document.getElementById("tanggalHariIni");


tanggalHariIni.addEventListener(
    "click",
    function() {

        const sekarang = new Date();

        const tahun =
            sekarang.getFullYear();

        const bulan =
            String(
                sekarang.getMonth() + 1
            ).padStart(2, "0");

        const hari =
            String(
                sekarang.getDate()
            ).padStart(2, "0");

        tanggalInput.value =
            `${tahun}-${bulan}-${hari}`;

    }
);


// ========================================
// FORMAT RUPIAH
// ========================================

function formatRupiah(angka) {

    return new Intl.NumberFormat(
        "id-ID",
        {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0
        }
    ).format(angka);

}


// ========================================
// HITUNG TOTAL
// ========================================

function hitungTotal() {

    const semuaProduk =
        document.querySelectorAll(".produk-item");

    let total = 0;


    semuaProduk.forEach(function(produk) {

        const harga =
            Number(
                produk.querySelector(
                    ".harga-produk"
                ).value
            ) || 0;


        const jumlah =
            Number(
                produk.querySelector(
                    ".jumlah-produk"
                ).value
            ) || 0;


        const subtotal =
            harga * jumlah;


        total += subtotal;


        produk.querySelector(
            ".subtotal strong"
        ).textContent =
            formatRupiah(subtotal);

    });


    totalElement.textContent =
        formatRupiah(total);

}


// ========================================
// PASANG EVENT PADA PRODUK
// ========================================

function pasangEvent(produk) {

    const harga =
        produk.querySelector(
            ".harga-produk"
        );

    const jumlah =
        produk.querySelector(
            ".jumlah-produk"
        );

    const hapus =
        produk.querySelector(
            ".hapus-produk"
        );


    harga.addEventListener(
        "input",
        hitungTotal
    );


    jumlah.addEventListener(
        "input",
        hitungTotal
    );


    hapus.addEventListener(
        "click",
        function() {

            produk.remove();

            hitungTotal();

        }
    );

}


// ========================================
// BUAT PRODUK BARU
// ========================================

function buatProduk() {

    const produk =
        document.createElement("div");

    produk.classList.add(
        "produk-item"
    );


    produk.innerHTML = `

        <div class="form-group">

            <label>Nama Produk</label>

            <input
                type="text"
                class="nama-produk"
                placeholder="Contoh: Kopi"
                required
            >

        </div>


        <div class="form-group">

            <label>Harga Satuan (Rp)</label>

            <input
                type="number"
                class="harga-produk"
                placeholder="Contoh: 15000"
                min="0"
                required
            >

        </div>


        <div class="form-group">

            <label>Jumlah Terjual</label>

            <input
                type="number"
                class="jumlah-produk"
                placeholder="Contoh: 3"
                min="1"
                value="1"
                required
            >

        </div>


        <div class="subtotal">

            Subtotal

            <strong>Rp 0</strong>

        </div>


        <button
            type="button"
            class="hapus-produk"
        >
            Hapus Produk
        </button>

    `;


    container.appendChild(produk);

    pasangEvent(produk);

}


// ========================================
// TOMBOL TAMBAH PRODUK
// ========================================

tambahProduk.addEventListener(
    "click",
    function() {

        buatProduk();

    }
);


// ========================================
// PRODUK PERTAMA
// ========================================

const produkPertama =
    document.querySelector(
        ".produk-item"
    );

pasangEvent(produkPertama);


// ========================================
// SUBMIT FORM
// ========================================

document
    .getElementById("penjualanForm")
    .addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            // ========================================
            // CEGAH DOUBLE CLICK
            // ========================================

            const tombolSimpan =
                document.querySelector(".btn-simpan");


            if (tombolSimpan.disabled) {

                return;

            }


            // ========================================
            // AMBIL DATA FORM
            // ========================================

            const tanggal =
                document.getElementById(
                    "tanggal"
                ).value;


            const catatan =
                document.getElementById(
                    "catatan"
                ).value;


            if (!tanggal) {

                alert(
                    "Silakan pilih tanggal transaksi."
                );

                return;

            }


            // ========================================
            // AMBIL SEMUA PRODUK
            // ========================================

            const semuaProduk =
                document.querySelectorAll(
                    ".produk-item"
                );


            const produk = [];


            semuaProduk.forEach(
                function(item) {

                    const nama =
                        item.querySelector(
                            ".nama-produk"
                        ).value;


                    const harga =
                        Number(
                            item.querySelector(
                                ".harga-produk"
                            ).value
                        ) || 0;


                    const jumlah =
                        Number(
                            item.querySelector(
                                ".jumlah-produk"
                            ).value
                        ) || 0;


                    const total =
                        harga * jumlah;


                    produk.push({

                        nama: nama,

                        harga: harga,

                        jumlah: jumlah,

                        total: total

                    });

                }
            );


            // ========================================
            // DATA YANG DIKIRIM
            // ========================================

            const data = {

                tanggal: tanggal,

                catatan: catatan,

                produk: produk

            };


            // ========================================
            // NONAKTIFKAN TOMBOL
            // ========================================

            tombolSimpan.disabled = true;

            tombolSimpan.textContent =
                "Menyimpan...";


            // ========================================
            // KIRIM KE GOOGLE APPS SCRIPT
            // ========================================

            try {

                // Jeda 
                await new Promise(
                    function(resolve) {

                        setTimeout(
                            resolve,
                            1000
                        );

                    }
                );


                const response =
                    await fetch(
                        SCRIPT_URL,
                        {
                            method: "POST",

                            body:
                                JSON.stringify(data)
                        }
                    );


                const result =
                    await response.json();


                if (
                    result.status ===
                    "success"
                ) {

                    alert(
                        "Data berhasil disimpan!"
                    );


                    document
                        .getElementById(
                            "penjualanForm"
                        )
                        .reset();


                    totalElement.textContent =
                        "Rp 0";


                } else {

                    alert(
                        "Gagal menyimpan data: " +
                        result.message
                    );


                    console.error(
                        result
                    );

                }


            } catch (error) {

                console.error(
                    error
                );


                alert(
                    "Terjadi kesalahan saat mengirim data."
                );


            } finally {

                // ========================================
                // AKTIFKAN KEMBALI TOMBOL
                // ========================================

                tombolSimpan.disabled =
                    false;


                tombolSimpan.textContent =
                    "Simpan Data";

            }

        }
    );


// ========================================
// HITUNG TOTAL SAAT HALAMAN DIBUKA
// ========================================

hitungTotal();
