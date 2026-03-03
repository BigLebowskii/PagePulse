// ============================================
// PDF Stylesheet
// Styles for the professional audit report
// ============================================

import { StyleSheet } from "@react-pdf/renderer";

export function createStyles(brandColor: string) {
  return StyleSheet.create({
    // Page defaults
    page: {
      fontFamily: "Helvetica",
      fontSize: 10,
      paddingTop: 40,
      paddingBottom: 50,
      paddingHorizontal: 40,
      color: "#1E293B",
    },

    // ---- Cover Page ----
    coverPage: {
      fontFamily: "Helvetica",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      paddingTop: 120,
      paddingBottom: 60,
      paddingHorizontal: 40,
    },
    coverBrand: {
      fontSize: 32,
      fontFamily: "Helvetica-Bold",
      color: brandColor,
      marginBottom: 8,
    },
    coverTitle: {
      fontSize: 18,
      fontFamily: "Helvetica",
      color: "#64748B",
      marginBottom: 40,
    },
    coverUrl: {
      fontSize: 20,
      fontFamily: "Helvetica-Bold",
      color: "#1E293B",
      marginBottom: 12,
      textAlign: "center",
      maxWidth: 400,
    },
    coverDate: {
      fontSize: 11,
      color: "#94A3B8",
      marginBottom: 50,
    },
    coverScoreCircle: {
      width: 120,
      height: 120,
      borderRadius: 60,
      borderWidth: 6,
      borderStyle: "solid",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 10,
    },
    coverScoreText: {
      fontSize: 32,
      fontFamily: "Helvetica-Bold",
    },
    coverGrade: {
      fontSize: 22,
      fontFamily: "Helvetica-Bold",
      marginBottom: 60,
    },
    coverFooter: {
      fontSize: 9,
      color: "#94A3B8",
      textAlign: "center",
    },

    // ---- Executive Summary ----
    sectionTitle: {
      fontSize: 18,
      fontFamily: "Helvetica-Bold",
      color: "#1E293B",
      marginBottom: 12,
      paddingBottom: 6,
      borderBottomWidth: 2,
      borderBottomColor: brandColor,
      borderBottomStyle: "solid",
    },
    summaryText: {
      fontSize: 11,
      lineHeight: 1.6,
      color: "#475569",
      marginBottom: 20,
    },

    // ---- Score Table ----
    table: {
      marginTop: 10,
      marginBottom: 20,
    },
    tableHeader: {
      flexDirection: "row",
      backgroundColor: "#F1F5F9",
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderBottomWidth: 1,
      borderBottomColor: "#E2E8F0",
      borderBottomStyle: "solid",
    },
    tableRow: {
      flexDirection: "row",
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderBottomWidth: 1,
      borderBottomColor: "#F1F5F9",
      borderBottomStyle: "solid",
    },
    tableCell: {
      fontSize: 10,
      color: "#1E293B",
    },
    tableCellHeader: {
      fontSize: 9,
      fontFamily: "Helvetica-Bold",
      color: "#64748B",
      textTransform: "uppercase",
    },
    colCheck: { width: "40%" },
    colScore: { width: "25%" },
    colStatus: { width: "35%" },

    // ---- Detailed Section ----
    checkSection: {
      marginBottom: 24,
    },
    checkHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    },
    checkScoreBadge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
      marginRight: 10,
    },
    checkScoreBadgeText: {
      fontSize: 11,
      fontFamily: "Helvetica-Bold",
      color: "#FFFFFF",
    },
    checkName: {
      fontSize: 14,
      fontFamily: "Helvetica-Bold",
      color: "#1E293B",
    },
    checkDescription: {
      fontSize: 10,
      color: "#64748B",
      marginBottom: 8,
      fontStyle: "italic",
    },
    checkPriority: {
      fontSize: 9,
      fontFamily: "Helvetica-Bold",
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 4,
      marginBottom: 8,
      alignSelf: "flex-start",
    },
    issueItem: {
      fontSize: 10,
      color: "#475569",
      marginBottom: 4,
      paddingLeft: 12,
    },
    fixItem: {
      fontSize: 10,
      color: "#1E293B",
      marginBottom: 4,
      paddingLeft: 12,
      lineHeight: 1.5,
    },
    subHeading: {
      fontSize: 11,
      fontFamily: "Helvetica-Bold",
      color: "#1E293B",
      marginTop: 8,
      marginBottom: 4,
    },

    // ---- Next Steps Page ----
    nextStepsItem: {
      flexDirection: "row",
      marginBottom: 12,
    },
    nextStepsNumber: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: brandColor,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    nextStepsNumberText: {
      fontSize: 12,
      fontFamily: "Helvetica-Bold",
      color: "#FFFFFF",
    },
    nextStepsContent: {
      flex: 1,
      paddingTop: 4,
    },
    nextStepsTitle: {
      fontSize: 12,
      fontFamily: "Helvetica-Bold",
      color: "#1E293B",
      marginBottom: 2,
    },
    nextStepsDesc: {
      fontSize: 10,
      color: "#64748B",
      lineHeight: 1.5,
    },

    // ---- Footer ----
    pageFooter: {
      position: "absolute",
      bottom: 20,
      left: 40,
      right: 40,
      flexDirection: "row",
      justifyContent: "space-between",
      fontSize: 8,
      color: "#94A3B8",
    },
  });
}
