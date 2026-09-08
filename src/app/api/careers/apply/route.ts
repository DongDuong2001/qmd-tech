import { NextRequest, NextResponse } from "next/server";
import { careerService, isPdfBuffer, isPdfDataUri } from "@/modules/careers/service";
import { checkRateLimit, getClientIp } from "@/shared/security/rateLimiter";

const MAX_PDF_SIZE_BYTES = 10 * 1024 * 1024; // 10MB limit

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rateLimit = checkRateLimit(ip, "career_apply", 5, 900); // 5 submissions per 15 mins per IP
    if (!rateLimit.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Bạn đã gửi quá nhiều yêu cầu trong thời gian ngắn. Vui lòng thử lại sau 15 phút.",
        },
        { status: 429 }
      );
    }

    const contentType = req.headers.get("content-type") || "";

    let career_id: string | null = null;
    let job_title = "";
    let full_name = "";
    let email = "";
    let phone = "";
    let experience: string | undefined;
    let introduction: string | undefined;
    let resume_url = "";
    let resume_filename = "CV_UngVien.pdf";
    let resume_file_size = 0;

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      career_id = formData.get("career_id")?.toString() || null;
      job_title = formData.get("job_title")?.toString() || "";
      full_name = formData.get("full_name")?.toString() || "";
      email = formData.get("email")?.toString() || "";
      phone = formData.get("phone")?.toString() || "";
      experience = formData.get("experience")?.toString() || undefined;
      introduction = formData.get("introduction")?.toString() || undefined;

      const file = formData.get("resume") as File | null;
      const rawDataUri = formData.get("resume_url")?.toString() || "";

      if (file && typeof file.arrayBuffer === "function") {
        if (file.size > MAX_PDF_SIZE_BYTES) {
          return NextResponse.json(
            {
              success: false,
              error: "Dung lượng file CV vượt quá giới hạn 10MB. Vui lòng chọn file nhẹ hơn.",
            },
            { status: 400 }
          );
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        if (!isPdfBuffer(buffer)) {
          return NextResponse.json(
            {
              success: false,
              error: "Định dạng file không hợp lệ. Vui lòng tải lên tài liệu chuẩn PDF (.pdf).",
            },
            { status: 400 }
          );
        }

        resume_url = `data:application/pdf;base64,${buffer.toString("base64")}`;
        resume_filename = file.name || "CV_UngVien.pdf";
        resume_file_size = file.size || buffer.length;
      } else if (rawDataUri) {
        if (!isPdfDataUri(rawDataUri)) {
          return NextResponse.json(
            {
              success: false,
              error: "Định dạng dữ liệu PDF không hợp lệ.",
            },
            { status: 400 }
          );
        }
        resume_url = rawDataUri;
        resume_filename = formData.get("resume_filename")?.toString() || "CV_UngVien.pdf";
        resume_file_size = Number(formData.get("resume_file_size")) || 0;
      }
    } else {
      const body = await req.json();
      career_id = body.career_id || null;
      job_title = body.job_title || "";
      full_name = body.full_name || "";
      email = body.email || "";
      phone = body.phone || "";
      experience = body.experience;
      introduction = body.introduction;
      resume_url = body.resume_url || "";
      resume_filename = body.resume_filename || "CV_UngVien.pdf";
      resume_file_size = body.resume_file_size || 0;

      if (!resume_url || !isPdfDataUri(resume_url)) {
        return NextResponse.json(
          {
            success: false,
            error: "Vui lòng đính kèm file CV định dạng PDF hợp lệ.",
          },
          { status: 400 }
        );
      }
    }

    if (!full_name.trim()) {
      return NextResponse.json(
        { success: false, error: "Vui lòng nhập họ và tên ứng viên." },
        { status: 400 }
      );
    }
    if (!email.trim() || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Vui lòng nhập địa chỉ email hợp lệ." },
        { status: 400 }
      );
    }
    if (!phone.trim()) {
      return NextResponse.json(
        { success: false, error: "Vui lòng nhập số điện thoại liên hệ." },
        { status: 400 }
      );
    }
    if (!resume_url) {
      return NextResponse.json(
        { success: false, error: "Vui lòng đính kèm file CV định dạng PDF." },
        { status: 400 }
      );
    }

    const application = await careerService.submitApplication({
      career_id,
      job_title,
      full_name,
      email,
      phone,
      experience,
      introduction,
      resume_url,
      resume_filename,
      resume_file_size,
    });

    return NextResponse.json({
      success: true,
      message: "Nộp hồ sơ ứng tuyển thành công! Bộ phận tuyển dụng QMD-TECH sẽ sớm liên hệ với bạn.",
      application,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Đã có lỗi xảy ra khi nộp hồ sơ.";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
