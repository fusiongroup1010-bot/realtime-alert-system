/**
 * Utility to export data to a CSV file that mimics the UI structure.
 */
export const exportToExcel = (data: any[], headers: { vi: string, en: string, key: string }[], fileName: string) => {
  // Create CSV content with a BOM for Vietnamese characters support in Excel
  let csvContent = "\uFEFF"; 
  
  // Create Bilingual Headers
  const headerVi = headers.map(h => h.vi).join(",");
  const headerEn = headers.map(h => h.en).join(",");
  
  csvContent += headerVi + "\n";
  csvContent += headerEn + "\n";
  
  // Add separator for better visual structure
  csvContent += headers.map(() => "---").join(",") + "\n";

  // Add Data Rows
  data.forEach(item => {
    const row = headers.map(h => {
      const value = item[h.key] || "";
      // Escape commas and quotes
      return `"${String(value).replace(/"/g, '""')}"`;
    }).join(",");
    csvContent += row + "\n";
  });

  // Create and trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${fileName}.csv`); // CSV is safer for cross-platform, but opens in Excel
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
