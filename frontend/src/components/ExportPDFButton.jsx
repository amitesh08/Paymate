import axios from "axios";
import toast from "react-hot-toast";

const ExportPDFButton = () => {
  const handleExport = async () => {
    try {
      const res = await axios.get(
        // `${import.meta.env.VITE_API_URL}/api/v1/transactions/export`,
        "/api/v1/transactions/export",
        {
          responseType: "blob",
          withCredentials: true,
        }
      );

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "transactions.pdf";
      a.click();
      window.URL.revokeObjectURL(url);

      toast.success("PDF downloaded!");
    } catch {
      toast.error("Failed to download PDF");
    }
  };

  return (
    <button
      onClick={handleExport}
      className="px-4 py-2 bg-blue-600 cursor-pointer text-white text-sm rounded-md hover:bg-blue-700 transition"
    >
      Export PDF
    </button>
  );
};

export default ExportPDFButton;
