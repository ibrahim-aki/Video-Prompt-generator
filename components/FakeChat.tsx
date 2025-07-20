
import React, { useState, useEffect, useRef } from 'react';

// Greatly expanded data for more realistic and varied messages
const fakeUsers = [
    // Indonesian Names & Aliases (150)
    "agus_santoso", "budi_wibowo", "citra_ayu", "diana_sari", "eko_prasetyo", "fitri_lestari", "guntur_hadi", "heru_purnomo", "indah_cahyani", "joko_susilo",
    "kartika_dewi", "lia_marina", "made_wirawan", "nina_rahayu", "oki_saputra", "putri_amelia", "qori_ahmad", "rizky_maulana", "sari_wijayanti", "tono_gunawan",
    "utami_ningrum", "viky_ramadhan", "wulan_permata", "xena_putri", "yudi_firmansyah", "zara_nabila", "andi_permana", "bunga_citra", "doni_kurniawan", "eka_wati",
    "farhan_azis", "gita_maharani", "hendra_jaya", "ira_kusuma", "joni_walker_id", "ketut_sudarma", "linda_susanti", "mahesa_jenar", "nia_ramadhani", "pandu_wiguna",
    "ratna_juwita", "sugeng_riyadi", "tiara_andini", "umar_bakri", "vina_panduwinata", "wahyu_hidayat", "yessy_gusman", "zulkifli_hasan", "abdi_negara", "bella_saphira",
    "candra_kirana", "dewi_persik", "elang_gumilang", "fajar_sidiq", "galih_ginanjar", "hari_mukti", "ida_ayu", "jati_kumoro", "krisna_murti", "luh_putu",
    "mang_oded", "neng_geulis", "onta_gurun", "pak_raden", "ratu_kidul", "sultan_agung", "teuku_umar", "udin_sedunia", "viva_swarowsky", "wiro_sableng",
    "yani_mardianto", "zainudin_mz", "adi_bing_slamet", "bambang_pamungkas", "chicha_koeswoyo", "deddy_mizwar", "eva_arnaz", "ferry_salim", "gogon_srimulat", "helmy_yahya",
    "iis_sugianto", "jaja_miharja", "koes_plus", "lydia_kandou", "mandra_sidoel", "nike_ardilla", "onky_alexander", "paramitha_rusady", "rhoma_irama", "susy_susanti",
    "tukul_arwana", "ucok_baba", "vera_vecante", "warkop_dki", "yuni_shara", "zaskia_gotik", "ahmad_albar", "benyamin_sueb", "chrisye_official", "david_naif",
    "ebiet_g_ade", "fariz_rm", "godbless_rocks", "harvey_malaiholo", "iwan_fals", "jamrud_band", "kaka_slank", "levi_synthesis", "marcell_siahaan", "naif_band",
    "once_mekel", "padi_reborn", "raisa_6690", "sheila_on_7", "tompi_lessy", "ungu_band", "virgoun_tm", "wali_band", "yovie_widianto", "zigaz_band",
    "render_warrior", "sutradara_gagal", "penulis_skenario_ai", "editor_kopi", "animator_lembur", "vfx_artist_jkt", "colorist_bandung", "sound_designer_sby", "komposer_jogja", "cinematographer_bali",
    "storyboarder_id", "produser_virtual", "lighting_expert_indo", "set_decorator_ai", "props_master_digital", "makeup_artist_virtual", "stuntman_cgi", "gaffer_digital", "grip_virtual", "dolly_operator_ai",
    // International & Creative Aliases (250)
    "jakantr45", "shadow_killer21", "cyber_nomad_88", "pro_gamer_ID", "sinta_aja_deh", "kopi_sore_77", "sky_explorer99", "alpha_dev_01", "bintang_jatuh", "raja_terakhir",
    "gadis_senja_02", "petualang_kode", "pixel_artist_92", "sutradara_malam", "cerita_visual", "kode_animasi", "dream_weaver_id", "galaxy_rider_7", "retro_synth_85", "flora_fauna_fan",
    "arkitek_maya", "penjelajah_waktu", "master_prompt", "ratu_visual", "neuron_aktif", "seniman_digital", "pemburu_artefak", "chronos_surfer", "cerita_digital", "ahli_visualfx",
    "editor_handal", "pencari_inspirasi", "dunia_fantasi_id", "motion_master", "gradien_warna", "narrator_ai", "sutradara_vr", "pixel_perfect", "render_wizard", "komposer_ai",
    "aether_drift", "void_walker", "silicon_sage", "quantum_quark", "nebula_navigator", "chroma_key_kid", "binary_bard", "glitch_ghost", "synthwave_samurai", "data_druid",
    "logic_lord", "byte_baron", "script_sorcerer", "pixel_prophet", "vector_voyager", "render_ronin", "shader_shaman", "kernel_king", "node_nomad", "api_apostle",
    "cloud_captain", "firewall_phantom", "hash_hermit", "lag_lord", "ping_paladin", "ram_reaper", "ssd_sorceress", "tcp_templar", "udp_urchin", "vram_viking",
    "alex_cgi", "beth_animates", "chris_renders", "dana_vfx", "ethan_edits", "fiona_films", "george_grades", "hannah_hues", "ian_imports", "jane_json",
    "kyle_keys", "laura_layers", "mike_meshes", "nina_nodes", "oscar_outputs", "penny_pixels", "quinn_queries", "ryan_rays", "sara_scripts", "tom_textures",
    "ursula_uv", "victor_vectors", "wendy_writes", "xavier_xml", "yara_yaml", "zack_z-depth", "user001", "test_account", "dev_user", "admin_ai",
    "master_of_none", "just_a_guy", "some_girl", "the_intern", "forgot_my_pass", "prompt_addict", "idea_generator", "visual_junkie", "story_lover", "world_builder_99",
    "captain_obvious", "sergeant_sarcasm", "major_malfunction", "private_joke", "colonel_kernel", "admiral_ai", "ensign_error", "commander_code", "lieutenant_lag", "general_glitch",
    "shadow_runner", "ghost_in_machine", "digital_drifter", "neon_ninja", "synth_surfer", "glitch_witch", "holo_hacker", "chrome_crusader", "data_dynamo", "pixel_pilgrim",
    "circuit_cleric", "arcane_architect", "code_conjurer", "dream_engineer", "ether_explorer", "flux_fisher", "grid_guardian", "hex_hunter", "icon_islander", "jpeg_juggler",
    "karma_coder", "laser_lancer", "meta_mage", "nano_navigator", "omega_operator", "plasma_pilgrim", "quantum_quester", "reality_ripper", "stream_strider", "techno_templar",
    "ultra_user", "virtual_voyager", "warp_weaver", "xeno_xplorer", "yotta_yielder", "zeta_zealot", "artist_42", "creator_101", "designer_3d", "editor_x",
    "filmmaker_pro", "generator_g", "hacker_man", "illustrator_ai", "journeyman_joe", "keyframer_k", "lightwave_lenny", "motion_mia", "node_nancy", "operator_otto",
    "prompt_patricia", "quest_quincy", "render_rex", "story_sue", "timeline_tim", "uv_unwrapper", "vfx_vera", "world_wally", "x-pert_xavier", "youtuber_yancy",
    "z-brush_zelda", "mr_anderson", "neo_one", "trinity_x", "morpheus_dreams", "agent_smith_ai", "the_oracle_gpt", "cypher_code", "switch_flip", "dozer_builds",
    "tank_operator", "seraph_guardian", "keymaker_keys", "the_architect_v2", "persephone_p", "merovingian_m", "the_twins_cgi", "niobe_navigates", "ghost_glitches", "sparky_sparks",
    "gizmo_gadget", "widget_wielder", "cogsworth_cogs", "sprocket_specs", "ratchet_rules", "clank_creates", "gadget_guru", "gizmo_goddess", "widget_wizard", "sprocket_scientist",
    "ratchet_racer", "clank_coder", "bolt_builder", "nut_navigator", "screw_scripter", "gear_grinder", "pulley_programmer", "lever_logic", "spring_specialist", "cam_creator",
    "piston_pioneer", "valve_virtuoso", "flywheel_fanatic", "crankshaft_crafter", "axle_artist", "bearing_baron", "chassis_champion", "engine_engineer", "transmission_titan", "differential_dynamo",
];

const fakeActions = [
    // Generation & Creation (100)
    "baru saja men-generate", "mendapatkan hasil menakjubkan untuk", "menciptakan visual untuk", "membuat render percobaan untuk",
    "menciptakan adegan baru:", "menghasilkan prompt untuk", "membuat variasi dari", "melakukan generate ulang pada",
    "menciptakan dunia untuk", "membangun konsep visual", "menghasilkan gambar kunci untuk", "membuat aset untuk",
    "men-generate tekstur untuk", "menghasilkan video loop untuk", "membuat animasi karakter untuk", "menciptakan latar belakang untuk",
    "membuat pratinjau untuk", "menghasilkan storyboard dari", "mengkonversi ide menjadi", "memvisualisasikan skrip untuk",
    "menciptakan montase untuk", "menghasilkan trailer konsep untuk", "membuat judul pembuka untuk", "men-generate efek partikel untuk",
    "menghasilkan lanskap untuk", "menciptakan arsitektur untuk", "membuat desain kendaraan untuk", "men-generate kostum untuk",
    "menghasilkan properti untuk", "menciptakan makhluk untuk", "membuat desain senjata untuk", "menghasilkan UI untuk",
    "men-generate data sintetis untuk", "membuat simulasi untuk", "menciptakan prototipe untuk", "menghasilkan materi iklan untuk",
    "membuat konten media sosial untuk", "menciptakan visualisasi data untuk", "men-generate infografis untuk", "membuat ilustrasi teknis untuk",
    "menghasilkan diagram untuk", "menciptakan peta untuk", "membuat denah untuk", "men-generate pola untuk",
    "membuat logo untuk", "menghasilkan ikon untuk", "menciptakan font untuk", "membuat watermark untuk",
    "menciptakan avatar untuk", "men-generate NFT untuk", "membuat aset game untuk", "menghasilkan level desain untuk",
    "menciptakan skybox untuk", "membuat material PBR untuk", "menghasilkan normal map untuk", "menciptakan displacement map untuk",
    "menghasilkan ambient occlusion untuk", "membuat lightmap untuk", "menciptakan cubemap untuk", "men-generate LUT untuk",
    "menghasilkan palet warna dari", "membuat gradien untuk", "menciptakan noise map untuk", "men-generate fractal untuk",
    "membuat sketsa konsep untuk", "menghasilkan line art untuk", "menciptakan siluet untuk", "membuat studi nilai untuk",
    "menciptakan studi warna untuk", "men-generate thumbnail untuk", "membuat mood board untuk", "menghasilkan referensi untuk",
    "menciptakan blueprint untuk", "membuat wireframe untuk", "menghasilkan mock-up untuk", "menciptakan styleframe untuk",
    "membuat animatic untuk", "men-generate previz untuk", "menciptakan postviz untuk", "menghasilkan techviz untuk",
    "membuat studi gerak untuk", "men-generate siklus berjalan untuk", "menciptakan ekspresi wajah untuk", "membuat pose karakter untuk",
    "menciptakan rig untuk", "men-generate skin weight untuk", "membuat blendshape untuk", "menghasilkan simulasi kain untuk",
    "menciptakan simulasi rambut untuk", "membuat simulasi bulu untuk", "men-generate simulasi cairan untuk", "menciptakan simulasi asap untuk",
    "membuat simulasi api untuk", "menghasilkan simulasi ledakan untuk", "menciptakan simulasi kerumunan untuk", "membuat simulasi lalu lintas untuk",
    "menghasilkan simulasi fisika untuk", "menciptakan vegetasi untuk", "membuat medan untuk", "men-generate awan untuk",
    
    // Experimentation & Refinement (200)
    "sedang bereksperimen dengan", "mencoba mode 'Kreatif' untuk", "menyempurnakan detail pada", "menambahkan efek pencahayaan pada",
    "melakukan fine-tuning pada", "memperbaiki komposisi untuk", "mengganti lensa virtual untuk", "mencari inspirasi dari",
    "menyesuaikan gerakan kamera untuk", "melakukan color grading pada", "menambahkan efek slow-motion untuk", "menambahkan soundscape pada",
    "menguji coba prompt", "mengganti gaya video menjadi", "meningkatkan realisme pada", "mengubah parameter untuk",
    "menyesuaikan kontras pada", "meningkatkan saturasi pada", "mengutak-atik prompt untuk", "mencoba kombinasi baru untuk",
    "melakukan iterasi pada desain", "memvalidasi konsep untuk", "mengeksplorasi opsi untuk", "membandingkan hasil dari",
    "mencari alternatif untuk", "menyederhanakan prompt", "menambahkan kompleksitas pada", "mengurangi noise pada",
    "meningkatkan resolusi pada", "mengoptimalkan kecepatan render untuk", "memperhalus animasi pada", "menyesuaikan timing pada",
    "mengkalibrasi warna untuk", "menyeimbangkan audio pada", "menambahkan subtitel pada", "mengoreksi distorsi lensa pada",
    "menghilangkan chromatic aberration pada", "menambahkan film grain pada", "menerapkan vignette pada", "menyesuaikan depth of field pada",
    "mengubah focal length pada", "menyesuaikan exposure pada", "menyeimbangkan white balance pada", "meningkatkan shadow detail pada",
    "memulihkan highlight pada", "mengatur ulang framing untuk", "mengubah angle kamera untuk", "menambahkan camera shake pada",
    "menstabilkan footage untuk", "melakukan motion tracking pada", "menerapkan rotoscoping pada", "melakukan keying pada",
    "membuat matte painting untuk", "melakukan set extension pada", "menambahkan elemen 3D pada", "mengintegrasikan CGI dengan",
    "melakukan compositing pada", "menambahkan lens flare pada", "menerapkan motion blur pada", "menyesuaikan aspect ratio untuk",
    "memotong adegan dari", "menggabungkan klip untuk", "membuat transisi untuk", "menyesuaikan ritme edit untuk",
    "melakukan sinkronisasi audio untuk", "membuat foley untuk", "melakukan mixing audio pada", "melakukan mastering audio pada",
    "menambahkan musik latar pada", "menyesuaikan volume dialog pada", "menambahkan efek suara pada", "menerapkan reverb pada",
    "menggunakan equalizer pada", "melakukan kompresi audio pada", "menghilangkan noise audio pada", "menerapkan audio ducking pada",
    "menambahkan narasi pada", "menerjemahkan dialog untuk", "membuat sulih suara untuk", "menambahkan audio deskripsi pada",

    // Management & Workflow (100)
    "menyimpan prompt favoritnya:", "memuat ulang riwayat untuk", "menghapus prompt lama tentang", "mengunci subjek pada",
    "beralih ke model VEO2 untuk", "mengekspor hasil", "membuat storyboard untuk", "memfinalisasi adegan",
    "mengarsipkan proyek", "membagikan hasil ke tim", "meminta masukan untuk", "membuat koleksi prompt",
    "memberi tag pada", "mencari di riwayat untuk", "mengurutkan hasil berdasarkan", "memfilter prompt dengan kata kunci",
    "membuat cadangan dari", "mengimpor prompt dari file", "mengekspor riwayat ke CSV", "membersihkan cache untuk",
    "mereset formulir untuk", "membatalkan generate pada", "mengantrekan pekerjaan untuk", "menjadwalkan render untuk",
    "memantau progres dari", "menganalisis statistik penggunaan", "meningkatkan batas generate", "mengundang kolaborator untuk",
    "menetapkan peran pada", "membuat folder proyek untuk", "memindahkan aset ke", "mengganti nama file untuk",
    "menambahkan catatan pada", "membuat to-do list untuk", "menetapkan deadline untuk", "melaporkan bug pada",
    "memberikan saran fitur untuk", "mengikuti panduan untuk", "mengubah tema UI menjadi", "mengganti bahasa ke",
    "melakukan logout dari sesi", "memperbarui kredensial untuk", "mengecek status sistem", "membaca changelog untuk",
    "menghubungi admin untuk", "berlangganan paket premium", "membatalkan langganan", "mengunduh hasil akhir",
    "mengunggah aset ke cloud", "melakukan sinkronisasi dengan", "menghubungkan ke API", "membuat preset untuk",
    "menyimpan template proyek", "menduplikasi adegan", "memisahkan adegan menjadi", "menggabungkan proyek",
    "melakukan versioning pada", "kembali ke versi sebelumnya dari", "membandingkan versi A/B dari", "menyetujui hasil dari",
    "menolak revisi untuk", "memberikan anotasi pada", "membuat presentasi untuk", "menyiapkan materi untuk rapat",
    "mendokumentasikan proses untuk", "membuat tutorial untuk", "berbagi pengetahuan tentang", "mengoptimalkan alur kerja untuk",
    "mengotomatiskan tugas pada", "menulis skrip untuk", "men-debug masalah pada", "menerapkan hotfix untuk",
    "melakukan rollback pada", "men-deploy versi baru dari", "melakukan stress test pada", "membuat benchmark untuk",
    "menganalisis log kesalahan", "melacak dependensi untuk", "mengelola lisensi untuk", "memperbarui plugin untuk",
    "menginstal ekstensi untuk", "mengkonfigurasi lingkungan untuk", "membersihkan ruang kerja", "mengosongkan tempat sampah",
    "memverifikasi integritas data", "melakukan migrasi data ke", "mengenkripsi aset sensitif", "mengatur izin akses untuk",
    "melakukan audit keamanan pada", "membuat laporan kepatuhan", "mengekstrak data dari", "memuat data ke",

];

const fakeTopics = [
    // Indonesian Context (150)
    "'drone melintasi Monas saat matahari terbenam'", "'kemacetan lalu lintas di sekitar Patung Pancoran, gaya sinematik'", "'pedagang sate di pinggir jalan Jakarta pada malam hari'", "'seorang penari Bali di depan Pura Besakih'",
    "'tim e-sport berlatih di sebuah warnet di Jakarta'", "'komodo di habitat aslinya di Pulau Komodo'", "'sunrise di Gunung Bromo dengan lautan pasirnya'", "'penyelam menjelajahi terumbu karang Raja Ampat'",
    "'suasana ramai pasar terapung di Kalimantan'", "'anak-anak bermain layangan di sawah terasering Ubud'", "'keramaian Stasiun Dukuh Atas BNI saat jam pulang kerja'", "'perahu nelayan tradisional kembali ke pantai Anyer'",
    "'seorang pembuat batik tulis di Yogyakarta'", "'suasana mistis Candi Borobudur di pagi berkabut'", "'balapan perahu naga di Danau Toba'", "'upacara adat Rambu Solo di Tana Toraja'",
    "'lomba panjat pinang saat 17 Agustus-an'", "'pedagang kopi klotok di lereng gunung'", "'suasana sholat Ied di Masjid Istiqlal'", "'orangutan berayun di hutan Kalimantan'",
    "'pengendara Go-Jek menunggu penumpang di bawah pohon'", "'warung kopi pinggir jalan yang ramai di malam hari'", "'suasana tawar-menawar di Pasar Tanah Abang'", "'kereta Commuter Line penuh sesak di jam sibuk'",
    "'anak-anak punk di perempatan lampu merah'", "'keluarga makan bersama di restoran Padang Sederhana'", "'seorang dalang memainkan wayang kulit di belakang layar'", "'latihan gamelan di sebuah pendopo kraton'",
    "'suasana khidmat upacara bendera di sekolah'", "'legenda Roro Jonggrang di Candi Prambanan'", "'legenda Malin Kundang menjadi batu'", "'mitos Nyi Roro Kidul di pantai selatan Jawa'",
    "'seorang dukun membakar kemenyan'", "'hantu kuntilanak tertawa di atas pohon'", "'pocong melompat-lompat di kebun pisang'", "'ritual pesugihan di gunung Kawi'",
    "'penjual kerak telor di Pekan Raya Jakarta'", "'pertunjukan Reog Ponorogo di alun-alun kota'", "'pembuatan dodol Garut secara tradisional'", "'petani memanen cengkeh di Maluku'",
    "'suasana perkebunan teh di Puncak, Bogor'", "'kerbau membajak sawah di pedesaan Jawa Barat'", "'para penambang belerang di kawah Ijen'", "'keindahan bawah laut Wakatobi'",
    "'rumah-rumah panggung di perkampungan nelayan Belitung'", "'lumba-lumba melompat di perairan Lovina, Bali'", "'keindahan danau tiga warna Kelimutu saat fajar'", "'tradisi lompat batu di Nias'",
    "'rumah gadang yang megah di Sumatera Barat'", "'lomba karapan sapi di Madura'", "'perayaan Waisak di Candi Mendut'", "'prosesi pemakaman Ngaben di Bali'",
    "'penjual jamu gendong menawarkan dagangannya'", "'anak-anak bermain kelereng di gang sempit'", "'suasana nobar pertandingan timnas di kafe'", "'pedagang kaki lima mendorong gerobak bakso'",
    "'seorang ibu memasak rendang di dapur'", "'pengemis di jembatan penyeberangan'", "'aksi mahasiswa berdemonstrasi di depan gedung DPR'", "'satpam komplek memukul tiang listrik saat ronda'",
    "'suasana Car Free Day di Bundaran HI'", "'antrean panjang di gerai Mixue'", "'ojek pangkalan menunggu penumpang'", "'seorang seniman jalanan melukis di trotoar Braga'",
    "'pelabuhan Sunda Kelapa dengan kapal-kapal Phinisi'", "'kawasan Kota Tua Jakarta di sore hari'", "'pembuatan kapal Phinisi di Bulukumba'", "'kehidupan suku Baduy Dalam'",
    "'kehidupan suku Dayak di pedalaman Kalimantan'", "'kehidupan suku Asmat di Papua'", "'keindahan alam Lembah Harau'", "'pesona Kepulauan Seribu dari udara'",
    "'seorang polisi mengatur lalu lintas yang semrawut'", "'Tugu Pahlawan Surabaya yang gagah'", "'Jembatan Ampera di malam hari dengan lampu warna-warni'", "'masjid raya Baiturrahman di Aceh setelah tsunami'",
    "'penjual getuk lindri dengan musik khasnya'", "'suasana mudik lebaran di stasiun kereta api'", "'warung tegal (warteg) yang sederhana namun ramai'", "'seorang tukang sol sepatu di bawah pohon'",
    "'ibu-ibu arisan sosialita di mal mewah'", "'para skater berlatih di taman kota'", "'komunitas sepeda berkumpul di akhir pekan'", "'pertandingan tarkam (antar kampung) sepak bola'",
    "'suasana pengajian di masjid komplek'", "'gereja Katedral Jakarta saat misa Natal'", "'perayaan Cap Go Meh di pecinan'", "'pura di tengah danau Bedugul, Bali'",
    "'seorang Sinterklas membagikan hadiah di panti asuhan'", "'biksu berjalan menerima persembahan makanan'", "'pemuka agama Hindu memimpin upacara'", "'pemuka agama Konghucu di kelenteng'",
    "'perkebunan kelapa sawit yang luas di Sumatera'", "'tambang batubara di Kalimantan'", "'tambang emas Freeport di Papua'", "'pertanian garam di Madura'",
    "'industri tekstil di Majalaya'", "'pabrik sepatu di Tangerang'", "'pusat kerajinan perak di Celuk, Bali'", "'pusat kerajinan kayu di Jepara'",
    "'seorang vlogger kuliner mereview seblak pedas'", "'mukbang mi instan dengan banyak cabai'", "'tutorial memasak nasi goreng viral'", "'resep es teh manis jumbo ala warung'",
    "'seorang cosplayer di acara Jejepangan'", "'penonton konser K-Pop yang antusias'", "'penggemar JKT48 menari saat pertunjukan'", "'komunitas penggemar anime membahas episode terbaru'",
    "'peternak lele di pekarangan rumah'", "'petani hidroponik di perkotaan'", "'budidaya jamur tiram di gudang'", "'peternakan ayam petelur modern'",
    "'suasana horor di rumah sakit angker'", "'penampakan di terowongan Casablanca'", "'misteri Lawang Sewu di Semarang'", "'cerita angker Gunung Salak'",
    "'influencer mempromosikan produk skincare'", "'selebgram melakukan 'spill' gosip'", "'YouTuber gaming bermain Mobile Legends'", "'TikToker membuat konten dance challenge'",

    // Sci-Fi & Cyberpunk (100)
    "'seekor naga kristal di atas kota neon'", "'robot samurai bertarung di bawah hujan bunga sakura'", "'astronot menemukan taman rahasia di Mars'", "'pasar malam yang ramai di dunia cyberpunk'",
    "'kapal bajak laut terbang di antara pulau-pulau langit'", "'kota bawah tanah yang ditenagai oleh kristal raksasa'", "'balapan mobil terbang di antara gedung pencakar langit'", "'konser musik holografik di masa depan'",
    "'seseorang memancing bintang dari danau kosmik'", "'kota Venesia dengan kanal yang terbuat dari lava'", "'tarian robot balerina di panggung opera'", "'sebuah jam saku yang bisa memutar kembali waktu'",
    "'sebuah band jazz tampil di bar speakeasy di bulan'", "'pohon dunia raksasa yang cabangnya menyentuh bintang'", "'data stream yang mengalir di kota digital'", "'hacker meretas mainframe di bawah tanah'",
    "'droid pengantar barang di jalanan Neo-Kyoto'", "'manusia dengan augmentasi cybernetic minum di bar'", "'sebuah perpustakaan berisi seluruh pengetahuan alam semesta'", "'AI yang menjadi sadar di dalam sebuah superkomputer'",
    "'perang antara manusia dan robot di reruntuhan kota'", "'seorang detektif memburu replikan di kota hujan'", "'koloni penambang di asteroid'", "'terraforming sebuah planet yang tandus'",
    "'sebuah kapal generasi melakukan perjalanan antar bintang'", "'perjumpaan pertama dengan ras alien'", "'sebuah singularitas teknologi tercipta'", "'manusia mengunggah kesadarannya ke dunia maya'",
    "'seorang arkeolog menemukan artefak alien kuno'", "'polisi waktu mencegah perubahan sejarah'", "'sebuah kota yang dibangun di punggung makhluk raksasa'", "'kurir mengantar paket antar dimensi'",
    "'seorang pemburu bayaran dengan kapal luar angkasa rongsokan'", "'akademi penyihir di stasiun luar angkasa'", "'pemberontakan di sebuah distopia futuristik'", "'seorang biarawan cybernetic bermeditasi'",
    "'pasar gelap untuk implan ilegal'", "'seorang jurnalis mengungkap konspirasi mega-korporasi'", "'taman hiburan virtual reality yang berbahaya'", "'sebuah planet penjara yang brutal'",
    "'perlombaan untuk mencapai pusat galaksi'", "'sebuah virus digital mengancam seluruh jaringan'", "'seorang seniman menciptakan patung dari cahaya padat'", "'pertanian vertikal di gedung pencakar langit'",
    "'sebuah robot menemukan kembali alam liar'", "'manusia terakhir di Bumi'", "'sebuah kapal penelitian menjelajahi lubang hitam'", "'kloning yang mempertanyakan identitasnya'",
    "'seorang diplomat bernegosiasi dengan federasi galaksi'", "'spesies alien yang berkomunikasi melalui warna'", "'sebuah kota yang terus berubah bentuk'", "'robot yang memimpikan domba listrik'",
    "'kereta Maglev melintasi benua dalam hitungan menit'", "'sebuah senjata yang bisa menghapus sesuatu dari keberadaan'", "'seorang anak berteman dengan robot peliharaan'", "'peradaban yang hidup di dalam bintang'",
    "'seorang penjelajah menemukan ujung alam semesta'", "'pertarungan mecha raksasa di pusat kota'", "'seorang telepat membaca pikiran penjahat'", "'sebuah kultus yang menyembah AI'",
    "'manusia beradaptasi hidup di planet dengan gravitasi tinggi'", "'sebuah memorial untuk perang antar bintang'", "'seorang penyelundup membawa barang langka'", "'barista menyajikan kopi sintetik'",
    "'seorang tukang kebun merawat tanaman alien'", "'fashion show dengan pakaian yang bisa berubah bentuk'", "'seorang musisi memainkan alat musik dari masa depan'", "'balet anti-gravitasi'",
    "'sebuah planet yang seluruhnya tertutup lautan'", "'seorang sejarawan mempelajari peradaban yang telah punah'", "'seorang mekanik memperbaiki kapal luar angkasa'", "'pembangkit listrik tenaga fusi'",
    "'sebuah planet cincin buatan manusia'", "'seorang bio-engineer menciptakan spesies baru'", "'perburuan harta karun di reruntuhan alien'", "'seorang psiko-historian memprediksi masa depan'",
    "'sebuah negosiasi damai yang tegang di stasiun netral'", "'seorang pilot dogfight di sabuk asteroid'", "'seorang insinyur membangun jembatan antar bintang'", "'seorang seniman jalanan membuat grafiti digital'",

    // Fantasy & Mythical (100)
    "'perpustakaan kuno yang melayang di angkasa'", "'hutan ajaib dengan jamur yang menyala'", "'kereta uap melintasi jembatan di atas awan'", "'makhluk bawah laut raksasa tidur di palung samudera'",
    "'upacara teh di sebuah kuil di puncak gunung'", "'seorang alkemis di laboratoriumnya yang berantakan'", "'manusia pohon kuno memberikan kebijaksanaan'", "'penjelajah menemukan air terjun pelangi'",
    "'gurun pasir di malam hari dengan dua bulan purnama'", "'sebuah istana yang terbuat dari kaca dan cahaya'", "'pasar rempah-rempah eksotis di dunia fantasi'", "'prajurit viking berdiri di tepi tebing'",
    "'hewan-hewan hutan mengadakan pertemuan rahasia'", "'kesatria melawan monster bayangan di kastil terlantar'", "'penyelam menemukan kota Atlantis yang hilang'", "'seorang penyihir meramu ramuan di gubuk hutan'",
    "'pertempuran epik antara dewa dan titan'", "'griffin terbang di atas pegunungan berkabut'", "'kurcaci menempa pedang di jantung gunung'", "'elf memanah di hutan kuno'",
    "'seorang elementalist mengendalikan badai'", "'sebuah kota yang dibangun di dalam pohon raksasa'", "'para goblin menambang di gua yang berkelok-kelok'", "'seorang necromancer membangkitkan pasukan kerangka'",
    "'seorang paladin bersumpah di bawah cahaya suci'", "'seorang rogue menyelinap di atap kota'", "'seorang bard menyanyikan lagu kepahlawanan di kedai'", "'seorang druid berubah menjadi beruang'",
    "'sebuah portal ke dimensi lain terbuka'", "'pedagang keliling menjual artefak magis'", "'sebuah naga menjaga tumpukan harta karun'", "'sebuah universitas sihir yang tersembunyi'",
    "'para raksasa berjalan melintasi lembah'", "'seorang centaur berpatroli di perbatasan hutan'", "'para duyung bernyanyi di atas bebatuan'", "'seorang harpy bersarang di puncak tebing'",
    "'seorang minotaur menjaga labirin'", "'seekor hydra menyerang sebuah desa'", "'seekor phoenix terlahir kembali dari abunya'", "'seekor unicorn minum dari mata air suci'",
    "'seorang raja mengumpulkan para ksatrianya'", "'seorang ratu membuat keputusan yang sulit'", "'seorang pangeran menyamar di antara rakyatnya'", "'seorang putri melarikan diri dari menara'",
    "'seorang penasihat licik merencanakan pengkhianatan'", "'seorang jenderal memimpin pasukannya ke pertempuran'", "'seorang mata-mata mencuri rencana rahasia'", "'seorang pembunuh bayaran menerima kontrak'",
    "'sebuah ramalan kuno mulai terwujud'", "'sebuah kutukan menimpa keluarga bangsawan'", "'sebuah artefak kuat ditemukan'", "'sebuah perjanjian dengan iblis dibuat'",
    "'seorang pahlawan memulai perjalanannya'", "'seorang mentor melatih muridnya'", "'sekelompok petualang bertemu di sebuah kedai'", "'musuh bebuyutan saling berhadapan'",
    "'sebuah pertempuran pengepungan kastil'", "'sebuah duel sihir yang spektakuler'", "'sebuah negosiasi dengan raja naga'", "'sebuah perjalanan melalui tanah terkutuk'",
    "'penemuan sebuah peta harta karun kuno'", "'memecahkan teka-teki di kuil yang terlupakan'", "'selamat dari jebakan di ruang bawah tanah'", "'bernegosiasi dengan jin di dalam lampu'",
    "'seorang biarawan bermeditasi untuk mencapai pencerahan'", "'seorang samurai melindungi seorang petani'", "'seorang ninja menyusup ke benteng musuh'", "'seorang kaisar memimpin dari tahta naganya'",
    "'dewa Anubis menimbang hati di akhirat'", "'dewa Thor memanggil petir dengan Mjolnir'", "'dewa Zeus melemparkan petir dari Olympus'", "'dewa Poseidon mengendalikan lautan'",
    "'dewa Ra berlayar melintasi langit dengan perahu mataharinya'", "'dewa Ganesha menghilangkan rintangan'", "'dewi Kali menari tarian kehancuran'", "'dewi Athena memimpin pertempuran dengan kebijaksanaan'",

    // Cinematic Everyday & Abstract (50)
    "'detektif noir memecahkan kasus di kota yang selalu hujan'", "'robot kecil merawat taman di atap gedung'", "'kafe yang nyaman saat badai salju di luar'", "'anak-anak bermain di antara reruntuhan peradaban kuno'",
    "'perayaan festival lampion di desa terapung'", "'karavan melintasi padang pasir sutra'", "'close-up tetesan hujan di jendela'", "'kupu-kupu hinggap di bunga dengan gerakan lambat'",
    "'bayangan panjang saat matahari terbit di kota kosong'", "'secangkir kopi dengan uap yang menari'", "'jam tua berdetak di ruangan sepi'", "'pasangan tua berdansa di bawah lampu jalan'",
    "'seorang anak melepaskan balon merah ke langit'", "'kucing jalanan menatap lampu neon kota'", "'daun-daun berguguran di musim gugur'", "'pantulan kota di genangan air'",
    "'seorang pembuat jam tangan bekerja dengan presisi'", "'seorang pelukis menyelesaikan mahakaryanya'", "'seorang penulis mengetik di mesin tik tua'", "'seorang musisi jalanan bermain biola dengan penuh perasaan'",
    "'seorang koki menyiapkan hidangan dengan cermat'", "'seorang penari berlatih di studio yang kosong'", "'seorang fotografer menangkap momen yang sempurna'", "'seorang pematung membentuk tanah liat'",
    "'buku-buku di perpustakaan yang sunyi'", "'gelembung sabun beterbangan di taman'", "'jejak kaki di pasir pantai yang akan terhapus ombak'", "'ayunan kosong bergerak tertiup angin'",
    "'lilin meleleh perlahan di ruangan gelap'", "'seorang nelayan melemparkan jala saat fajar'", "'seorang pendaki gunung mencapai puncak'", "'seorang astronot melayang di angkasa'",
    "'seorang anak belajar mengendarai sepeda'", "'surat cinta lama yang menguning'", "'seorang tentara pulang ke rumah'", "'perayaan kelulusan yang meriah'",
    "'seorang pemadam kebakaran menyelamatkan seekor anak kucing'", "'seorang dokter memberikan kabar baik'", "'seorang guru mengajar dengan sabar'", "'seorang petani bersyukur atas panennya'",
];

const fakeStyles = [
    // Cinematic & Film (50)
    "'Sinematik'", "'Film vintage'", "'Noir'", "'Found footage'", "'Gaya Wes Anderson'", "'Gaya Tarantino'",
    "'Gaya Ghibli'", "'Dogme 95'", "'Cinema Verite'", "'Film Bisu'", "'Technicolor'",
    "'German Expressionism'", "'Soviet Montage'", "'Italian Neorealism'", "'French New Wave'", "'New Hollywood'",
    "'Hong Kong Action Cinema'", "'Bollywood Masala'", "'J-Horror'", "'Spaghetti Western'", "'Film epik sejarah'",
    "'Film musikal'", "'Film biografi'", "'Film thriller psikologis'", "'Film fiksi ilmiah Hard Sci-fi'", "'Film fantasi High Fantasy'",
    "'Film komedi romantis'", "'Film slasher'", "'Film monster (Kaiju)'", "'Film superhero'", "'Film dokumenter alam'",
    "'Gaya David Lynch'", "'Gaya Stanley Kubrick'", "'Gaya Andrei Tarkovsky'", "'Gaya Akira Kurosawa'", "'Gaya Terrence Malick'",
    "'Gaya Wong Kar-wai'", "'Tampilan film Blade Runner'", "'Tampilan film The Matrix'", "'Tampilan film Amelie'", "'Tampilan film Mad Max: Fury Road'",
    "'Lensa anamorphic'", "'Lensa wide-angle'", "'Lensa telephoto'", "'Lensa makro'", "'Lensa tilt-shift'",
    "'Tampilan 8mm'", "'Tampilan 16mm'", "'Tampilan 35mm'", "'Tampilan 70mm IMAX'",

    // Art & Animation (100)
    "'Gaya anime'", "'Stop-motion'", "'Lukisan cat air'", "'8-bit pixel art'", "'Art Deco'", "'Art Nouveau'",
    "'Surealisme'", "'Impresionisme'", "'Ekspresionisme'", "'Kubisme'", "'Pop Art'",
    "'Minimalisme'", "'Brutalisme'", "'Futurisme'", "'Dadaisme'", "'Barok'",
    "'Rococo'", "'Renaissance'", "'Gotik'", "'Klasikisme'", "'Romantisisme'",
    "'Realisme'", "'Abstrak'", "'Seni konseptual'", "'Seni jalanan (Street Art)'", "'Grafiti'",
    "'Gaya Makoto Shinkai'", "'Gaya Satoshi Kon'", "'Gaya Masaaki Yuasa'", "'Gaya Disney klasik'", "'Gaya Pixar'",
    "'Gaya Laika (stop-motion)'", "'Gaya Aardman (claymation)'", "'Rotoscoping'", "'Animasi 2D tradisional'", "'Animasi 3D fotorealistik'",
    "'Animasi vektor (flat design)'", "'Motion graphics'", "'Gaya infografis'", "'Cel shading'", "'Seni ASCII'",
    "'Seni vaporwave'", "'Estetika Lo-fi'", "'Gaya grunge'", "'Gaya psychedelic'", "'Gaya steampunk'",
    "'Gaya cyberpunk'", "'Gaya dieselpunk'", "'Gaya biopunk'", "'Gaya solarpunk'", "'Gaya atompunk'",
    "'Lukisan cat minyak'", "'Lukisan akrilik'", "'Gambar pensil arang'", "'Gambar tinta'", "'Kolase'",
    "'Seni pahat'", "'Seni instalasi'", "'Seni pertunjukan'", "'Seni kaca patri'", "'Mosaik'",
    "'Batik'", "'Ukiran kayu Jepara'", "'Wayang kulit'", "'Seni kaligrafi'", "'Seni tato tradisional'",
    "'Desain Swiss (International Typographic Style)'", "'Desain Bauhaus'", "'Desain Memphis'", "'Desain material (Material Design)'", "'Desain skeumorphism'",
    "'Gaya komik Amerika'", "'Gaya manga Jepang'", "'Gaya Franco-Belgian (bande dessinée)'", "'Gaya underground comix'", "'Gaya novel grafis'",
    "'Seni generatif'", "'Seni fraktal'", "'Seni glitch'", "'Seni interaktif'", "'Seni virtual reality (VR)'",
    "'Seni augmented reality (AR)'", "'Proyeksi mapping'", "'Seni kinetik'", "'Seni cahaya'", "'Seni suara'",
    "'Gaya aquarel'", "'Gaya guas'", "'Gaya pastel'", "'Gaya spidol'", "'Gaya airbrush'",
    "'Gaya low-poly'", "'Gaya voxel'", "'Gaya isometrik'", "'Gaya ortografis'", "'Gaya kartun tahun 1930-an (rubber hose)'",

    // Photography & Technical (100)
    "'Hyperrealistic'", "'Fotografi hitam putih'", "'Fotografi sepia'", "'Fotografi inframerah'", "'Fotografi long exposure'",
    "'Fotografi time-lapse'", "'Fotografi high-speed'", "'Fotografi makro'", "'Fotografi potret'", "'Fotografi lanskap'",
    "'Fotografi arsitektur'", "'Fotografi jalanan'", "'Fotografi dokumenter'", "'Fotografi fashion'", "'Fotografi produk'",
    "'Fotografi makanan'", "'Fotografi olahraga'", "'Fotografi bawah air'", "'Fotografi udara'", "'Astrophotography'",
    "'High-key lighting'", "'Low-key lighting'", "'Rembrandt lighting'", "'Split lighting'", "'Butterfly lighting'",
    "'Loop lighting'", "'Rim lighting (backlight)'", "'Cahaya alami'", "'Golden hour'", "'Blue hour'",
    "'Cahaya neon'", "'Cahaya lilin'", "'Cahaya api unggun'", "'Cahaya dramatis'", "'Cahaya lembut'",
    "'Depth of field dangkal (bokeh)'", "'Depth of field dalam'", "'Fokus tajam (tack sharp)'", "'Fokus lembut (soft focus)'", "'Motion blur'",
    "'Lensa flare'", "'Film grain'", "'Digital noise'", "'Vignette'", "'Chromatic aberration'",
    "'Distorsi lensa (fisheye)'", "'Efek suar'", "'Light leaks'", "'Kontras tinggi'", "'Kontras rendah'",
    "'Saturasi tinggi'", "'Desaturasi'", "'Warna-warni (vibrant)'", "'Warna monokromatik'", "'Warna analogus'",
    "'Warna komplementer'", "'Warna triadik'", "'Palet warna hangat'", "'Palet warna dingin'", "'Palet warna pastel'",
    "'Palet warna bumi (earth tones)'", "'Palet warna neon'", "'HDR (High Dynamic Range)'", "'Grading warna Teal and Orange'", "'Grading warna Bleach Bypass'",
    "'Cross-processing'", "'Tampilan sinematik'", "'Tampilan komersial'", "'Tampilan bersih (clean look)'", "'Tampilan kotor (gritty look)'",
    "'Komposisi Rule of Thirds'", "'Komposisi Golden Ratio'", "'Komposisi simetris'", "'Komposisi asimetris'", "'Leading lines'",
    "'Framing (pembingkaian)'", "'Pola dan pengulangan'", "'Sudut pandang mata burung'", "'Sudut pandang mata cacing'", "'Sudut pandang orang pertama (POV)'",
    "'Dutch angle'", "'Close-up ekstrim'", "'Wide shot ekstrim'", "'Medium shot'", "'Full shot'",
    "'CGI Fotorealistik'", "'Matte painting'", "'Set extension digital'", "'3D scan'", "'Photogrammetry'",
    "'Infografis 3D'", "'Visualisasi arsitektur'", "'Render produk'", "'Simulasi medis'", "'Visualisasi data ilmiah'",

    // Miscellaneous & Abstract (50)
    "'Gaya psikedelik'", "'Tampilan mimpi'", "'Tampilan sureal'", "'Tampilan abstrak'", "'Tampilan kacau'",
    "'Tampilan bersih dan modern'", "'Tampilan retro 80-an'", "'Tampilan futuristik'", "'Tampilan distopia'", "'Tampilan utopia'",
    "'Tampilan dongeng'", "'Tampilan horor'", "'Tampilan komedi'", "'Tampilan romantis'", "'Tampilan epik'",
    "'Tampilan nostalgia'", "'Tampilan tegang'", "'Tampilan misterius'", "'Tampilan tenang'", "'Tampilan ceria'",
    "'Presentasi korporat'", "'Video penjelasan (explainer video)'", "'Video pelatihan'", "'Iklan TV'", "'Video musik'",
    "'Layar pemuatan game'", "'Cutscene game'", "'Trailer game'", "'Gameplay footage'", "'eSports broadcast'",
    "'Video pernikahan'", "'Video ulang tahun'", "'Video liburan'", "'Vlog perjalanan'", "'Video unboxing'",
    "'Video reaksi'", "'Video tutorial'", "'Video ASMR'", "'Video 'satisfying''", "'Video meme'",
    "'Tampilan kamera keamanan (CCTV)'", "'Tampilan kamera dasbor (dashcam)'", "'Tampilan layar ponsel'", "'Tampilan panggilan video'", "'Tampilan thermal imaging'",
    "'Tampilan X-ray'", "'Tampilan sonar'", "'Tampilan radar'", "'Tampilan antarmuka holografik'", "'Tampilan mikroskopik'",
];

const fakeElements = [
    // Camera & Lens (80)
    "dengan 'lensa anamorphic' untuk kesan luas", "menggunakan 'lensa makro 100mm'", "ditembak dengan 'lensa wide-angle'", "menggunakan 'lensa telephoto 300mm'",
    "dengan 'lensa tilt-shift' untuk efek miniatur", "menggunakan 'lensa fisheye' untuk distorsi", "dengan 'lensa prime 50mm f/1.8'", "menggunakan 'lensa zoom 24-70mm'",
    "difilmkan dengan 'kamera ARRI Alexa'", "direkam dengan 'kamera RED Komodo'", "menggunakan 'kamera Sony a7S III'", "ditembak dengan 'kamera Blackmagic Pocket 6K'",
    "menggunakan 'drone DJI Mavic 3 Pro'", "dengan 'GoPro di sudut pandang orang pertama'", "dari 'kamera keamanan resolusi rendah'", "seperti dari 'kamera film 16mm Bolex'",
    "dengan 'gerakan kamera dolly zoom'", "menampilkan 'pergerakan kamera tracking shot'", "dengan 'subtle camera shake' yang realistis", "menggunakan 'gerakan crane shot' yang megah",
    "dengan 'teknik handheld' yang intim", "melakukan 'whip pan' yang cepat", "dengan 'slow push-in' untuk membangun tensi", "menggunakan 'static shot' yang meditatif",
    "dengan 'sudut pandang high-angle'", "dari 'sudut pandang low-angle' yang kuat", "dengan 'dutch angle' untuk disorientasi", "menggunakan 'komposisi rule of thirds'",
    "dengan 'leading lines' yang kuat", "menggunakan 'framing' alami", "menonjolkan 'simetri' dalam komposisi", "dengan 'depth of field' yang sangat dangkal",
    "dengan 'bokeh' yang indah di latar belakang", "semua elemen dalam 'fokus tajam (deep focus)'", "dengan 'focal length' yang berubah", "dengan 'rak focus' dari subjek A ke B",
    "menggunakan 'shutter speed lambat' untuk motion blur", "menggunakan 'shutter speed cepat' untuk membekukan aksi", "dengan 'aperture terbuka lebar'", "dengan 'aperture tertutup' untuk detail",
    "difilmkan saat 'golden hour'", "direkam saat 'blue hour'", "menggunakan 'lensa flare' yang artistik", "dengan 'vignette' tipis di sudut",
    "menambahkan 'chromatic aberration' untuk tampilan vintage", "dengan 'efek light leak' yang disengaja", "difilmkan melalui 'kaca yang basah oleh hujan'", "dengan 'pantulan di genangan air'",
    "menampilkan 'siluet' terhadap cahaya", "menggunakan 'overexposure' sebagai efek stilistik", "dengan 'underexposure' untuk suasana gelap", "ditembak dalam 'mode makro'",
    "dengan 'zoom digital' yang pixelated", "menggunakan 'stabilisasi gimbal' yang mulus", "tanpa 'stabilisasi' untuk getaran mentah", "difilmkan dalam 'mode time-lapse'",
    "direkam dalam 'slow motion 120fps'", "dengan 'efek reverse (mundur)'", "menggunakan 'split screen'", "dengan 'teknik match cut'",
    "menampilkan 'long take' tanpa potongan", "dengan 'jump cut' yang disengaja", "menggunakan 'L-cut' atau 'J-cut' pada audio", "difilmkan 'melalui cermin'",
    "dengan 'bayangan' sebagai elemen naratif", "menggunakan 'sudut pandang subjektif (POV)'", "difilmkan dari 'atas langsung (top-down view)'", "dari 'kamera yang terpasang di objek'",
    "menggunakan 'efek parallax'", "dengan 'layering' latar depan dan belakang", "memanfaatkan 'ruang negatif'", "dengan 'komposisi diagonal'",
    
    // Lighting & Color (80)
    "menggunakan 'Rembrandt lighting'", "dengan 'pencahayaan low-key' yang dramatis", "dengan 'pencahayaan high-key' yang cerah", "diterangi oleh 'cahaya neon' warna-warni",
    "hanya dengan 'cahaya lilin'", "menggunakan 'backlight' untuk menciptakan rim light", "dengan 'cahaya alami dari jendela'", "diterangi oleh 'lampu jalanan kota'",
    "dengan 'palet warna pastel'", "dengan 'tone warna teal and orange'", "menggunakan 'color grading film Fuji'", "dalam 'palet warna monokromatik'",
    "dengan 'warna komplementer' yang mencolok", "menggunakan 'palet warna analogus' yang harmonis", "dengan 'desaturasi' untuk mood sedih", "dengan 'saturasi tinggi' untuk energi",
    "menggunakan 'skema warna triadic'", "dengan 'palet warna bumi (earth tones)'", "dalam 'tampilan hitam putih kontras tinggi'", "dengan 'tone sepia' untuk kesan nostalgia",
    "menambahkan 'atmospheric fog' atau kabut", "dengan 'volumetric lighting' (god rays)", "dengan 'bayangan yang tajam dan panjang'", "dengan 'cahaya yang lembut dan tersebar (diffused)'",

    "menggunakan 'split lighting' untuk dualitas", "dengan 'butterfly lighting' untuk potret glamor", "menggunakan 'loop lighting' yang umum", "diterangi 'cahaya dari layar TV atau monitor'",
    "dengan 'pantulan cahaya di permukaan basah'", "menggunakan 'gel warna' (merah atau biru) pada lampu", "dengan 'efek silau (glare)' dari sumber cahaya", "diterangi oleh 'api unggun'",
    "dengan 'cahaya bulan purnama'", "diterangi 'kilat' saat badai", "menggunakan 'lampu sorot' yang terarah", "dengan 'pencahayaan datar (flat lighting)'",
    "menampilkan 'gradasi warna' di langit", "menggunakan 'color grading Bleach Bypass'", "dengan 'teknik cross-processing'", "memakai 'LUT (Look-Up Table)' spesifik",
    "dengan 'white balance' yang sengaja dibuat hangat", "dengan 'white balance' yang sengaja dibuat dingin", "menonjolkan 'kontras' antara terang dan gelap", "dengan 'rentang dinamis tinggi (HDR)'",
    "mengisolasi 'satu warna' dalam adegan hitam putih", "dengan 'efek thermal imaging'", "dengan 'tampilan night vision'", "menggunakan 'palet warna vaporwave'",
    "dengan 'estetika warna lo-fi'", "memakai 'color palette Wes Anderson'", "dengan 'warna-warni permen' yang ceria", "dengan 'warna suram dan muram'",
    "menggunakan 'warna psikedelik' yang berputar", "dengan 'warna metalik' yang berkilauan", "menampilkan 'warna berpendar (iridescent)'", "dengan 'efek glow atau bloom'",
    "diterangi oleh 'lampu lava'", "dengan 'pencahayaan dari bawah' yang menakutkan", "menggunakan 'pola cahaya' dari jendela (gobos)", "diterangi oleh 'lampu proyektor'",
    "dengan 'warna yang pudar' seperti foto lama", "menampilkan 'warna yang kaya dan dalam' seperti lukisan cat minyak", "menggunakan 'skema warna split-complementary'", "dengan 'palet warna tetradic'",
    
    // VFX & Post-Production (100)
    "dengan 'efek suara epik'", "dan 'dialog dengan intonasi jelas'", "menambahkan detail 'hyperrealistic' pada tekstur", "dengan 'efek film grain' yang subtil",
    "menambahkan 'efek partikel debu' yang melayang", "dengan 'asap dan kabut' yang realistis", "menampilkan 'hujan deras' dengan percikan air", "dengan 'salju yang turun perlahan'",
    "menambahkan 'efek api dan ledakan' fotorealistik", "dengan 'simulasi cairan' yang akurat", "menampilkan 'efek slow-motion' pada momen kunci", "dengan 'efek time-lapse' pergerakan awan",
    "menggunakan 'matte painting' untuk latar belakang", "dengan 'set extension' digital yang mulus", "menambahkan 'elemen 3D CGI' ke dalam adegan", "dengan 'motion tracking' pada objek bergerak",
    "menggunakan 'rotoscoping' untuk isolasi subjek", "dengan 'green screen keying' yang bersih", "menambahkan 'teks dan judul' yang stylish", "dengan 'antarmuka holografik' di udara",
    "menampilkan 'efek glitch dan distorsi digital'", "dengan 'efek kerusakan film' (goresan, debu)", "menambahkan 'light saber' atau 'efek energi'", "dengan 'transformasi morf' pada objek",
    "menampilkan 'efek disintegrasi' atau 'terurai menjadi partikel'", "dengan 'efek portal' antar dimensi", "menambahkan 'sayap malaikat' atau 'aura magis'", "dengan 'efek tembus pandang (invisibility)'",
    "menggunakan 'teknik compositing' berlapis", "menambahkan 'lens flare' anamorphic", "dengan 'efek heat distortion' di udara panas", "menampilkan 'jejak cahaya (light trails)'",

    "menambahkan 'efek getaran kamera (camera shake)' saat ledakan", "dengan 'efek getaran lensa (lens breathing)'", "menggunakan 'efek medan gaya (force field)'", "dengan 'efek tembakan laser'",
    "menambahkan 'darah dan luka digital'", "dengan 'efek penuaan atau peremajaan' pada wajah", "menggunakan 'computer-generated crowds'", "dengan 'penghapusan objek (object removal)'",
    "menambahkan 'refleksi digital' pada permukaan", "dengan 'bayangan digital' yang akurat", "menggunakan 'simulasi kain' untuk pakaian", "dengan 'simulasi rambut dan bulu' yang dinamis",
    "menampilkan 'peta cuaca' atau 'data overlay'", "dengan 'efek x-ray' atau 'tampilan internal'", "menggunakan 'efek cat air menetes'", "dengan 'efek tinta menyebar di air'",
    "menambahkan 'animasi stop-motion' pada objek nyata", "dengan 'efek sketsa pensil' pada video", "menggunakan 'efek pixelation' atau 'mosaik'", "dengan 'efek cermin pecah'",
    "menampilkan 'dunia terbalik' atau 'gravitasi aneh'", "dengan 'efek miniaturisasi (tilt-shift video)'", "menggunakan 'efek 'bullet time''", "dengan 'efek 'dolly zoom' (Vertigo effect)'",
    "menambahkan 'subtitle' dengan gaya sinematik", "dengan 'animasi logo' di awal", "menggunakan 'transisi 'morphing'' antar adegan", "dengan 'transisi 'glitch''",
    "menambahkan 'elemen infografis' yang bergerak", "dengan 'efek 'double exposure''", "menggunakan 'efek 'parallax scrolling' 2.5D'", "dengan 'efek 'cinemagraph'' (gambar diam dengan sedikit gerakan)",
    "menambahkan 'efek 'datamoshing''", "dengan 'efek 'scan lines' seperti monitor CRT'", "menggunakan 'efek 'VHS tape noise''", "dengan 'efek 'chromatic aberration' yang kuat'",
    
    // Sound & Music (60)
    "diiringi 'musik gamelan modern'", "hanya menggunakan 'diegetic sound' (suara dari adegan)", "dengan 'sound design yang imersif'", "diiringi 'musik orkestra epik'",
    "dengan 'soundtrack synthwave retro'", "diiringi 'alunan piano melankolis'", "dengan 'musik rock yang energik'", "menggunakan 'musik jazz' di latar belakang",
    "dengan 'suara ambient hutan' yang menenangkan", "diiringi 'deru ombak pantai'", "dengan 'kebisingan kota' yang ramai", "menggunakan 'keheningan' untuk menciptakan tensi",
    "dengan 'dialog yang berbisik'", "diiringi 'narasi suara dalam (voice-over)'", "dengan 'efek suara 'jump scare''", "menggunakan 'suara detak jantung' yang meningkat",
    "dengan 'musik elektronik IDM (Intelligent Dance Music)'", "diiringi 'lagu folk akustik'", "dengan 'paduan suara (choir)' yang megah", "menggunakan 'ritme perkusi industrial'",
    "dengan 'efek reverb' di ruangan besar", "dengan 'efek delay atau echo' pada suara", "menggunakan 'distorsi' pada vokal atau musik", "dengan 'suara yang teredam seperti dari bawah air'",
    "diiringi 'soundscape fiksi ilmiah' (dengungan, bip)", "dengan 'suara magis' (kilau, mantra)", "menggunakan 'suara monster' yang menggeram", "dengan 'suara pedang beradu'",
    "diiringi 'tetesan air' di gua", "dengan 'suara angin' yang menderu", "menggunakan 'suara radio statis'", "dengan 'efek audio 'lo-fi''",
    
    // Miscellaneous & Conceptual (80)
    "menampilkan 'detail arsitektur rumit'", "dengan 'fokus yang sangat tajam' pada detail", "menonjolkan 'tekstur' kasar pada permukaan", "dengan 'komposisi yang bersih dan minimalis'",
    "menampilkan 'kekacauan yang terorganisir'", "dengan 'simbolisme' yang tersembunyi", "menggunakan 'metafora visual'", "dengan 'pengulangan pola' yang hipnotis",
    "menonjolkan 'kontras antara alam dan teknologi'", "dengan 'tema kesendirian'", "menampilkan 'semangat komunitas'", "dengan 'perasaan nostalgia'",
    "menciptakan 'suasana misterius'", "dengan 'mood yang ceria dan optimis'", "menampilkan 'ketegangan dan kecemasan'", "dengan 'nuansa romantis'",
    "menonjolkan 'keindahan dalam ketidaksempurnaan (wabi-sabi)'", "dengan 'simetri yang memuaskan'", "menggunakan 'skala epik' pada lanskap", "dengan 'fokus pada detail mikro'",
    "menampilkan 'interaksi karakter yang tulus'", "dengan 'ekspresi wajah yang subtle'", "menonjolkan 'bahasa tubuh'", "dengan 'kostum yang mendetail'",
    "menampilkan 'properti yang memiliki cerita'", "dengan 'latar yang bercerita'", "menggunakan 'warna sebagai narator'", "dengan 'ritme visual' yang cepat",
    "menampilkan 'pergerakan yang anggun dan lambat'", "dengan 'aksi yang cepat dan brutal'", "menonjolkan 'makanan yang terlihat lezat'", "dengan 'detail pakaian yang realistis'",
    "menampilkan 'teknologi yang terlihat usang dan dipakai'", "dengan 'desain yang ramping dan futuristik'", "menggunakan 'elemen sureal' dalam adegan realistis", "dengan 'logika mimpi'",
    "menampilkan 'fisika yang tidak mungkin'", "dengan 'arsitektur yang menentang gravitasi'", "menonjolkan 'flora dan fauna fantasi'", "dengan 'peta dan data' sebagai overlay",
    "menampilkan 'proses pembuatan sesuatu'", "dengan 'efek sebelum dan sesudah'", "menggunakan 'sudut pandang makro'", "dari 'perspektif satelit'",
];

const getRandomItem = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

// Cache to store recent activity combinations to prevent duplicates
const recentActivitiesCache = new Set<string>();
const MAX_CACHE_SIZE = 50; // Increased cache size for more variety

const generateFakeMessage = (): string => {
    let user: string, action: string, topic: string, style: string, element: string;
    let combinationKey: string;
    let attempts = 0;
    const maxAttempts = 100; // Safety break to prevent infinite loops

    do {
        // The core uniqueness is based on action + topic
        action = getRandomItem(fakeActions);
        topic = getRandomItem(fakeTopics);
        combinationKey = `${action}::${topic}`;
        attempts++;
    } while (recentActivitiesCache.has(combinationKey) && attempts < maxAttempts);

    // Add the new unique combination to the cache
    recentActivitiesCache.add(combinationKey);

    // If cache is too big, remove the oldest item
    if (recentActivitiesCache.size > MAX_CACHE_SIZE) {
        const oldestItem = recentActivitiesCache.values().next().value;
        recentActivitiesCache.delete(oldestItem);
    }
    
    // Get other random elements for full message variety
    user = getRandomItem(fakeUsers);
    style = getRandomItem(fakeStyles);
    element = getRandomItem(fakeElements);

    const templates = [
        () => `${user} ${action} ${topic}.`,
        () => `Aktivitas baru: ${user} mencoba ${topic} dengan gaya ${style}.`,
        () => `${user} berhasil men-generate video untuk ${topic} ${element}.`,
        () => `Prompt ${topic} oleh ${user} disimpan ke riwayat.`,
        () => `${user} sedang mengerjakan adegan ${topic} dalam mode 'Struktur' ${element}.`,
        () => `${user} baru saja ${action} pada prompt ${topic}.`,
        () => `${user} menyempurnakan ${topic} ${element}.`,
        () => `Mode 'Kreatif' digunakan oleh ${user} untuk mengembangkan ide ${topic}.`,
        () => `Wow! ${user} mendapatkan hasil luar biasa untuk ${topic} dengan gaya ${style}.`,
        () => `Pengguna ${user} sedang bereksperimen dengan ${element} untuk adegan ${topic}.`,
        () => `${user} mengubah pencahayaan menjadi 'Low-key lighting' untuk ${topic}.`,
        () => `Luar biasa! ${user} menggabungkan gaya ${style} dengan ${topic}.`,
        () => `Sedang diproses: ${user} menambahkan ${element} ke dalam prompt ${topic}.`,
        () => `${user} membagikan hasilnya untuk prompt ${topic} dengan gaya ${style}.`,
        () => `Log: ${user} ${action} ${topic} ${element}.`,
        () => `Ide baru dari ${user}: ${topic} dengan gaya ${style}.`,
        () => `${user} sedang melakukan render percobaan untuk ${topic}.`,
        () => `${user} menambahkan soundscape ${element} ke adegan ${topic}.`,
        () => `Dari history, ${user} memuat ulang ${topic} untuk penyesuaian.`,
        () => `Eksperimen ${style} dari ${user} pada prompt ${topic}.`
    ];
    
    const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
    return randomTemplate();
};

interface FakeMessage {
    id: number;
    text: string;
}

let messageIdCounter = 0;

const FakeChat: React.FC = () => {
    const [messages, setMessages] = useState<FakeMessage[]>([]);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Clear cache on component mount to start fresh
        recentActivitiesCache.clear();

        // Initial messages to fill the screen
        const initialMessages = Array.from({ length: 15 }, () => ({
            id: messageIdCounter++,
            text: generateFakeMessage()
        }));
        setMessages(initialMessages);

        const interval = setInterval(() => {
            setMessages(prev => {
                const newMessage = { id: messageIdCounter++, text: generateFakeMessage() };
                const nextMessages = [...prev, newMessage];
                // Keep the array size manageable to avoid performance issues
                if (nextMessages.length > 100) { // Keep more messages for better scroll feel
                    return nextMessages.slice(1);
                }
                return nextMessages;
            });
        }, 2200); // Slightly faster interval for more activity

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        // Auto-scroll to bottom with smooth behavior
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo({
                top: chatContainerRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [messages]);

    return (
        <div className="bg-white dark:bg-slate-800/50 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700/50 h-96 lg:h-full flex flex-col">
            <h3 className="font-bold text-lg mb-4 text-slate-800 dark:text-white flex-shrink-0">Aktivitas Terbaru</h3>
            <div ref={chatContainerRef} className="overflow-y-auto space-y-3 flex-grow h-0 pr-2">
                {messages.map((msg) => (
                    <p key={msg.id} className="text-sm text-slate-600 dark:text-slate-300">
                        {msg.text}
                    </p>
                ))}
            </div>
        </div>
    );
};

export default FakeChat;
