import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './dashboard.css';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [works, setWorks] = useState([]);
  const [newWork, setNewWork] = useState({ title: '', description: '', cardNumber: '' });

  // İşleri API'den çekme
  const fetchWorks = async () => {
    try {
      const response = await axios.get('https://workfollowapi-production.up.railway.app/api/Work');
      console.log(response.data); // Veriyi kontrol et
      setWorks(response.data);
    } catch (error) {
      console.log('Error fetching works:', error);
    }
  };

  useEffect(() => {
    fetchWorks();
  }, []);

  // Yeni iş ekleme
  const handleAddWork = async (e) => {
    e.preventDefault();

    // Geçerli tarihi alıyoruz
    const currentDate = new Date().toISOString();

    const newWorkData = {
      workName: newWork.title, // Başlık kısmı
      workComment: newWork.description, // Açıklama kısmı
      workStartDate: currentDate, // Başlangıç tarihi (şu anki tarih)
      cardNumber: newWork.cardNumber // Kart numarası
    };

    try {
      const response = await axios.post(
        'https://workfollowapi-production.up.railway.app/api/Work',
        newWorkData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log("Başarıyla eklendi:", response.data);
      await fetchWorks();
      setNewWork({ title: '', description: '', cardNumber: '' });  // Formu sıfırlıyoruz
    } catch (error) {
      if (error.response) {
        // API'den dönen hata cevabını yazdır
        console.error("Hata mesajı:", error.response.data);
      } else {
        // Bağlantı hatası veya başka bir problem
        console.error("İş eklenirken hata oluştu:", error.message);
      }
    }
  };

  // İş silme
  const handleDeleteWork = async (id) => {
    console.log("Silinecek ID:", id);
    try {
      const response = await axios.delete(`https://workfollowapi-production.up.railway.app/api/Work/${id}`);
     
      if (response.status === 204) {
        console.log("İş başarıyla silindi.");
        // Silinen işi listeden çıkarıyoruz
        await fetchWorks();

      } else {
        console.error("Silme işlemi başarısız.");
      }
    } catch (error) {
      // Daha detaylı hata loglaması
      if (error.response) {
        // API'den dönen hata mesajını loglayın
        console.error('API Hatası:', error.response.data);
        console.error('API Hatası Status:', error.response.status);
      } else if (error.request) {
        // API'ye istek gönderilemediğinde
        console.error('API isteği yapılırken hata oluştu:', error.request);
      } else {
        // Genel hata mesajı
        console.error('Hata oluştu:', error.message);
      }
    }
  };

  return (
    <div className="dashboard-container">
      <div className="jobs-list">
        <h2>Mevcut İşler</h2>
        <div className="works-cards">
          {works.length > 0 ? (
            works.map((work) => (
              <div key={work.workId} className="work-card">
                <Link to={`/work/${work.workId}`} className='text-xl hover:underline duration-300 hover:text-blue-700'>{work.workName}</Link>
                <p>{work.workComment}</p>
                <p className="work-date">
                  <strong>Başlangıç:</strong> {new Date(work.workStartDate).toLocaleString()}
                </p>
                {work.workAndDate &&
                <p className="work-date">
                  <strong>Bitiş:</strong> {new Date(work.workAndDate).toLocaleString()}
                </p>
                }
                <button className="delete-btn" onClick={() => handleDeleteWork(work.workId)}>
                  Sil
                </button>
              </div>
            ))
          ) : (
            <p>Hiç iş bulunmamaktadır.</p>
          )}
        </div>
      </div>

      <div className="add-job-form">
        <h2>Yeni İş Ekle</h2>
        <form onSubmit={handleAddWork}>
          <div className="input-group">
            <label htmlFor="title">İş Başlığı</label>
            <input
              type="text"
              id="title"
              placeholder="İş Başlığı"
              value={newWork.title}
              onChange={(e) => setNewWork({ ...newWork, title: e.target.value })}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="description">İş Açıklaması</label>
            <textarea
              id="description"
              placeholder="İş Açıklaması"
              value={newWork.description}
              onChange={(e) => setNewWork({ ...newWork, description: e.target.value })}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="cardNumber">Kart Numarası</label>
            <input
              type="text"
              id="cardNumber"
              placeholder="Kart Numarası"
              value={newWork.cardNumber}
              onChange={(e) => setNewWork({ ...newWork, cardNumber: e.target.value })}
              required
            />
          </div>

          <button type="submit" className="submit-btn">İş Ekle</button>
        </form>
      </div>
    </div>
  );
};

export default Dashboard;
