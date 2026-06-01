export default function handler(req, res) {
    return res.status(200).json({ reply: "تم إيقاف سيرفر الـ API والتحول للتشغيل المباشر." });
}