document.addEventListener('DOMContentLoaded', function () {
    const inputBuku = document.getElementById('my-inputBook');
    const tombolSubmitBuku = document.getElementById('my-bookSubmit');
    const daftarRakBukuBelumSelesai = document.getElementById('my-incompleteBookshelfList');
    const daftarRakBukuSelesai = document.getElementById('my-completeBookshelfList');

    let buku = [];
    const bukuTersimpan = localStorage.getItem('buku');
    if (bukuTersimpan) {
        buku = JSON.parse(bukuTersimpan);
    }

    function simpanBukuKeLocalStorage() {
        localStorage.setItem('buku', JSON.stringify(buku));
    }

    inputBuku.addEventListener('submit', function (e) {
        e.preventDefault();

        const inputBookTitle = document.getElementById('my-inputBookTitle').value;
        const inputBookAuthor = document.getElementById('my-inputBookAuthor').value;
        const inputBookYear = Number(document.getElementById('my-inputBookYear').value);
        const inputBookIsComplete = document.getElementById('my-inputBookIsComplete').checked;

        const isDuplikat = buku.some(b => b.title === inputBookTitle);

        if (isDuplikat) {
            alert('Buku dengan judul yang sama sudah ada dalam daftar.');
        } else {
            const bukuBaru = {
                id: new Date().getTime(),
                title: inputBookTitle,
                author: inputBookAuthor,
                year: inputBookYear,
                isComplete: inputBookIsComplete,
            };

            buku.push(bukuBaru);
            simpanBukuKeLocalStorage();
            perbaruiRakBuku();

            document.getElementById('my-inputBookTitle').value = '';
            document.getElementById('my-inputBookAuthor').value = '';
            document.getElementById('my-inputBookYear').value = '';
            document.getElementById('my-inputBookIsComplete').checked = false;
        }
    });

    function perbaruiRakBuku() {
        daftarRakBukuBelumSelesai.innerHTML = '';
        daftarRakBukuSelesai.innerHTML = '';

        for (const b of buku) {
            const itemBuku = buatItemBuku(b);
            if (b.isComplete) {
                daftarRakBukuSelesai.appendChild(itemBuku);
            } else {
                daftarRakBukuBelumSelesai.appendChild(itemBuku);
            }
        }
    }

    function hapusBuku(id) {
        const indeks = buku.findIndex(b => b.id === id);
        if (indeks !== -1) {
            buku.splice(indeks, 1);
            simpanBukuKeLocalStorage();
            perbaruiRakBuku();

            alert('Buku Berhasil Dihapus');
        }
    }

    function toggleStatusSelesai(id) {
        const indeks = buku.findIndex(b => b.id === id);
        if (indeks !== -1) {
            buku[indeks].isComplete = !buku[indeks].isComplete;
            simpanBukuKeLocalStorage();
            perbaruiRakBuku();
        }
    }

    const formCariBuku = document.getElementById('my-searchBook');
    const inputJudulCariBuku = document.getElementById('my-searchBookTitle');

    formCariBuku.addEventListener('submit', function (e) {
        e.preventDefault();
        const query = inputJudulCariBuku.value.toLowerCase().trim();

        const hasilPencarian = buku.filter(b => {
            return (
                b.title.toLowerCase().includes(query) ||
                b.author.toLowerCase().includes(query) ||
                b.year.toString().includes(query)
            );
        });

        perbaruiHasilPencarian(hasilPencarian);
    });

    function perbaruiHasilPencarian(hasilPencarian) {
        daftarRakBukuBelumSelesai.innerHTML = '';
        daftarRakBukuSelesai.innerHTML = '';

        for (const b of hasilPencarian) {
            const itemBuku = buatItemBuku(b);
            if (b.isComplete) {
                daftarRakBukuSelesai.appendChild(itemBuku);
            } else {
                daftarRakBukuBelumSelesai.appendChild(itemBuku);
            }
        }
    }

    function buatItemBuku(b) {
        const itemBuku = document.createElement('article');
        itemBuku.className = 'item_buku';
        itemBuku.style.margin = '10px';

        const tombolAksi = document.createElement('div');
        tombolAksi.className = 'aksi';

        const judul = document.createElement('h3');
        judul.textContent = b.title;
        judul.style.color = 'white';
        judul.style.marginBottom = '10px';

        const pengarang = document.createElement('p');
        pengarang.textContent = 'Pengarang: ' + b.author;
        pengarang.style.color = 'white';
        pengarang.style.marginBottom = '10px';

        const tahunTerbit = document.createElement('p');
        tahunTerbit.textContent = 'Tahun Terbit: ' + b.year;
        tahunTerbit.style.color = 'white';
        tahunTerbit.style.marginBottom = '10px';

        const tombolHapus = buatTombolAksi('Hapus buku', 'merah', function () {
            hapusBuku(b.id);
        });

        let tombolToggle;
        if (b.isComplete) {
            tombolToggle = buatTombolAksi('Belum selesai di Baca', 'kuning', function () {
                toggleStatusSelesai(b.id);
            });
        } else {
            tombolToggle = buatTombolAksi('Selesai dibaca', 'hijau', function () {
                toggleStatusSelesai(b.id);
            });
        }

        tombolHapus.style.padding = '10px';
        tombolHapus.style.margin = '10px';
        tombolHapus.style.borderRadius = '10px';
        tombolHapus.style.border = '0';
        tombolHapus.style.backgroundColor = '#FF2222';
        tombolHapus.style.color = 'white';
        tombolHapus.style.fontWeight = 'bold';

        tombolToggle.style.padding = '10px';
        tombolToggle.style.borderRadius = '10px';
        tombolToggle.style.border = '0';
        tombolToggle.style.backgroundColor = '#34992B';
        tombolToggle.style.color = 'white';
        tombolToggle.style.fontWeight = 'bold';

        tombolAksi.appendChild(tombolToggle);
        tombolAksi.appendChild(tombolHapus);

        itemBuku.appendChild(judul);
        itemBuku.appendChild(pengarang);
        itemBuku.appendChild(tahunTerbit);
        itemBuku.appendChild(tombolAksi);

        return itemBuku;
    }

    function buatTombolAksi(text, className, clickHandler) {
        const tombol = document.createElement('button');
        tombol.textContent = text;
        tombol.classList.add(className);
        tombol.addEventListener('click', clickHandler);
        return tombol;
    }

    perbaruiRakBuku();
});
