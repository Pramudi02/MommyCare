const mongoose = require("mongoose");
const getDoctorMedicalReportModel = require("../models/DoctorMedicalReport");
const { uploadToCloudinary } = require("../config/multer-cloudinary");

exports.createMedicalReport = async (req, res) => {
  try {
    console.log("📥 Body received:", req.body);
    console.log("📥 File received:", req.file);

    if (!req.file) {
      return res.status(400).json({ error: "PDF file is required" });
    }

    // Upload file to Cloudinary
    const uploadResult = await uploadToCloudinary(req.file);

    const DoctorMedicalReport = getDoctorMedicalReportModel();

    const report = new DoctorMedicalReport({
      patient: new mongoose.Types.ObjectId(req.body.patientId),
      doctor: req.user._id, // 👈 comes from JWT middleware

      title: req.body.title,
      description: req.body.description,
      reportType: req.body.reportType,
      category: req.body.category,

      findings: req.body.findings
        ? Array.isArray(req.body.findings)
          ? req.body.findings
          : req.body.findings.split(",").map((s) => s.trim())
        : [],

      recommendations: req.body.recommendations,

      tags: req.body.tags
        ? Array.isArray(req.body.tags)
          ? req.body.tags
          : req.body.tags.split(",").map((s) => s.trim())
        : [],

      notes: req.body.notes,

      // File info
      fileUrl: uploadResult.secure_url,
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
    });

    await report.save();

    res.status(201).json({
      message: "✅ Medical report created successfully",
      report,
    });
  } catch (err) {
    console.error("❌ Error creating report:", err);
    res.status(500).json({ error: err.message });
  }
};
