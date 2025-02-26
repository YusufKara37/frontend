import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./workdetail.css"; // CSS dosyasını import edin

const WorkDetail = () => {
  const { id } = useParams(); // URL'den id parametresini alıyoruz
  const [work, setWork] = useState(null);

  const workStageMap = {
    2: "Yapılamadı",
    3: "Beklemede",
    4: "Yapıldı",
  };

  const fetchWorkDetail = useCallback(async () => {
    try {
      const response = await axios.get(
        `https://workfollowapi-production.up.railway.app/api/Work/${id}`
      );
      setWork(response.data);
    } catch (error) {
      console.error("Hata oluştu:", error);
    }
  }, [id]);

  useEffect(() => {
    fetchWorkDetail();
  }, [fetchWorkDetail]);

  const handleDone = async () => {
    const body = {
      workId: id,
      stageId: 4,
    };
    try {
      const res = await axios.patch(
        `https://workfollowapi-production.up.railway.app/api/Work`,
        body
      );
      if (res.status === 200) {
        await fetchWorkDetail();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleFail = async () => {
    const body = {
      workId: id,
      stageId: 2,
    };
    try {
      const res = await axios.patch(
        `https://workfollowapi-production.up.railway.app/api/Work`,
        body
      );
      if (res.status === 200) {
        await fetchWorkDetail();
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (!work) return <p>Yükleniyor...</p>;

  return (
    <div className="work-detail-container">
      <div className="work-detail-card">
        <h2>İş Detayları</h2>
        <div className="work-detail-text">
          <p><strong>İş ID:</strong> atg-{work.workId}</p>
          <p><strong>Başlık:</strong> {work.workName}</p>
          <p><strong>Açıklama:</strong> {work.workComment}</p>
          <p><strong>Başlangıç Tarihi:</strong> {new Date(work.workStartDate).toLocaleString()}</p>
          {work.workAndDate && (
            <p><strong>Bitiş Tarihi:</strong> {new Date(work.workAndDate).toLocaleString()}</p>
          )}
          <p>
            <strong>Durum:</strong>
            <span
              className={`status-badge ${
                work.workStageId === 4
                  ? "bg-success"
                  : work.workStageId === 2
                  ? "bg-danger"
                  : "bg-warning"
              }`}
            >
              {workStageMap[work.workStageId]}
            </span>
          </p>
        </div>

        {/* PDF İndirme Butonu */}
        {work.pdfUrl && (
          <a href={work.pdfUrl} target="_blank" rel="noopener noreferrer" className="pdf-btn">
            ⬇️ PDF'yi Aç
          </a>
        )}

        {/* İş Durumu Güncelleme Butonları */}
        <div className="flex gap-4">
          <button className="bg-green" onClick={handleDone}>
            ✅ Yapıldı
          </button>
          <button className="bg-red" onClick={handleFail}>
            ❌ Yapılamadı
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkDetail;
