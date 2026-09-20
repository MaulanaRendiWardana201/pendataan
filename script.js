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

            const semuaProduk =
                document.querySelectorAll(
                    ".produk-item"
                );


            // Jangan biarkan semua produk terhapus
            if (semuaProduk.length <= 1) {

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

            <label>Nama Produk</label>

            <input
                type="text"
                class="nama-produk"
                placeholder="Masukkan nama barang"
                required
            >

        </div>


        <div class="form-group">

            <label>Harga Satuan (Rp)</label>

            <input
                type="number"
                class="harga-produk"
                placeholder="Masukkan nominal"
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

    pasangEvent(produkPertama);

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


        if (tombolSimpan.disabled) {

            return;

        }


        // ========================================
        // AMBIL DATA FORM
        // ========================================

        const tanggal =
            tanggalInput.value;


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
            function(item, index) {

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


                const total =
                    harga * jumlah;


                // ========================================
                // CEK NAMA PRODUK
                // ========================================

                if (!nama) {

                    alert(
                        "Nama produk ke-" +
                        (index + 1) +
                        " belum diisi."
                    );

                    namaInput.focus();

                    return;

                }


                // ========================================
                // MASUKKAN DATA PRODUK
                // ========================================

                produk.push({

                    nama: nama,

                    harga: harga,

                    jumlah: jumlah,

                    total: total

                });


                // ========================================
                // DEBUG
                // ========================================

                console.log(
                    "Produk ke-" +
                    (index + 1) +
                    ":",
                    {
                        nama: nama,
                        harga: harga,
                        jumlah: jumlah,
                        total: total
                    }
                );

            }
        );


        // ========================================
        // CEK JUMLAH PRODUK
        // ========================================

        if (
            produk.length !==
            semuaProduk.length
        ) {

            return;

        }


        if (produk.length === 0) {

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


        // ========================================
        // LIHAT DATA SEBELUM DIKIRIM
        // ========================================

        console.log(
            "Data yang dikirim ke Google Sheets:",
            data
        );


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
            // HASIL DARI GOOGLE APPS SCRIPT
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

                        // Produk pertama dipertahankan
                        if (index > 0) {

                            item.remove();

                        }

                    }
                );


                // ========================================
                // RESET SUBTOTAL PRODUK PERTAMA
                // ========================================

                const produkPertamaSetelahReset =
                    document.querySelector(
                        ".produk-item"
                    );


                if (
                    produkPertamaSetelahReset
                ) {

                    produkPertamaSetelahReset
                        .querySelector(
                            ".subtotal strong"
                        )
                        .textContent =
                        "Rp 0";

                }


                // ========================================
                // RESET TOTAL
                // ========================================

                totalElement.textContent =
                    "Rp 0";


                hitungTotal();


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
