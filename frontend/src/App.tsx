import { useQuery, useMutation } from "@tanstack/react-query";
import { getAllReports, getLatestReport } from "./api/report";
import type { Report, ManualReportResponse } from "./types/types";
import { useState } from "react";
import { triggerManualCleanup } from "./api/cleanup";

function App() {
  const [activeView, setActiveView] = useState<
    "none" | "latest" | "all" | "cleanup"
  >("none");

  const { data, isLoading, isError, error, refetch, isRefetching } = useQuery<
    Report | null,
    Error
  >({
    queryKey: ["getonereport"],
    queryFn: getLatestReport,
    enabled: false,
  });

  const {
    data: allReports,
    isLoading: isLoadingAll,
    isError: isErrorAll,
    error: errorAll,
    refetch: refetchAll,
    isRefetching: isRefetchingAll,
  } = useQuery<Report[] | null, Error>({
    queryKey: ["getallreports"],
    queryFn: getAllReports,
    enabled: false,
  });

  const {
    data: manualResponseData,
    isError: manualIsError,
    error: manualError,
    isPending: manualIsPending,
    isSuccess: manualIsSuccess,
    mutate,
  } = useMutation<ManualReportResponse | null, Error>({
    mutationFn: triggerManualCleanup,
    onSuccess: () => {
      refetch();
    },
  });

  const handleViewLatest = () => {
    setActiveView("latest");
    refetch();
  };

  const handleViewAll = () => {
    setActiveView("all");
    refetchAll();
  };

  const handleManualCleanup = () => {
    setActiveView("cleanup");
    mutate();
  };

  return (
    <div className="flex h-screen overflow-auto flex-col items-center gap-10 py-10">
      <h1 className="text-5xl text-center">Automated User Cleanup System</h1>

      <div className="flex flex-col gap-6 w-full max-w-4xl">
        <div className="flex flex-col gap-4 items-center">
          <button
            className="bg-red-500 hover:cursor-pointer w-full max-w-md py-6 text-white text-2xl hover:text-red-500 hover:border-2 hover:border-red-500 hover:bg-white rounded-lg transition-all"
            onClick={handleViewLatest}
            disabled={(isLoading || isRefetching) && activeView === "latest"}
          >
            {(isLoading || isRefetching) && activeView === "latest"
              ? "Loading..."
              : "View Latest Report"}
          </button>

          <button
            className="bg-blue-500 hover:cursor-pointer w-full max-w-md py-6 text-white text-2xl hover:text-blue-500 hover:border-2 hover:border-blue-500 hover:bg-white rounded-lg transition-all"
            onClick={handleViewAll}
            disabled={(isLoadingAll || isRefetchingAll) && activeView === "all"}
          >
            {(isLoadingAll || isRefetchingAll) && activeView === "all"
              ? "Loading..."
              : "View All Reports"}
          </button>

          <button
            className="bg-green-600 hover:cursor-pointer w-full max-w-md py-6 text-white text-2xl hover:text-green-600 hover:border-2 hover:border-green-600 hover:bg-white rounded-lg transition-all"
            onClick={handleManualCleanup}
            disabled={manualIsPending && activeView === "cleanup"}
          >
            {manualIsPending && activeView === "cleanup"
              ? "Processing..."
              : "Trigger Manual Cleanup"}
          </button>
        </div>

        {/* Results Section */}
        <div className="min-h-64 flex items-center justify-center">
          {/* Manual Cleanup Result */}
          {activeView === "cleanup" && (
            <>
              {manualIsPending && (
                <p className="text-center">Processing manual cleanup...</p>
              )}
              {manualIsSuccess && (
                <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                  <h2 className="text-2xl font-bold">
                    Manual Cleanup Successful
                  </h2>
                  <div className="p-6 bg-gray-100 rounded-lg">
                    <p>
                      <strong>Report:</strong> {manualResponseData?.report_id}
                    </p>
                    <p>
                      <strong>Users remaining:</strong>{" "}
                      {manualResponseData?.users_remaining}
                    </p>
                    <p>
                      <strong>Users deleted:</strong>{" "}
                      {manualResponseData?.users_deleted}
                    </p>
                  </div>
                </div>
              )}
              {manualIsError && (
                <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                  <h2 className="text-2xl font-bold">Manual Cleanup Failed</h2>
                  <p>
                    {manualError instanceof Error
                      ? manualError.message
                      : "Unknown error occurred"}
                  </p>
                </div>
              )}
            </>
          )}

          {/* Latest Report */}
          {activeView === "latest" && (
            <>
              {(isLoading || isRefetching) && (
                <p className="text-center">Loading the latest report...</p>
              )}
              {isError && (
                <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                  <p>
                    Error:{" "}
                    {error instanceof Error ? error.message : "Unknown error"}
                  </p>
                </div>
              )}
              {data && !isLoading && !isRefetching && !isError && (
                <div className="p-6 bg-gray-100 rounded-lg">
                  <h2 className="text-3xl font-bold mb-4">Latest Report</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <p>
                      <strong>ID:</strong> {data.id}
                    </p>
                    <p>
                      <strong>Users remaining:</strong>{" "}
                      {data.active_users_remaining}
                    </p>
                    <p>
                      <strong>Users deleted:</strong> {data.users_deleted}
                    </p>
                    <p>
                      <strong>Timestamp:</strong>{" "}
                      {new Date(data.timestamp).toLocaleString()}
                    </p>
                    <p>
                      <strong>Was manual?:</strong>{" "}
                      {data.was_manual ? "Yes" : "No"}
                    </p>
                  </div>
                </div>
              )}
            </>
          )}

          {/* All Reports */}
          {activeView === "all" && (
            <>
              {(isLoadingAll || isRefetchingAll) && (
                <p className="text-center">Loading all reports...</p>
              )}
              {isErrorAll && (
                <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                  <p>
                    Error:{" "}
                    {errorAll instanceof Error
                      ? errorAll.message
                      : "Unknown error"}
                  </p>
                </div>
              )}
              {allReports &&
                allReports.length > 0 &&
                !isLoadingAll &&
                !isRefetchingAll &&
                !isErrorAll && (
                  <div>
                    <h2 className="text-3xl font-bold mb-4">
                      All Reports ({allReports.length})
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {allReports.map((report) => (
                        <div
                          key={report.id}
                          className="p-4 bg-white border rounded-lg shadow"
                        >
                          <p>
                            <strong>ID:</strong> {report.id}
                          </p>
                          <p>
                            <strong>Users remaining:</strong>{" "}
                            {report.active_users_remaining}
                          </p>
                          <p>
                            <strong>Users deleted:</strong>{" "}
                            {report.users_deleted}
                          </p>
                          <p>
                            <strong>Timestamp:</strong>{" "}
                            {new Date(report.timestamp).toLocaleString()}
                          </p>
                          <p>
                            <strong>Was manual?:</strong>{" "}
                            {report.was_manual ? "Yes" : "No"}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              {allReports &&
                allReports.length === 0 &&
                !isLoadingAll &&
                !isRefetchingAll &&
                !isErrorAll && <p className="text-center">No reports found.</p>}
            </>
          )}

          {activeView === "none" && (
            <p className="text-gray-500">
              Select an action above to see results
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
