import { useMemo } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import AdminLayout from '~/components/layouts/AdminLayout';
import ListBase from '~/components/listBase/ListBase';
import { dsDanhMuc } from '~/utils/data';

function ListDeleted() {
  const { maDanhMuc } = useParams();
  const danhMuc = useMemo(() => {
    return dsDanhMuc[maDanhMuc];
  }, [maDanhMuc]);
  if (!danhMuc) {
    return <Navigate to="/404" />;
  }

  return (
    <AdminLayout>
      <ListBase
        title={danhMuc?.title}
        columns={danhMuc?.columns}
        maDanhMuc={maDanhMuc}
        uniqueKey={danhMuc?.uniqueKey}
        Form={danhMuc.Form}
        Filter={danhMuc.Filter}
        isDeleted
      />
    </AdminLayout>
  );
}

export default ListDeleted;
