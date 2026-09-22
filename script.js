// ========================================
// URL GOOGLE APPS SCRIPT
// ========================================

const SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbzRHx_0Pz7X7Ke3G2S4iDcDHTttljtG5XmJy1qUb3Wr_xrQjKER7JYKCKSaKcl-rqVf/exec";


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

        const sekarang =
            new Date();

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
// AMBIL DATA PRODUK
// ========================================

async function ambilProduk() {

    try {

        const response =
            await fetch(
                SCRIPT_URL
            );


        const result =
            await response.json();


        if (
            result.status !==
            "success"
        ) {

            throw new Error(
                result.message ||
                "Gagal mengambil data produk."
            );

        }


        daftarProduk =
            result.produk || [];


        // Update semua pencarian

        document
            .querySelectorAll(
                ".cari-produk"
            )
            .forEach(
                function(input) {

                    input.placeholder =
                        "Ketik untuk mencari produk...";

                }
            );


    } catch (error) {

        console.error(
            "Gagal mengambil data produk:",
            error
        );


        alert(
            "Data produk tidak dapat dimuat."
        );

    }

}


// ========================================
// CARI PRODUK
// ========================================

function cariProduk(
    namaProduk
) {

    return daftarProduk.find(
        function(item) {

            return (
                item.nama
                    .toString()
                    .trim()
                    .toLowerCase() ===
                namaProduk
                    .toString()
                    .trim()
                    .toLowerCase()
            );

        }
    );

}


// ========================================
// TAMPILKAN HASIL PENCARIAN
// ========================================

function tampilkanHasilPencarian(
    produkItem,
    kataKunci
) {

    const input =
        produkItem.querySelector(
            ".cari-produk"
        );

    const hasil =
        produkItem.querySelector(
            ".hasil-produk"
        );


    const teks =
        kataKunci
            .trim()
            .toLowerCase();


    hasil.innerHTML = "";


    // Jika tidak ada kata pencarian
    // tampilkan semua produk

    let produkHasil;


    if (!teks) {

        produkHasil =
            daftarProduk;

    } else {

        produkHasil =
            daftarProduk.filter(
                function(item) {

                    return item.nama
                        .toString()
                        .toLowerCase()
                        .includes(teks);

                }
            );

    }


    // Tidak ada hasil

    if (
        produkHasil.length === 0
    ) {

        hasil.innerHTML = `
            <div class="produk-tidak-ditemukan">
                Produk tidak ditemukan
            </div>
        `;

        hasil.style.display =
            "block";

        return;

    }


    // ========================================
    // BATASI HASIL YANG DITAMPILKAN
    // ========================================

    produkHasil.forEach(
        function(item) {

            const pilihan =
                document.createElement(
                    "div"
                );


            pilihan.classList.add(
                "pilihan-produk"
            );


            pilihan.textContent =
                item.nama;


            pilihan.addEventListener(
                "mousedown",
                function(event) {

                    event.preventDefault();

                    pilihProduk(
                        produkItem,
                        item
                    );

                }
            );


            hasil.appendChild(
                pilihan
            );

        }
    );


    hasil.style.display =
        "block";

}


// ========================================
// PILIH PRODUK
// ========================================

function pilihProduk(
    produkItem,
    dataProduk
) {

    const input =
        produkItem.querySelector(
            ".cari-produk"
        );

    const namaInput =
        produkItem.querySelector(
            ".nama-produk"
        );

    const hargaInput =
        produkItem.querySelector(
            ".harga-produk"
        );

    const stokInput =
        produkItem.querySelector(
            ".stok-produk"
        );

    const jumlahInput =
        produkItem.querySelector(
            ".jumlah-produk"
        );

    const hasil =
        produkItem.querySelector(
            ".hasil-produk"
        );


    // ========================================
    // SIMPAN NAMA PRODUK
    // ========================================

    input.value =
        dataProduk.nama;


    namaInput.value =
        dataProduk.nama;


    // ========================================
    // HARGA JUAL
    // ========================================

    hargaInput.value =
        dataProduk.hargaJual;


    // ========================================
    // STOK
    // ========================================

    stokInput.value =
        dataProduk.stok;


    // ========================================
    // BATAS JUMLAH
    // ========================================

    jumlahInput.max =
        dataProduk.stok;


    // ========================================
    // RESET JUMLAH
    // ========================================

    if (
        Number(jumlahInput.value) >
        Number(dataProduk.stok)
    ) {

        jumlahInput.value =
            dataProduk.stok;

    }


    // ========================================
    // TUTUP HASIL
    // ========================================

    hasil.innerHTML = "";

    hasil.style.display =
        "none";


    // ========================================
    // HITUNG TOTAL
    // ========================================

    hitungTotal();

}


// ========================================
// RESET DATA PRODUK
// ========================================

function resetDataProduk(
    produkItem
) {

    const namaInput =
        produkItem.querySelector(
            ".nama-produk"
        );

    const hargaInput =
        produkItem.querySelector(
            ".harga-produk"
        );

    const stokInput =
        produkItem.querySelector(
            ".stok-produk"
        );

    const hasil =
        produkItem.querySelector(
            ".hasil-produk"
        );


    namaInput.value = "";

    hargaInput.value = "";

    stokInput.value = "";


    produkItem.querySelector(
        ".jumlah-produk"
    ).max = "";


    hasil.innerHTML = "";

    hasil.style.display =
        "none";


    hitungTotal();

}


// ========================================
// VALIDASI JUMLAH
// ========================================

function cekJumlahProduk(
    produkItem
) {

    const namaInput =
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


    const nama =
        namaInput.value;


    const jumlah =
        Number(
            jumlahInput.value
        ) || 0;


    const stok =
        Number(
            stokInput.value
        ) || 0;


    if (!nama) {

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
            nama +
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


            total +=
                subtotal;


            const subtotalElement =
                produk.querySelector(
                    ".subtotal strong"
                );


            if (
                subtotalElement
            ) {

                subtotalElement.textContent =
                    formatRupiah(
                        subtotal
                    );

            }

        }
    );


    totalElement.textContent =
        formatRupiah(total);

}


// ========================================
// PASANG EVENT PRODUK
// ========================================

function pasangEvent(
    produkItem
) {

    const input =
        produkItem.querySelector(
            ".cari-produk"
        );

    const jumlah =
        produkItem.querySelector(
            ".jumlah-produk"
        );

    const hapus =
        produkItem.querySelector(
            ".hapus-produk"
        );


    // ========================================
    // SAAT MENGETIK PRODUK
    // ========================================

    input.addEventListener(
        "input",
        function() {

            const namaTersimpan =
                produkItem.querySelector(
                    ".nama-produk"
                ).value;


            // Jika user mengubah
            // nama setelah memilih produk

            if (
                input.value !==
                namaTersimpan
            ) {

                resetDataProduk(
                    produkItem
                );

            }


            tampilkanHasilPencarian(
                produkItem,
                input.value
            );

        }
    );


    // ========================================
    // SAAT INPUT MENDAPAT FOKUS
    // ========================================

    input.addEventListener(
        "focus",
        function() {

            tampilkanHasilPencarian(
                produkItem,
                input.value
            );

        }
    );


    // ========================================
    // SAAT INPUT KEHILANGAN FOKUS
    // ========================================

    input.addEventListener(
        "blur",
        function() {

            setTimeout(
                function() {

                    const hasil =
                        produkItem.querySelector(
                            ".hasil-produk"
                        );

                    hasil.style.display =
                        "none";

                },
                150
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
                produkItem
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


            if (
                semuaProduk.length <= 1
            ) {

                alert(
                    "Minimal harus ada satu produk."
                );

                return;

            }


            produkItem.remove();

            hitungTotal();

        }
    );

}


// ========================================
// BUAT PRODUK BARU
// ========================================

function buatProduk() {

    const produk =
        document.createElement(
            "div"
        );


    produk.classList.add(
        "produk-item"
    );


    produk.innerHTML = `

        <div class="form-group">

            <label>
                Nama Produk
            </label>


            <div class="pencarian-produk">

                <input
                    type="text"
                    class="cari-produk"
                    placeholder="Ketik untuk mencari produk..."
                    autocomplete="off"
                    required
                >


                <div
                    class="hasil-produk"
                ></div>

            </div>


            <input
                type="hidden"
                class="nama-produk"
                required
            >

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

            <span>
                Subtotal
            </span>

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
        // VALIDASI
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
            // CEK NAMA
            // ========================================

            if (!nama) {

                alert(
                    "Silakan pilih produk ke-" +
                    (index + 1) +
                    "."
                );


                item.querySelector(
                    ".cari-produk"
                ).focus();


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

            if (
                jumlah > stok
            ) {

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

                total:
                    harga * jumlah

            });

        }


        // ========================================
        // CEK JUMLAH PRODUK
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
        // DATA
        // ========================================

        const data = {

            tanggal: tanggal,

            catatan: catatan,

            produk: produk

        };


        console.log(
            "Data yang dikirim:",
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
        // KIRIM
        // ========================================

        try {

            // Jeda 2 detik

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
                            JSON.stringify(
                                data
                            )
                    }
                );


            const result =
                await response.json();


            // ========================================
            // BERHASIL
            // ========================================

            if (
                result.status ===
                "success"
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

                    const input =
                        produkPertamaSetelahReset
                            .querySelector(
                                ".cari-produk"
                            );

                    const namaInput =
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


                    input.value = "";

                    namaInput.value = "";

                    harga.value = "";

                    stok.value = "";

                    jumlah.value = 1;

                    jumlah.max = "";


                    subtotal.textContent =
                        "Rp 0";


                    const hasil =
                        produkPertamaSetelahReset
                            .querySelector(
                                ".hasil-produk"
                            );


                    hasil.innerHTML = "";

                    hasil.style.display =
                        "none";

                }


                // ========================================
                // RESET TOTAL
                // ========================================

                totalElement.textContent =
                    "Rp 0";


                hitungTotal();


                // ========================================
                // UPDATE STOK
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
            // AKTIFKAN KEMBALI
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
// AMBIL DATA PRODUK
// ========================================

ambilProduk();
