import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AdminLayout from '~/components/layouts/AdminLayout';
import ReportBase from '~/components/report/ReportBase';
import useSnackbarContext from '~/hooks/hookContext/useSnackbarContext';
import reports from '~/utils/report';

function ReportPage() {
  const params = useParams();
  const alertSnackbar = useSnackbarContext();
  const [reportCode, setReportCode] = useState();
  const [report, setReport] = useState();

  useEffect(() => {
    const reportCode = params?.report;
    setReportCode(reportCode || '');
    const report = reports[reportCode];
    if (report) {
      setReport(report);
    } else {
      alertSnackbar('error', `Loại báo cáo '${reportCode}' không tồn tại`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  return (
    <AdminLayout>
      <ReportBase reportCode={reportCode} report={report} />
    </AdminLayout>
  );
}

export default ReportPage;
