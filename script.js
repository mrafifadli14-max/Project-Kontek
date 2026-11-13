const seedData = [
      {
        id: "LPR-101",
        kategori: "1. AC / Pendingin Ruangan",
        lokasi: "Ruang Kuliah 2.04",
        deskripsi: "AC menyala tetapi suhu tetap panas saat perkuliahan berlangsung.",
        foto: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&q=80",
        nama: "Budi Mahasiswa",
        kontak: "12322001",
        status: "Diproses",
        teknisi: "Pak Bambang (Teknisi Pendingin)",
        catatanTeknisi: "Filter AC sudah dibersihkan dan freon diisi ulang. Normal kembali.",
        waktu: "04 Nov 2026, 09:00"
      },
      {
        id: "LPR-102",
        kategori: "4. Toilet Lantai",
        lokasi: "Toilet Lantai 1 Gedung B",
        deskripsi: "Kran wastafel bocor terus menerus.",
        foto: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&q=80",
        nama: "Siti Rahma",
        kontak: "12322008",
        status: "Diterima",
        teknisi: "Belum Ditugaskan",
        catatanTeknisi: "Belum ada tindakan lapangan.",
        waktu: "04 Nov 2026, 10:15"
      }
    ];

    let laporanList = JSON.parse(localStorage.getItem('fti_lapor_v3')) || seedData;
    let tempFotoUrl = "";
    let currentRole = "mahasiswa";

    document.addEventListener("DOMContentLoaded", () => {
      lucide.createIcons();
      switchRole('mahasiswa');
      renderAll();
    });

    function renderAll() {
      localStorage.setItem('fti_lapor_v3', JSON.stringify(laporanList));
      renderMahasiswaTracking();
      renderAdminTable();
      renderTeknisiTasks();
      updateStats();
    }

    // SWITCH USER ROLE (MAHASISWA / ADMIN ATASAN / TEKNISI)
    function switchRole(role) {
      currentRole = role;
      const rMhs = document.getElementById('role-mhs');
      const rAdm = document.getElementById('role-admin');
      const rTek = document.getElementById('role-teknisi');

      const vMhs = document.getElementById('view-mahasiswa');
      const vAdm = document.getElementById('view-admin');
      const vTek = document.getElementById('view-teknisi');
      const banner = document.getElementById('role-banner');

      // Reset Styles
      rMhs.className = "px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 transition flex items-center gap-1.5 whitespace-nowrap";
      rAdm.className = "px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 transition flex items-center gap-1.5 whitespace-nowrap";
      rTek.className = "px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 transition flex items-center gap-1.5 whitespace-nowrap";

      vMhs.classList.add('hidden');
      vAdm.classList.add('hidden');
      vTek.classList.add('hidden');

      if (role === 'mahasiswa') {
        rMhs.className = "px-3 py-1.5 rounded-lg bg-white text-blue-600 shadow-sm font-semibold transition flex items-center gap-1.5 whitespace-nowrap";
        vMhs.classList.remove('hidden');
        banner.className = "mb-6 p-4 rounded-xl border flex items-center justify-between bg-blue-50 border-blue-200 text-blue-900 text-xs";
        banner.innerHTML = `
          <div class="flex items-center gap-2">
            <i data-lucide="info" class="w-4 h-4 text-blue-600"></i>
            <span><strong>Mode Mahasiswa:</strong> Kirim keluhan fasilitas kampus dan pantau proses serta catatan teknisi secara transparan.</span>
          </div>
        `;
      } else if (role === 'admin') {
        rAdm.className = "px-3 py-1.5 rounded-lg bg-white text-indigo-600 shadow-sm font-semibold transition flex items-center gap-1.5 whitespace-nowrap";
        vAdm.classList.remove('hidden');
        banner.className = "mb-6 p-4 rounded-xl border flex items-center justify-between bg-indigo-50 border-indigo-200 text-indigo-900 text-xs";
        banner.innerHTML = `
          <div class="flex items-center gap-2">
            <i data-lucide="shield-check" class="w-4 h-4 text-indigo-600"></i>
            <span><strong>Mode Admin / Kepala Sarpras:</strong> Mengelola penugasan teknisi. Status otomatis selesai setelah teknisi mengonfirmasi pengerjaan.</span>
          </div>
        `;
      } else if (role === 'teknisi') {
        rTek.className = "px-3 py-1.5 rounded-lg bg-white text-amber-600 shadow-sm font-semibold transition flex items-center gap-1.5 whitespace-nowrap";
        vTek.classList.remove('hidden');
        banner.className = "mb-6 p-4 rounded-xl border flex items-center justify-between bg-amber-50 border-amber-200 text-amber-900 text-xs";
        banner.innerHTML = `
          <div class="flex items-center gap-2">
            <i data-lucide="wrench" class="w-4 h-4 text-amber-600"></i>
            <span><strong>Mode Teknisi Lapangan:</strong> Update catatan lapangan dan ubah status menjadi Selesai jika perbaikan sudah tuntas.</span>
          </div>
        `;
      }
      lucide.createIcons();
    }

    // FORM FUNCTIONS
    function quickSelect(kat, lok) {
      document.getElementById('mhs-kategori').value = kat;
      document.getElementById('mhs-lokasi').value = lok;
    }

    function previewUploadFoto(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          tempFotoUrl = e.target.result;
          document.getElementById('mhs-preview-img').src = tempFotoUrl;
          document.getElementById('mhs-preview-box').classList.remove('hidden');
        };
        reader.readAsDataURL(file);
      }
    }

    function pakaiFotoSampel() {
      tempFotoUrl = "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&q=80";
      document.getElementById('mhs-preview-img').src = tempFotoUrl;
      document.getElementById('mhs-preview-box').classList.remove('hidden');
    }

    function submitLaporan(e) {
      e.preventDefault();
      const kat = document.getElementById('mhs-kategori').value;
      const lok = document.getElementById('mhs-lokasi').value;
      const desk = document.getElementById('mhs-deskripsi').value;
      const nama = document.getElementById('mhs-nama').value || "Mahasiswa";
      const kontak = document.getElementById('mhs-kontak').value || "-";

      const newLaporan = {
        id: "LPR-" + Math.floor(100 + Math.random() * 900),
        kategori: kat,
        lokasi: lok,
        deskripsi: desk,
        foto: tempFotoUrl || "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&q=80",
        nama,
        kontak,
        status: "Diterima",
        teknisi: "Belum Ditugaskan",
        catatanTeknisi: "Menunggu penugasan tim lapangan.",
        waktu: new Date().toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })
      };

      laporanList.unshift(newLaporan);
      renderAll();
      e.target.reset();
      tempFotoUrl = "";
      document.getElementById('mhs-preview-box').classList.add('hidden');
      alert("Laporan berhasil dikirim ke Admin Sarpras!");
    }

    // ACTIONS ADMIN / ATASAN
    function adminTugaskanTeknisi(id) {
      const item = laporanList.find(l => l.id === id);
      if (item) {
        const namaTeknisi = prompt("Masukkan nama teknisi / tim penanggung jawab:", item.teknisi !== "Belum Ditugaskan" ? item.teknisi : "Pak Joko (Teknisi Sarpras)");
        if (namaTeknisi) {
          item.teknisi = namaTeknisi;
          item.status = "Diproses";
          item.catatanTeknisi = `Ditugaskan kepada ${namaTeknisi}, sedang dalam penjadwalan pengecekan.`;
          renderAll();
        }
      }
    }

    // ACTIONS TEKNISI LAPANGAN
    function teknisiUpdateProgres(id) {
      const item = laporanList.find(l => l.id === id);
      if (item) {
        const cttn = prompt("Masukkan catatan hasil perbaikan di lapangan untuk pengguna:", item.catatanTeknisi);
        if (cttn !== null && cttn.trim() !== "") {
          item.catatanTeknisi = cttn;
          renderAll();
          alert("Catatan teknisi berhasil diperbarui dan langsung dikirim ke sistem pelapor!");
        }
      }
    }

    function teknisiSelesaikanTugas(id) {
      const item = laporanList.find(l => l.id === id);
      if (item) {
        const cttnAkhir = prompt("Berikan catatan akhir konfirmasi pengerjaan tuntas:", "Fasilitas telah diperbaiki dan diuji coba berfungsi normal.");
        if (cttnAkhir !== null) {
          item.catatanTeknisi = cttnAkhir;
          item.status = "Selesai";
          renderAll();
          alert("Konfirmasi selesai dikirim! Status laporan kini resmi Selesai.");
        }
      }
    }

    // RENDER FUNCTIONS
    function renderMahasiswaTracking() {
      const box = document.getElementById('cards-mhs-tracking');
      if (laporanList.length === 0) {
        box.innerHTML = `<div class="col-span-full py-8 text-center text-xs text-slate-400">Belum ada laporan keluhan fasilitas.</div>`;
        return;
      }

      box.innerHTML = laporanList.map(item => {
        let badgeStyle = "bg-slate-100 text-slate-700 border-slate-200";
        if (item.status === 'Diproses') badgeStyle = "bg-amber-50 text-amber-700 border-amber-200";
        if (item.status === 'Selesai') badgeStyle = "bg-emerald-50 text-emerald-700 border-emerald-200";

        return `
          <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div class="flex justify-between items-start mb-2">
                <span class="text-[10px] font-mono text-blue-600 font-bold">${item.id}</span>
                <span class="text-[10px] px-2 py-0.5 rounded border ${badgeStyle} font-semibold">${item.status}</span>
              </div>
              <img src="${item.foto}" class="w-full h-32 object-cover rounded-lg mb-2 border border-slate-100">
              <div class="text-xs font-bold text-slate-900">${item.kategori}</div>
              <div class="text-[11px] text-slate-600 font-medium mb-2">${item.lokasi}</div>
              <p class="text-xs text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-100 mb-3">${item.deskripsi}</p>
            </div>

            <div class="border-t pt-2 space-y-1.5 text-[11px]">
              <div class="text-slate-500"><strong>Teknisi Bertugas:</strong> ${item.teknisi}</div>
              <div class="text-slate-700 bg-amber-50/60 p-2 rounded border border-amber-200">
                <strong class="text-amber-900">Catatan & Progress Teknisi:</strong><br>${item.catatanTeknisi}
              </div>
            </div>
          </div>
        `;
      }).join('');
    }

    function renderAdminTable() {
      const tbody = document.getElementById('table-admin-body');
      if (laporanList.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="p-4 text-center text-slate-400">Tidak ada data.</td></tr>`;
        return;
      }

      tbody.innerHTML = laporanList.map(item => `
        <tr class="hover:bg-slate-50">
          <td class="p-3">
            <img src="${item.foto}" class="w-12 h-12 object-cover rounded-md border">
          </td>
          <td class="p-3 font-mono font-bold text-blue-600">${item.id}<br><span class="text-[10px] text-slate-400 font-normal">${item.waktu}</span></td>
          <td class="p-3"><strong class="text-slate-900">${item.kategori}</strong><br><span class="text-slate-500">${item.lokasi}</span></td>
          <td class="p-3 text-slate-700 font-medium">${item.teknisi}</td>
          <td class="p-3">
            <span class="px-2 py-0.5 rounded text-[10px] font-bold ${
              item.status === 'Selesai' ? 'bg-emerald-100 text-emerald-800' :
              item.status === 'Diproses' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-800'
            }">${item.status}</span>
          </td>
          <td class="p-3 text-right space-x-1 whitespace-nowrap">
            <button onclick="adminTugaskanTeknisi('${item.id}')" class="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded text-[10px] border border-amber-200">Ubah/Tugaskan Teknisi</button>
          </td>
        </tr>
      `).join('');
    }

    function renderTeknisiTasks() {
      const box = document.getElementById('cards-teknisi-tasks');
      box.innerHTML = laporanList.map(item => `
        <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
          <div class="flex justify-between items-start">
            <div>
              <span class="text-xs font-mono text-blue-600 font-bold">${item.id}</span>
              <h4 class="font-bold text-slate-900 text-sm mt-0.5">${item.kategori}</h4>
              <p class="text-xs text-slate-600">${item.lokasi}</p>
            </div>
            <span class="text-[10px] px-2 py-0.5 rounded bg-white border font-bold">${item.status}</span>
          </div>

          <p class="text-xs text-slate-700 bg-white p-2.5 rounded border"><strong>Keluhan:</strong> ${item.deskripsi}</p>
          
          <div class="text-xs space-y-1 bg-amber-50/50 p-2.5 rounded border border-amber-200">
            <div class="text-amber-900 font-semibold">Catatan Lapangan Anda:</div>
            <div class="text-slate-700 italic">${item.catatanTeknisi}</div>
          </div>

          <div class="flex gap-2 pt-1">
            <button onclick="teknisiUpdateProgres('${item.id}')" class="flex-1 py-2 bg-slate-700 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold">
              Update Catatan
            </button>
            <button onclick="teknisiSelesaikanTugas('${item.id}')" class="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold">
              Konfirmasi Selesai Tuntas
            </button>
          </div>
        </div>
      `).join('');
    }

    function updateStats() {
      document.getElementById('stat-masuk').innerText = laporanList.filter(l => l.status === 'Diterima').length;
      document.getElementById('stat-proses').innerText = laporanList.filter(l => l.status === 'Diproses').length;
      document.getElementById('stat-selesai').innerText = laporanList.filter(l => l.status === 'Selesai').length;
      document.getElementById('stat-total').innerText = laporanList.length;
    }

    function resetDemo() {
      if (confirm("Reset seluruh data ke kondisi awal?")) {
        localStorage.removeItem('fti_lapor_v3');
        laporanList = [...seedData];
        renderAll();
      }
    }
