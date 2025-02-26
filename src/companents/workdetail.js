import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const WorkDetail = () => {
  const { id } = useParams(); // URL'den id parametresini alıyoruz
  const [work, setWork] = useState(null);
  const navigate = useNavigate(); // Yönlendirme için useNavigate hook'u

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
      console.log("API'den Gelen Veri:", response.data);
      setWork(response.data);
    } catch (error) {
      console.error("Hata oluştu:", error);
    }
  }, [id]); // Sadece id değiştiğinde yeniden oluştur

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

  const goToDashboard = () => {
    navigate("/dashboard");
  };

  if (!work) return <p>Yükleniyor...</p>;

  return (
    <div
      className="h-screen w-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          'url("https://atilganmakine.com.tr/wp-content/uploads/2020/07/forklift-slider-min.jpg")',
      }}
    >
      <div className="w-full max-w-3xl bg-white bg-opacity-90 shadow-md rounded-lg p-8 relative">
        {/* Ana sayfaya dönme butonu */}
        <div className="absolute top-4 left-4 z-10">
          <button
            onClick={goToDashboard}
            className="bg-gray-700 text-white py-2 px-6 rounded-md text-lg font-medium hover:bg-gray-800 transition duration-200"
          >
            🔙 Dashboard'a Dön
          </button>
        </div>

        {/* Başlık */}
        <h2 className="text-2xl font-semibold text-gray-800 border-b pb-4">
          İş Detayları
        </h2>

        {/* İçerik */}
        <div className="mt-6 space-y-3 text-gray-700">
          <p className="text-lg font-medium text-gray-600">
            🔹 atg-{work.workId}
          </p>
          <p>
            <strong className="text-gray-600">Başlık:</strong> {work.workName}
          </p>
          <p>
            <strong className="text-gray-600">Açıklama:</strong>{" "}
            {work.workComment}
          </p>
          <p>
            <strong className="text-gray-600">Başlangıç Tarihi:</strong>{" "}
            {new Date(work.workStartDate).toLocaleString()}
          </p>
          {work.workAndDate && (
            <p>
              <strong className="text-gray-600">Bitiş Tarihi:</strong>{" "}
              {new Date(work.workAndDate).toLocaleString()}
            </p>
          )}
          <p>
            <strong className="text-gray-600">Durum:</strong>
            <span
              className={`ml-2 px-3 py-1 rounded-md text-white 
            ${
              work.workStageId === 4
                ? "bg-green-500"
                : work.workStageId === 2
                ? "bg-red-500"
                : "bg-yellow-500"
            }`}
            >
              {workStageMap[work.workStageId]}
            </span>
          </p>
        </div>

        {/* PDF İndirme Butonu */}
        {work.pdfUrl && (
          <div className="mt-6">
            <a
              href={work.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full block text-center bg-blue-600 text-white px-4 py-2 rounded-md text-lg font-medium hover:bg-blue-700 transition duration-200"
            >
              ⬇️ PDF'yi Aç
            </a>
          </div>
        )}

        {/* İş Durumu Güncelleme Butonları */}
        <div className="mt-6 flex justify-between gap-4">
          <button
            className="flex-1 bg-green-600 text-white py-2 rounded-md text-lg font-medium hover:bg-green-700 transition duration-200"
            onClick={handleDone}
          >
            ✅ Yapıldı
          </button>
          <button
            className="flex-1 bg-red-600 text-white py-2 rounded-md text-lg font-medium hover:bg-red-700 transition duration-200"
            onClick={handleFail}
          >
            ❌ Yapılamadı
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkDetail;
