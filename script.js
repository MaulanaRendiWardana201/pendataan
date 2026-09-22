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

const form =
    document.getElementById("penjualanForm");

const tanggalInput =
    document.getElementById("tanggal");

const tanggalHariIni =
    document.getElementById("tanggalHariIni");


// ========================================
// DATA MASTER PRODUK
// ========================================

let daftarProduk = [];


// ========================================
// TANGGAL HARI INI
// ========================================

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
// AMBIL DATA PRODUK DARI GOOGLE SHEETS
// ========================================

async function ambilProduk() {

    try {

        const response =
            await fetch(SCRIPT_URL);

        const result =
            await response.json();


        if (
            result.status !== "success"
        ) {

            throw new Error(
                result.message ||
                "Gagal mengambil data produk."
            );

        }


        daftarProduk =
            result.produk || [];


        isiSemuaDropdownProduk();


    } catch (error) {

        console.error(
            "Gagal mengambil data produk:",
            error
        );


        alert(
            "Data produk tidak dapat dimuat. " +
            "Pastikan Google Apps Script dapat diakses."
        );

    }

}


// ========================================
// ISI DROPDOWN SEMUA PRODUK
// ========================================

function isiSemuaDropdownProduk() {

    const semuaDropdown =
        document.querySelectorAll(
            ".nama-produk"
        );


    semuaDropdown.forEach(
        function(dropdown) {

            isiDropdownProduk(dropdown);

        }
    );

}


// ========================================
// ISI SATU DROPDOWN PRODUK
// ========================================

function isiDropdownProduk(dropdown) {

    dropdown.innerHTML = "";


    // Pilihan awal

    const optionAwal =
        document.createElement("option");

    optionAwal.value = "";

    optionAwal.textContent =
        "Pilih produk";

    dropdown.appendChild(
        optionAwal
    );


    // Daftar produk

    daftarProduk.forEach(
        function(item) {

            const option =
                document.createElement("option");

            option.value =
                item.nama;

            option.textContent =
                item.nama;

            dropdown.appendChild(
                option
            );

        }
    );

}


// ========================================
// CARI DATA PRODUK
// ========================================

function cariProduk(namaProduk) {

    return daftarProduk.find(
        function(item) {

            return (
                item.nama.toString().trim() ===
                namaProduk.toString().trim()
            );

        }
    );

}


// ========================================
// UPDATE HARGA DAN STOK
// ========================================

function updateDataProduk(produkItem) {

    const dropdown =
        produkItem.querySelector(
            ".nama-produk"
        );

    const harga =
        produkItem.querySelector(
            ".harga-produk"
        );

    const stok =
        produkItem.querySelector(
            ".stok-produk"
        );

    const jumlah =
        produkItem.querySelector(
            ".jumlah-produk"
        );


    const namaProduk =
        dropdown.value;


    // Jika belum memilih produk

    if (!namaProduk) {

        harga.value = "";

        stok.value = "";

        jumlah.max = "";

        hitungTotal();

        return;

    }


    // Cari produk

    const dataProduk =
        cariProduk(namaProduk);


    if (!dataProduk) {

        harga.value = "";

        stok.value = "";

        jumlah.max = "";

        hitungTotal();

        return;

    }


    // Tampilkan harga

    harga.value =
        dataProduk.hargaJual;


    // Tampilkan stok

    stok.value =
        dataProduk.stok;


    // Batasi jumlah sesuai stok

    jumlah.max =
        dataProduk.stok;


    // Jika jumlah sekarang lebih besar dari stok

    if (
        Number(jumlah.value) >
        Number(dataProduk.stok)
    ) {

        jumlah.value =
            dataProduk.stok;

    }


    hitungTotal();

}


// ========================================
// CEK JUMLAH TERJUAL
// ========================================

function cekJumlahProduk(produkItem) {

    const dropdown =
        produkItem.querySelector(
            ".nama-produk"
        );

    const jumlahInput =
        produkItem.querySelector(
            ".jumlah-produk"
        );

    const stokInput =
        produkItem.querySelector(
            ".stok-produk"
        );


    const namaProduk =
        dropdown.value;

    const jumlah =
        Number(jumlahInput.value) || 0;

    const stok =
        Number(stokInput.value) || 0;


    if (!namaProduk) {

        return true;

    }


    if (jumlah <= 0) {

        alert(
            "Jumlah terjual harus lebih dari 0."
        );

        jumlahInput.focus();

        return false;

    }


    if (jumlah > stok) {

        alert(
            "Jumlah terjual produk \"" +
            namaProduk +
            "\" melebihi stok yang tersedia.\n\n" +

            "Stok tersedia: " +
            stok +

            "\nJumlah terjual: " +
            jumlah
        );

        jumlahInput.value =
            stok;

        hitungTotal();

        jumlahInput.focus();

        return false;

    }


    return true;

}


// ========================================
// HITUNG TOTAL
// ========================================

function hitungTotal() {

    const semuaProduk =
        document.querySelectorAll(
            ".produk-item"
        );


    let total = 0;


    semuaProduk.forEach(
        function(produk) {

            const hargaInput =
                produk.querySelector(
                    ".harga-produk"
                );

            const jumlahInput =
                produk.querySelector(
                    ".jumlah-produk"
                );

            const harga =
                Number(
                    hargaInput.value
                ) || 0;

            const jumlah =
                Number(
                    jumlahInput.value
                ) || 0;

            const subtotal =
                harga * jumlah;


            total += subtotal;


            const subtotalElement =
                produk.querySelector(
                    ".subtotal strong"
                );


            if (subtotalElement) {

                subtotalElement.textContent =
                    formatRupiah(subtotal);

            }

        }
    );


    totalElement.textContent =
        formatRupiah(total);

}


// ========================================
// PASANG EVENT PADA PRODUK
// ========================================

function pasangEvent(produk) {

    const dropdown =
        produk.querySelector(
            ".nama-produk"
        );

    const jumlah =
        produk.querySelector(
            ".jumlah-produk"
        );

    const hapus =
        produk.querySelector(
            ".hapus-produk"
        );


    // ========================================
    // PILIH PRODUK
    // ========================================

    dropdown.addEventListener(
        "change",
        function() {

            updateDataProduk(
                produk
            );

        }
    );


    // ========================================
    // JUMLAH TERJUAL
    // ========================================

    jumlah.addEventListener(
        "input",
        function() {

            cekJumlahProduk(
                produk
            );

            hitungTotal();

        }
    );


    // ========================================
    // HAPUS PRODUK
    // ========================================

    hapus.addEventListener(
        "click",
        function() {

            const semuaProduk =
                document.querySelectorAll(
                    ".produk-item"
                );


            // Minimal satu produk

            if (
                semuaProduk.length <= 1
            ) {

                alert(
                    "Minimal harus ada satu produk."
                );

                return;

            }


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

            <label>
                Nama Produk
            </label>

            <select
                class="nama-produk"
                required
            >

                <option value="">
                    Pilih produk
                </option>

            </select>

        </div>


        <div class="form-group">

            <label>
                Harga Satuan (Rp)
            </label>

            <input
                type="number"
                class="harga-produk"
                placeholder="Harga otomatis"
                min="0"
                readonly
                required
            >

        </div>


        <div class="form-group">

            <label>
                Stok Tersedia
            </label>

            <input
                type="number"
                class="stok-produk"
                placeholder="Stok otomatis"
                min="0"
                readonly
            >

        </div>


        <div class="form-group">

            <label>
                Jumlah Terjual
            </label>

            <input
                type="number"
                class="jumlah-produk"
                placeholder="Masukkan jumlah barang"
                min="1"
                value="1"
                required
            >

        </div>


        <div class="subtotal">

            Subtotal

            <strong>
                Rp 0
            </strong>

        </div>


        <button
            type="button"
            class="hapus-produk"
        >
            Hapus Produk
        </button>

    `;


    container.appendChild(
        produk
    );


    // Isi dropdown

    const dropdown =
        produk.querySelector(
            ".nama-produk"
        );

    isiDropdownProduk(
        dropdown
    );


    // Pasang event

    pasangEvent(
        produk
    );


    hitungTotal();

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


if (produkPertama) {

    // Isi dropdown pertama

    const dropdown =
        produkPertama.querySelector(
            ".nama-produk"
        );

    isiDropdownProduk(
        dropdown
    );


    // Pasang event

    pasangEvent(
        produkPertama
    );

}


// ========================================
// SUBMIT FORM
// ========================================

form.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        // ========================================
        // CEGAH DOUBLE CLICK
        // ========================================

        const tombolSimpan =
            document.querySelector(
                ".btn-simpan"
            );


        if (
            tombolSimpan.disabled
        ) {

            return;

        }


        // ========================================
        // TANGGAL
        // ========================================

        const tanggal =
            tanggalInput.value;


        if (!tanggal) {

            alert(
                "Silakan pilih tanggal transaksi."
            );

            return;

        }


        // ========================================
        // CATATAN
        // ========================================

        const catatan =
            document.getElementById(
                "catatan"
            ).value;


        // ========================================
        // SEMUA PRODUK
        // ========================================

        const semuaProduk =
            document.querySelectorAll(
                ".produk-item"
            );


        const produk = [];


        // ========================================
        // VALIDASI PRODUK
        // ========================================

        for (
            let index = 0;
            index < semuaProduk.length;
            index++
        ) {

            const item =
                semuaProduk[index];


            const namaInput =
                item.querySelector(
                    ".nama-produk"
                );

            const hargaInput =
                item.querySelector(
                    ".harga-produk"
                );

            const jumlahInput =
                item.querySelector(
                    ".jumlah-produk"
                );

            const stokInput =
                item.querySelector(
                    ".stok-produk"
                );


            const nama =
                namaInput.value.trim();


            const harga =
                Number(
                    hargaInput.value
                ) || 0;


            const jumlah =
                Number(
                    jumlahInput.value
                ) || 0;


            const stok =
                Number(
                    stokInput.value
                ) || 0;


            // ========================================
            // CEK PRODUK
            // ========================================

            if (!nama) {

                alert(
                    "Silakan pilih produk ke-" +
                    (index + 1) +
                    "."
                );

                namaInput.focus();

                return;

            }


            // ========================================
            // CEK HARGA
            // ========================================

            if (harga <= 0) {

                alert(
                    "Harga produk ke-" +
                    (index + 1) +
                    " tidak valid."
                );

                return;

            }


            // ========================================
            // CEK JUMLAH
            // ========================================

            if (jumlah <= 0) {

                alert(
                    "Jumlah terjual produk ke-" +
                    (index + 1) +
                    " harus lebih dari 0."
                );

                jumlahInput.focus();

                return;

            }


            // ========================================
            // CEK STOK
            // ========================================

            if (jumlah > stok) {

                alert(
                    "Jumlah terjual produk \"" +
                    nama +
                    "\" melebihi stok yang tersedia.\n\n" +

                    "Stok tersedia: " +
                    stok +

                    "\nJumlah terjual: " +
                    jumlah
                );

                jumlahInput.focus();

                return;

            }


            // ========================================
            // MASUKKAN DATA
            // ========================================

            produk.push({

                nama: nama,

                harga: harga,

                jumlah: jumlah,

                total: harga * jumlah

            });

        }


        // ========================================
        // CEK PRODUK
        // ========================================

        if (
            produk.length === 0
        ) {

            alert(
                "Minimal harus ada satu produk."
            );

            return;

        }


        // ========================================
        // DATA YANG DIKIRIM
        // ========================================

        const data = {

            tanggal: tanggal,

            catatan: catatan,

            produk: produk

        };


        console.log(
            "Data yang dikirim ke Google Sheets:",
            data
        );


        // ========================================
        // NONAKTIFKAN TOMBOL
        // ========================================

        tombolSimpan.disabled =
            true;

        tombolSimpan.textContent =
            "Menyimpan...";


        // ========================================
        // KIRIM DATA
        // ========================================

        try {

            // Jeda 2 detik

            await new Promise(
                function(resolve) {

                    setTimeout(
                        resolve,
                        2000
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


            // ========================================
            // HASIL
            // ========================================

            if (
                result.status === "success"
            ) {

                alert(
                    "Data berhasil disimpan!"
                );


                // ========================================
                // RESET FORM
                // ========================================

                form.reset();


                // ========================================
                // HAPUS PRODUK TAMBAHAN
                // ========================================

                const semuaProdukSetelahReset =
                    document.querySelectorAll(
                        ".produk-item"
                    );


                semuaProdukSetelahReset.forEach(
                    function(item, index) {

                        if (
                            index > 0
                        ) {

                            item.remove();

                        }

                    }
                );


                // ========================================
                // RESET PRODUK PERTAMA
                // ========================================

                const produkPertamaSetelahReset =
                    document.querySelector(
                        ".produk-item"
                    );


                if (
                    produkPertamaSetelahReset
                ) {

                    const dropdown =
                        produkPertamaSetelahReset
                            .querySelector(
                                ".nama-produk"
                            );

                    const harga =
                        produkPertamaSetelahReset
                            .querySelector(
                                ".harga-produk"
                            );

                    const stok =
                        produkPertamaSetelahReset
                            .querySelector(
                                ".stok-produk"
                            );

                    const jumlah =
                        produkPertamaSetelahReset
                            .querySelector(
                                ".jumlah-produk"
                            );

                    const subtotal =
                        produkPertamaSetelahReset
                            .querySelector(
                                ".subtotal strong"
                            );


                    // Isi ulang dropdown

                    isiDropdownProduk(
                        dropdown
                    );


                    // Reset data

                    harga.value = "";

                    stok.value = "";

                    jumlah.value = 1;

                    jumlah.max = "";


                    subtotal.textContent =
                        "Rp 0";

                }


                // ========================================
                // RESET TOTAL
                // ========================================

                totalElement.textContent =
                    "Rp 0";


                hitungTotal();


                // ========================================
                // REFRESH DATA STOK
                // ========================================

                await ambilProduk();


            } else {

                alert(
                    "Gagal menyimpan data: " +
                    result.message
                );


                console.error(
                    "Response Google Apps Script:",
                    result
                );

            }


        } catch (error) {

            console.error(
                "Error:",
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


// ========================================
// AMBIL PRODUK SAAT HALAMAN DIBUKA
// ========================================

ambilProduk();
