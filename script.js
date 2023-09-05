const books = [];
const RENDER_EVENT = 'render-book';
const STORAGE_KEY = 'rak-buku';

function isStorageExist() {
    if (typeof (Storage) !== undefined) {
        return true;
    } else {
        alert('Broser Mu Lawas Gak Mendukung Storage');
        return false;
    }
}

function tambahBuku() {
    const judulBuku = document.getElementById('judul-buku').value;
    const penulisBuku = document.getElementById('penulis-buku').value;
    const tahunBuku = parseInt(document.getElementById('tahun-buku').value);
    const isRead = document.getElementById('sudah-selesai');
    let statusBuku;

    if (isRead.checked){
        statusBuku = true;
    } else {
        statusBuku = false;
    }

    const idBuku = dapatkanID();
    const objectBuku = buatObjectBuku(idBuku, judulBuku, penulisBuku, tahunBuku, statusBuku);
    books.push(objectBuku); 

    document.dispatchEvent(new Event(RENDER_EVENT));
    simpanBuku();
}

function dapatkanID() {
    return +new Date();
}

function buatObjectBuku(id, judul, penulis, tahun, isRead) {
    return {
        id,
        judul,
        penulis,
        tahun,
        isRead
    }
}

function buatBuku(objectBuku) {
    const teksJudul = document.createElement('p');
    teksJudul.classList.add('judul-buku');
    teksJudul.innerHTML = `${objectBuku.judul} <span>(${objectBuku.tahun})</span>`;

    const teksPenulis = document.createElement('p');
    teksPenulis.innerText = objectBuku.penulis;

    const teksContainer = document.createElement('div');
    teksContainer.append(teksJudul, teksPenulis);

    const container = document.createElement('div');
    container.classList.add("buku");
    container.append(teksContainer);
    container.setAttribute("id", `buku-${objectBuku.id}`);

    if (objectBuku.isRead) {
        const tombolUndo = document.createElement('button');
        tombolUndo.classList.add("tombol-undo");

        tombolUndo.addEventListener('click', function(){
            undoBuku(objectBuku.id);
        });

        const tombolEdit = document.createElement('button');
        tombolEdit.classList.add('tombol-edit');

        tombolEdit.addEventListener('click', function(){
            editBuku(objectBuku.id);
        });

        const tombolDelete = document.createElement('button');
        tombolDelete.classList.add("tombol-delete");

        tombolDelete.addEventListener('click', function(){
            deleteBuku(objectBuku.id);
        });

        container.append(tombolUndo, tombolEdit, tombolDelete);
    } else {
        const tombolComplete = document.createElement('button');
        tombolComplete.classList.add("tombol-complete");

        tombolComplete.addEventListener('click', function(){
            pindahBuku(objectBuku.id);
        });

        const tombolEdit = document.createElement('button');
        tombolEdit.classList.add('tombol-edit');

        tombolEdit.addEventListener('click', function(){
            editBuku(objectBuku.id);
        });

        const tombolDelete = document.createElement('button');
        tombolDelete.classList.add("tombol-delete");

        tombolDelete.addEventListener('click', function(){
            deleteBuku(objectBuku.id);
        });

        container.append(tombolComplete, tombolEdit, tombolDelete);
    }
    return container;
}

function pindahBuku(bukuId) {
    const targetBuku = cariBuku(bukuId);

    if (targetBuku == null) return;
    targetBuku.isRead = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    pindahDataBuku();
}

function undoBuku(bukuId) {
    const targetBuku = cariBuku(bukuId);

    if (targetBuku == null) return;
    targetBuku.isRead = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    pindahDataBuku();
}

function deleteBuku(bukuId) {
    const targetBuku = cariIndexBuku(bukuId);

    if (targetBuku === -1) return;
    books.splice(targetBuku, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    deleteDataBuku();
}

function cariBuku(bukuId) {
    for (const itemBuku of books){
        if (itemBuku.id === bukuId){
            return itemBuku;
        }
    }

    return null;
}

function cariIndexBuku(bukuId) {
    for (const index in books){
        if (books[index].id === bukuId){
            return index;
        }
    }

    return -1;
}

function simpanBuku() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);

    }
}

function pindahDataBuku() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
    }
}

function deleteDataBuku() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
    }
}

function loadDataBuku() {
    const dataBuku = JSON.parse(localStorage.getItem(STORAGE_KEY));

    if (dataBuku !== null){
        for (const buku of dataBuku){
            books.push(buku);
        }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
}

document.addEventListener(RENDER_EVENT, function(){
    const bukuBelumSelesai = document.getElementById('bukuBelumSelesai');
    const bukuSudahSelesai = document.getElementById('bukuSudahSelesai');

    bukuBelumSelesai.innerHTML = "";
    bukuSudahSelesai.innerHTML = "";

    for (const buku of books){
        const itemBuku = buatBuku(buku);
        if (buku.isRead) {
            bukuSudahSelesai.append(itemBuku);
        } else {
            bukuBelumSelesai.append(itemBuku);
        }
    }
});


document.addEventListener('DOMContentLoaded', function(){
    if (isStorageExist()) {
        loadDataBuku();
    }

    const submitForm = document.getElementById('form');
    submitForm.addEventListener('submit', (event) => {
        event.preventDefault();
        tambahBuku();
    });

    const formPencarian = document.getElementById('form-pencarian');
    formPencarian.addEventListener('submit', function(event){
        event.preventDefault();
        cariBukuYangDiinginkan();
    });

});

function cariBukuYangDiinginkan() {
    const inputPencarian = document.getElementById("cari-judul-buku").value.toLowerCase();
    const daftarBuku = document.getElementsByClassName('buku');

    for (let i = 0; i < daftarBuku.length; i++){
        const judulBuku = daftarBuku[i].querySelector('.judul-buku');
        if (judulBuku.textContent.toLowerCase().includes(inputPencarian)){
            daftarBuku[i].style.display = "";
        } else {
            daftarBuku[i].style.display = "none";
        }
    }

}

function editBuku(bukuId) {
    const targetBuku = cariBuku(bukuId);

    if (targetBuku == null) return;

    const judulBaru = prompt('Edit judul buku:', targetBuku.judul);
    const penulisBaru = prompt('Edit penulis buku:', targetBuku.penulis);
    const tahunBaru = prompt('Edit tahun buku:', targetBuku.tahun);

    if (judulBaru !== null && penulisBaru !== null && tahunBaru !== null) {

        targetBuku.judul = judulBaru;
        targetBuku.penulis = penulisBaru;
        targetBuku.tahun = tahunBaru;
        pindahDataBuku();
        document.dispatchEvent(new Event(RENDER_EVENT));
    }
}

    

