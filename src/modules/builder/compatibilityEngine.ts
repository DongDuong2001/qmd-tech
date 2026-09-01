import { ComponentSlot, CompatibilityIssue, PerformanceTier, Product } from "@/shared/types";
import { CompatibilityCheckResult } from "./types";

export class CompatibilityEngine {
  /**
   * Evaluate the complete PC configuration for hardware compatibility,
   * power requirements, and estimated performance tier.
   */
  evaluate(slots: Record<ComponentSlot, Product | null>): CompatibilityCheckResult {
    const issues: CompatibilityIssue[] = [];

    const cpu = slots.cpu;
    const mb = slots.motherboard;
    const ram = slots.ram;
    const gpu = slots.gpu;
    const psu = slots.psu;
    const pcCase = slots.case;
    const cooler = slots.cooling;

    // 1. Socket Compatibility (CPU <-> Motherboard)
    if (cpu && mb) {
      const cpuSocket = cpu.specs.socket?.toUpperCase();
      const mbSocket = mb.specs.socket?.toUpperCase();

      if (cpuSocket && mbSocket && cpuSocket !== mbSocket) {
        issues.push({
          type: "socket",
          severity: "error",
          message_vi: `Không tương thích socket: CPU dùng socket ${cpuSocket} nhưng Bo mạch chủ dùng socket ${mbSocket}.`,
          message_en: `Socket mismatch: CPU uses ${cpuSocket} socket but Motherboard requires ${mbSocket}.`,
        });
      }
    }

    // 2. Cooler Socket Compatibility (Cooler <-> CPU / Motherboard)
    if (cooler && (cpu || mb)) {
      const targetSocket = (cpu?.specs.socket || mb?.specs.socket)?.toUpperCase();
      const supportedSockets = cooler.specs.supported_sockets?.map((s) => s.toUpperCase()) || [];

      if (targetSocket && supportedSockets.length > 0 && !supportedSockets.includes(targetSocket)) {
        issues.push({
          type: "socket",
          severity: "warning",
          message_vi: `Tản nhiệt có thể không hỗ trợ sẵn gông cắm socket ${targetSocket}. Cần kiểm tra phụ kiện đi kèm.`,
          message_en: `Cooler may lack out-of-the-box mounting brackets for ${targetSocket} socket.`,
        });
      }
    }

    // 3. RAM Type Compatibility (RAM <-> Motherboard / CPU)
    if (ram && mb) {
      const ramType = ram.specs.ram_type?.toUpperCase();
      const mbRamType = mb.specs.ram_type?.toUpperCase();

      if (ramType && mbRamType && ramType !== mbRamType) {
        issues.push({
          type: "ram_type",
          severity: "error",
          message_vi: `Xung đột chuẩn RAM: Bo mạch chủ yêu cầu ${mbRamType} nhưng bạn đang chọn RAM ${ramType}.`,
          message_en: `RAM generation mismatch: Motherboard requires ${mbRamType} but selected RAM is ${ramType}.`,
        });
      }
    }

    // 4. Form Factor (Motherboard <-> Case)
    if (mb && pcCase) {
      const mbFormFactor = mb.specs.form_factor;
      const supportedCases = pcCase.specs.supported_motherboards || [];

      if (mbFormFactor && supportedCases.length > 0 && !supportedCases.includes(mbFormFactor)) {
        issues.push({
          type: "form_factor",
          severity: "error",
          message_vi: `Vỏ case không vừa kích cỡ bo mạch chủ: Mainboard ${mbFormFactor} không nằm trong danh sách hỗ trợ của case (${supportedCases.join(", ")}).`,
          message_en: `Form factor incompatible: Motherboard ${mbFormFactor} is not supported by case (${supportedCases.join(", ")}).`,
        });
      }
    }

    // 5. GPU Clearance (GPU length vs Case max clearance)
    if (gpu && pcCase) {
      const gpuLength = gpu.specs.length_mm;
      const caseMaxGpu = pcCase.specs.max_gpu_length_mm;

      if (gpuLength && caseMaxGpu && gpuLength > caseMaxGpu) {
        issues.push({
          type: "gpu_clearance",
          severity: "error",
          message_vi: `Card đồ họa quá dài (${gpuLength}mm) so với không gian tối đa của case (${caseMaxGpu}mm).`,
          message_en: `GPU length (${gpuLength}mm) exceeds case maximum clearance (${caseMaxGpu}mm).`,
        });
      }
    }

    // 6. Power Estimation & PSU Sufficiency
    let estimatedWattage = 100; // Baseline for motherboard, fans, storage, RGB
    if (cpu?.specs.tdp_watts) estimatedWattage += cpu.specs.tdp_watts;
    if (gpu?.specs.tdp_watts) estimatedWattage += gpu.specs.tdp_watts;

    // Recommended PSU capacity includes 30% headroom for transients
    const recommendedPsuWattage = Math.ceil((estimatedWattage * 1.3) / 50) * 50;

    if (psu) {
      const psuWattage = psu.specs.wattage || 0;
      if (psuWattage < estimatedWattage) {
        issues.push({
          type: "power_draw",
          severity: "error",
          message_vi: `Công suất nguồn (${psuWattage}W) không đủ cho hệ thống (ước tính tiêu thụ ${estimatedWattage}W).`,
          message_en: `PSU wattage (${psuWattage}W) is lower than estimated system power consumption (${estimatedWattage}W).`,
        });
      } else if (psuWattage < recommendedPsuWattage) {
        issues.push({
          type: "power_draw",
          severity: "warning",
          message_vi: `Nguồn ${psuWattage}W có thể hoạt động nhưng nên chọn từ ${recommendedPsuWattage}W trở lên để đảm bảo độ bền tối ưu.`,
          message_en: `PSU ${psuWattage}W is acceptable, but ${recommendedPsuWattage}W+ is recommended for peak transient efficiency.`,
        });
      }
    }

    // 7. Calculate Total Price
    let totalPriceVnd = 0;
    Object.values(slots).forEach((product) => {
      if (product) {
        totalPriceVnd += product.price_vnd;
      }
    });

    // 8. Performance Tier Classification
    const performanceTier = this.classifyTier(slots, totalPriceVnd);

    // Determine Overall Status
    let status: "compatible" | "warning" | "incompatible" = "compatible";
    if (issues.some((i) => i.severity === "error")) {
      status = "incompatible";
    } else if (issues.some((i) => i.severity === "warning")) {
      status = "warning";
    }

    return {
      status,
      issues,
      estimatedWattage,
      recommendedPsuWattage,
      performanceTier,
      totalPriceVnd,
    };
  }

  private classifyTier(
    slots: Record<ComponentSlot, Product | null>,
    totalPriceVnd: number
  ): PerformanceTier {
    const gpuName = slots.gpu?.name_en.toLowerCase() || "";
    const cpuName = slots.cpu?.name_en.toLowerCase() || "";

    if (
      gpuName.includes("4090") ||
      gpuName.includes("4080") ||
      cpuName.includes("7950x") ||
      cpuName.includes("14900k") ||
      totalPriceVnd > 50000000
    ) {
      return "enthusiast";
    }

    if (
      gpuName.includes("4070") ||
      gpuName.includes("7800") ||
      cpuName.includes("7800x3d") ||
      cpuName.includes("14700k") ||
      totalPriceVnd > 30000000
    ) {
      return "high_end";
    }

    if (
      gpuName.includes("4060") ||
      gpuName.includes("7600") ||
      cpuName.includes("7600") ||
      cpuName.includes("13400") ||
      totalPriceVnd > 15000000
    ) {
      return "mid_range";
    }

    return "budget";
  }
}

export const compatibilityEngine = new CompatibilityEngine();
