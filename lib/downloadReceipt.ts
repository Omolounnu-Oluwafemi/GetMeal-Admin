import type { ApiPaymentDetail } from "@/lib/hooks/payments";

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1).replace(/_/g, " ");
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// jsPDF's built-in fonts don't include ₦ — use NGN prefix instead
function fmt(amount: number) {
  return `NGN ${amount.toLocaleString()}`;
}

async function loadLogoBase64(): Promise<string | null> {
  try {
    const res = await fetch("/logoWhite.svg");
    const svgText = await res.text();
    // Colour the logo green for white-bg contexts, keep white for dark-bg
    const blob = new Blob([svgText], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);

    return await new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = 120;
        canvas.height = 180;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, 120, 180);
        URL.revokeObjectURL(url);
        resolve(canvas.toDataURL("image/png"));
      };
      img.onerror = () => { URL.revokeObjectURL(url); resolve(null); };
      img.src = url;
    });
  } catch {
    return null;
  }
}

export async function downloadPaymentReceipt(payment: ApiPaymentDetail) {
  const { default: jsPDF } = await import("jspdf");

  const [logoBase64] = await Promise.all([loadLogoBase64()]);

  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 48;
  const contentW = pageW - margin * 2;

  const GREEN = "#219e02";
  const DARK = "#111827";
  const MID = "#6B7280";
  const BG = "#F9FAFB";

  let y = 0;

  // ── Header band ──────────────────────────────────────────────────
  doc.setFillColor(GREEN);
  doc.rect(0, 0, pageW, 100, "F");

  // Logo image (white, top-left)
  if (logoBase64) {
    doc.addImage(logoBase64, "PNG", margin, 10, 40, 60);
  }

  // Brand name
  doc.setTextColor("#ffffff");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("getameal", margin + (logoBase64 ? 50 : 0), 38);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Payment Receipt", margin + (logoBase64 ? 50 : 0), 56);

  // Reference + date (top-right)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(payment.paymentReference, pageW - margin, 36, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor("#d4f5c4");
  doc.text(formatDate(payment.createdAt), pageW - margin, 54, { align: "right" });

  y = 120;

  // ── Status pills ─────────────────────────────────────────────────
  const isPaid = payment.paymentStatus === "paid";
  const payPillBg = isPaid ? "#dcfce7" : "#FFF7ED";
  const payPillText = isPaid ? "#219e02" : "#D97706";

  doc.setFillColor(payPillBg);
  doc.roundedRect(margin, y, 90, 22, 11, 11, "F");
  doc.setTextColor(payPillText);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text(capitalize(payment.paymentStatus), margin + 45, y + 14.5, { align: "center" });

  const isComplete = ["delivered", "picked_up"].includes(payment.status);
  const ordPillBg = isComplete ? "#dcfce7" : "#FFF7ED";
  const ordPillText = isComplete ? "#219e02" : "#D97706";
  doc.setFillColor(ordPillBg);
  doc.roundedRect(margin + 98, y, 120, 22, 11, 11, "F");
  doc.setTextColor(ordPillText);
  doc.text(`Order: ${capitalize(payment.status)}`, margin + 158, y + 14.5, { align: "center" });

  y += 42;

  // ── Total amount ─────────────────────────────────────────────────
  doc.setTextColor(DARK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(34);
  doc.text(fmt(payment.totalAmount), margin, y + 30);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(MID);
  doc.text("Total Charged", margin, y + 48);

  y += 72;

  // ── Divider ──────────────────────────────────────────────────────
  doc.setDrawColor("#E5E7EB");
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageW - margin, y);
  y += 24;

  // ── Two-column info cards ─────────────────────────────────────
  const colW = (contentW - 16) / 2;

  // Customer card
  doc.setFillColor(BG);
  doc.roundedRect(margin, y, colW, 88, 8, 8, "F");
  doc.setTextColor(MID);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("CUSTOMER", margin + 14, y + 18);
  doc.setTextColor(DARK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(payment.userId?.fullName ?? "Unknown", margin + 14, y + 34);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(MID);
  doc.text(payment.userId?.email ?? "—", margin + 14, y + 50, { maxWidth: colW - 28 });
  if (payment.userId?.phone) {
    doc.text(payment.userId.phone, margin + 14, y + 64);
  }

  // Order info card
  const col2X = margin + colW + 16;
  doc.setFillColor(BG);
  doc.roundedRect(col2X, y, colW, 88, 8, 8, "F");
  doc.setTextColor(MID);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("ORDER INFO", col2X + 14, y + 18);
  doc.setTextColor(DARK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(capitalize(payment.deliveryType), col2X + 14, y + 34);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(MID);
  doc.text(`${payment.mealItems.length} item${payment.mealItems.length !== 1 ? "s" : ""}`, col2X + 14, y + 50);
  doc.text(formatDate(payment.createdAt), col2X + 14, y + 64, { maxWidth: colW - 28 });

  y += 108;

  // ── Meal items table ──────────────────────────────────────────
  doc.setTextColor(DARK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Items", margin, y);
  y += 14;

  // Table header
  doc.setFillColor("#F3F4F6");
  doc.rect(margin, y, contentW, 26, "F");
  doc.setTextColor(MID);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("MEAL ID", margin + 12, y + 17);
  doc.text("QTY", margin + contentW * 0.55, y + 17);
  doc.text("UNIT PRICE", margin + contentW * 0.68, y + 17);
  doc.text("SUBTOTAL", margin + contentW * 0.84, y + 17);
  y += 26;

  payment.mealItems.forEach((item, i) => {
    if (i % 2 === 0) {
      doc.setFillColor("#FAFAFA");
      doc.rect(margin, y, contentW, 28, "F");
    }
    doc.setTextColor(DARK);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    const shortId = item.mealId.length > 26 ? `...${item.mealId.slice(-22)}` : item.mealId;
    doc.text(shortId, margin + 12, y + 18);
    doc.text(String(item.quantity), margin + contentW * 0.55, y + 18);
    doc.text(fmt(item.price), margin + contentW * 0.68, y + 18);
    doc.setFont("helvetica", "bold");
    doc.text(fmt(item.price * item.quantity), margin + contentW * 0.84, y + 18);
    y += 28;
  });

  // Total row
  doc.setDrawColor("#E5E7EB");
  doc.line(margin, y, pageW - margin, y);
  y += 18;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(DARK);
  doc.text("Total", margin + 12, y);
  doc.setTextColor(GREEN);
  doc.text(fmt(payment.totalAmount), margin + contentW * 0.84, y);
  y += 32;

  // ── Note ─────────────────────────────────────────────────────
  if (payment.note) {
    doc.setFillColor("#FFFBEB");
    doc.roundedRect(margin, y, contentW, 44, 6, 6, "F");
    doc.setTextColor("#92400e");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text("NOTE", margin + 12, y + 14);
    doc.setFont("helvetica", "normal");
    doc.text(payment.note, margin + 12, y + 30, { maxWidth: contentW - 24 });
    y += 56;
  }

  // ── Footer ────────────────────────────────────────────────────
  const footerH = 64;
  const footerY = pageH - footerH;
  doc.setFillColor(GREEN);
  doc.rect(0, footerY, pageW, footerH, "F");

  // Logo: 28×42pt, vertically centred in footer
  const logoH = 42;
  const logoW = 28;
  const logoY = footerY + (footerH - logoH) / 2;

  if (logoBase64) {
    doc.addImage(logoBase64, "PNG", margin, logoY, logoW, logoH);
  }

  const textX = margin + (logoBase64 ? logoW + 10 : 0);
  // "getameal" sits ~40% down, email ~65% down
  doc.setTextColor("#ffffff");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("getameal", textX, footerY + footerH * 0.42);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor("#d4f5c4");
  doc.text("support@getameal.app", textX, footerY + footerH * 0.68);

  doc.setTextColor("#ffffff");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("Thank you for using Getameal!", pageW - margin, footerY + footerH / 2 + 4, { align: "right" });

  doc.save(`receipt-${payment.paymentReference}.pdf`);
}
