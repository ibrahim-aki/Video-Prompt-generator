import React, { useState, useEffect, useRef } from 'react';

const fakeUsers = [
    "jakantr45", "shadow_killer21", "cyber_nomad_88", "pro_gamer_ID", "sinta_aja_deh", 
    "kopi_sore_77", "sky_explorer99", "alpha_dev_01", "bintang_jatuh", "raja_terakhir",
    "gadis_senja_02", "petualang_kode", "pixel_artist_92", "sutradara_malam", "cerita_visual",
    "kode_animasi", "dream_weaver_id", "galaxy_rider_7", "retro_synth_85", "flora_fauna_fan",
    "arkitek_maya", "penjelajah_waktu", "master_prompt", "ratu_visual", "neuron_aktif",
    "seniman_digital", "pemburu_artefak", "chronos_surfer"
];

const fakeActions = [
    "baru saja men-generate prompt untuk",
    "sedang bereksperimen dengan gaya",
    "menyimpan prompt favoritnya tentang",
    "mencoba mode 'Kreatif' pada ide",
    "memuat ulang riwayat untuk prompt",
    "mendapatkan hasil yang menakjubkan untuk",
    "menyempurnakan detail pada",
    "menambahkan efek pencahayaan sinematik ke",
    "menghapus prompt lama tentang",
    "memvisualisasikan konsep",
    "membangun dunia untuk"
];

const fakeTopics = [
    "'seekor naga kristal di atas kota neon'",
    "'perpustakaan kuno yang melayang di angkasa'",
    "'robot samurai bertarung di bawah hujan bunga sakura'",
    "'hutan ajaib dengan jamur yang menyala'",
    "'kereta uap melintasi jembatan di atas awan'",
    "'astronot menemukan taman rahasia di Mars'",
    "'pasar malam yang ramai di dunia cyberpunk'",
    "'detektif noir memecahkan kasus di kota yang selalu hujan'",
    "'kapal bajak laut terbang di antara pulau-pulau langit'",
    "'makhluk bawah laut raksasa tidur di palung samudera'",
    "'upacara teh di sebuah kuil di puncak gunung'",
    "'kota bawah tanah yang ditenagai oleh kristal raksasa'",
    "'seorang alkemis di laboratoriumnya yang berantakan'",
    "'manusia pohon kuno memberikan kebijaksanaan'",
    "'balapan mobil terbang di antara gedung pencakar langit'",
    "'penjelajah menemukan air terjun pelangi'",
    "'gurun pasir di malam hari dengan dua bulan purnama'",
    "'sebuah istana yang terbuat dari kaca dan cahaya'",
    "'pasar rempah-rempah eksotis di dunia fantasi'",
    "'robot kecil merawat taman di atap gedung'",
    "'prajurit viking berdiri di tepi tebing'",
    "'kafe yang nyaman saat badai salju di luar'",
    "'konser musik holografik di masa depan'",
    "'hewan-hewan hutan mengadakan pertemuan rahasia'",
    "'observatorium tua di puncak gunung'",
    "'seseorang memancing bintang dari danau kosmik'",
    "'kota Venesia dengan kanal yang terbuat dari lava'",
    "'tarian robot balerina di panggung opera'",
    "'sebuah jam saku yang bisa memutar kembali waktu'",
    "'anak-anak bermain di antara reruntuhan peradaban kuno'"
];

const generateFakeMessage = () => {
    const user = fakeUsers[Math.floor(Math.random() * fakeUsers.length)];
    const action = fakeActions[Math.floor(Math.random() * fakeActions.length)];
    const topic = fakeTopics[Math.floor(Math.random() * fakeTopics.length)];

    const templates = [
        () => `${user} ${action} ${topic}...`,
        () => `Aktivitas baru dari ${user}: mencoba ${topic} dengan gaya 'Hyperrealistic'.`,
        () => `${user} berhasil men-generate video untuk ${topic}.`,
        () => `Prompt ${topic} oleh ${user} disimpan ke riwayat.`,
        () => `${user} sedang mengerjakan adegan ${topic} dalam mode 'Struktur'.`
    ];
    
    const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
    return randomTemplate();
};


const FakeChat: React.FC = () => {
    const [messages, setMessages] = useState<string[]>([]);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Initial messages to fill the screen
        const initialMessages = Array.from({ length: 5 }, () => generateFakeMessage());
        setMessages(initialMessages);

        const interval = setInterval(() => {
            setMessages(prev => [...prev.slice(prev.length > 30 ? 1 : 0), generateFakeMessage()]);
        }, 2800); // Add a new message every 2.8 seconds

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        // Auto-scroll to bottom
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className="bg-white dark:bg-slate-800/50 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700/50 h-96 lg:h-full flex flex-col">
            <h3 className="font-bold text-lg mb-4 text-slate-800 dark:text-white flex-shrink-0">Aktivitas Terbaru</h3>
            <div ref={chatContainerRef} className="overflow-y-auto space-y-3 flex-grow h-0 pr-2">
                {messages.map((msg, index) => (
                    <p key={index} className="text-sm text-slate-600 dark:text-slate-300 animate-fade-in">
                        {msg}
                    </p>
                ))}
            </div>
        </div>
    );
};

export default FakeChat;