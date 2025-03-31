document.addEventListener('DOMContentLoaded', () => {
    const diaryEntriesContainer = document.querySelector('.diary-entries');
    const diaryContentArea = document.getElementById('diary-content-area');
    const saveHtmlBtn = document.getElementById('save-html-btn');
    const saveJpgBtn = document.getElementById('save-jpg-btn');
    const addEntryBtn = document.getElementById('add-entry-btn');

    // --- Fungsi untuk Ganti Gambar ---
    function setupImageEditing() {
        const imageContainers = document.querySelectorAll('.entry-image-container');

        imageContainers.forEach(container => {
            container.addEventListener('click', () => {
                // Buat input file sementara
                const fileInput = document.createElement('input');
                fileInput.type = 'file';
                fileInput.accept = 'image/*'; // Hanya terima file gambar

                // Ketika file dipilih
                fileInput.onchange = (event) => {
                    const file = event.target.files[0];
                    if (file) {
                        const reader = new FileReader();

                        reader.onload = (e) => {
                            // Cari elemen img di dalam container yang diklik
                            const imgElement = container.querySelector('.entry-image');
                            if (imgElement) {
                                imgElement.src = e.target.result; // Ganti src dengan data URL gambar baru
                            }
                        }
                        reader.readAsDataURL(file); // Baca file sebagai Data URL
                    }
                };

                fileInput.click(); // Buka dialog pilih file
            });
        });
    }

    // --- Fungsi Simpan sebagai HTML ---
    saveHtmlBtn.addEventListener('click', () => {
        // 1. Clone elemen utama untuk menghindari modifikasi langsung
        const contentToSave = diaryContentArea.cloneNode(true);

        // 2. Hapus atribut contenteditable dari clone
        const editableElements = contentToSave.querySelectorAll('[contenteditable="true"]');
        editableElements.forEach(el => el.removeAttribute('contenteditable'));

        // 3. Hapus overlay edit gambar dari clone (jika ada, untuk kebersihan)
        const overlays = contentToSave.querySelectorAll('.image-edit-overlay');
        overlays.forEach(ov => ov.remove());

        // 4. Dapatkan HTML dari clone
        // Kita perlu menyertakan doctype, head (untuk CSS & font), dan body
        const currentStyleSheets = Array.from(document.styleSheets)
            .map(sheet => sheet.href ? `<link rel="stylesheet" href="${sheet.href}">` : '') // Ambil link CSS eksternal
            .join('\n');
        const currentFonts = Array.from(document.querySelectorAll('link[href*="fonts.googleapis.com"]'))
            .map(fontLink => fontLink.outerHTML) // Ambil link Google Fonts
            .join('\n');

        const htmlContent = `
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Diari Tersimpan</title>
    ${currentFonts}
    ${currentStyleSheets}
    <link rel="stylesheet" href="style.css"> <!-- Pastikan style.css juga ada jika link relatif -->
    <style>
        /* Tambahkan style inline jika ada yang tidak tercover link external */
        .action-buttons { display: none; } /* Sembunyikan tombol saat dibuka lagi */
        /* Anda mungkin perlu menambahkan style dari style.css di sini jika hanya ingin 1 file HTML mandiri */
    </style>
</head>
<body>
    ${contentToSave.outerHTML}
    <!-- Tombol aksi tidak disertakan dalam file tersimpan -->
</body>
</html>`;

        // 5. Buat Blob dan trigger download
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'diari-tersimpan.html'; // Nama file download
        link.click();
        URL.revokeObjectURL(link.href); // Bersihkan URL object

        alert('File HTML berhasil dibuat!');
    });

    // --- Fungsi Simpan sebagai JPG (Menggunakan html2canvas) ---
    saveJpgBtn.addEventListener('click', () => {
        alert('Membuat gambar JPG, mohon tunggu...'); // Beri tahu pengguna proses dimulai

        // Sembunyikan sementara tombol aksi agar tidak ikut tercapture
        const actionButtons = document.querySelector('.action-buttons');
        actionButtons.style.display = 'none';

        html2canvas(diaryContentArea, {
            useCORS: true, // Penting jika ada gambar dari domain lain (meski di sini pakai data url)
            allowTaint: true, // Izinkan gambar dari origin lain (terutama jika pakai path lokal)
            backgroundColor: window.getComputedStyle(document.body).backgroundColor, // Ambil warna bg body
            scale: window.devicePixelRatio * 1.5 // Tingkatkan resolusi (opsional, bisa disesuaikan)
        }).then(canvas => {
            // Kembalikan tombol aksi
            actionButtons.style.display = 'flex';

            // Buat link download untuk gambar dari canvas
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/jpeg', 0.9); // 0.9 = kualitas JPG
            link.download = 'diari-gambar.jpg';
            link.click();
            alert('File JPG berhasil dibuat!');

        }).catch(error => {
            // Kembalikan tombol aksi jika terjadi error
            actionButtons.style.display = 'flex';
            console.error("Gagal membuat gambar:", error);
            alert("Maaf, terjadi kesalahan saat membuat gambar JPG.");
        });
    });

    // --- Fungsi Tambah Entri Baru ---
    addEntryBtn.addEventListener('click', () => {
        const newEntryHTML = `
            <article class="diary-entry">
                <div class="entry-image-container">
                    <img src="images/placeholder-default.jpg" alt="Gambar Baru" class="entry-image editable-image" data-original-src="images/placeholder-default.jpg">
                    <div class="image-edit-overlay">Klik untuk ganti gambar</div>
                </div>
                <div class="entry-text-content">
                    <header class="entry-header">
                        <h2 class="entry-title" contenteditable="true">Judul Entri Baru</h2>
                        <p class="entry-meta">
                            <time datetime="${new Date().toISOString().slice(0,10)}" contenteditable="true">${new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</time> | <span class="entry-location" contenteditable="true">Lokasi Baru</span>
                        </p>
                    </header>
                    <div class="entry-content" contenteditable="true">
                        <p>Tulis ceritamu di sini...</p>
                    </div>
                    <footer class="entry-footer">
                        <span class="mood-indicator happy" contenteditable="true">Mood: Senang 😄</span>
                    </footer>
                </div>
            </article>
        `;

        // Masukkan HTML entri baru ke dalam kontainer
        diaryEntriesContainer.insertAdjacentHTML('beforeend', newEntryHTML);

        // Re-inisialisasi event listener untuk gambar pada entri baru
        setupImageEditing();

        // Scroll ke entri baru (opsional)
        const newEntryElement = diaryEntriesContainer.lastElementChild;
        if (newEntryElement) {
            newEntryElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
            // Fokuskan ke judul entri baru agar bisa langsung diedit
            const newTitle = newEntryElement.querySelector('.entry-title');
            if (newTitle) newTitle.focus();
        }
    });

    // Inisialisasi Awal
    setupImageEditing(); // Setup listener untuk gambar yang sudah ada saat halaman load

}); // Akhir DOMContentLoaded