import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './dashboard.css';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [works, setWorks] = useState([]);
  const [newWork, setNewWork] = useState({ title: '', description: '', cardNumber: '' });
  const [selectedFile, setSelectedFile] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const fetchWorks = async () => {
    try {
      const response = await axios.get('https://workfollowapi-production.up.railway.app/api/Work');
      setWorks(response.data);
    } catch (error) {
      console.log('Error fetching works:', error);
    }
  };

  useEffect(() => {
    fetchWorks();
  }, []);

  const handleAddWork = async (e) => {
    e.preventDefault();
    const currentDate = new Date().toISOString();
    const formData = new FormData();
    formData.append('WorkName', newWork.title);
    formData.append('WorkComment', newWork.description);
    formData.append('WorkStartDate', currentDate);
    formData.append('CardNumber', newWork.cardNumber);
    if (selectedFile) {
      formData.append('File', selectedFile);
    }

    try {
      const response = await axios.post(
        'https://workfollowapi-production.up.railway.app/api/Work/create-with-file',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      console.log("Başarıyla eklendi:", response.data);
      await fetchWorks();
      setNewWork({ title: '', description: '', cardNumber: '' });
      setSelectedFile(null);
      setIsExpanded(false);
    } catch (error) {
      console.error("İş eklenirken hata oluştu:", error.response?.data || error.message);
    }
  };

  const handleDeleteWork = async (id) => {
    try {
      const response = await axios.delete(`https://workfollowapi-production.up.railway.app/api/Work/${id}`);
      if (response.status === 204) {
        console.log("İş başarıyla silindi.");
        await fetchWorks();
      }
    } catch (error) {
      console.error("Silme işlemi başarısız:", error.message);
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
                <p className="work-date"><strong>Başlangıç:</strong> {new Date(work.workStartDate).toLocaleString()}</p>
                {work.workAndDate && <p className="work-date"><strong>Bitiş:</strong> {new Date(work.workAndDate).toLocaleString()}</p>}
                <button className="delete-btn" onClick={() => handleDeleteWork(work.workId)}>Sil</button>
              </div>
            ))
          ) : (
            <p>Hiç iş bulunmamaktadır.</p>
          )}
        </div>
      </div>

      <div className={`add-job-form ${isExpanded ? 'expanded' : 'collapsed'}`}>
        <button className="toggle-btn" onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? 'İş Ekleme Formunu Gizle' : 'Yeni İş Ekle'}
        </button>

        {isExpanded && (
          <form onSubmit={handleAddWork}>
            <div className="input-group">
              <label htmlFor="title">İş Başlığı</label>
              <input type="text" id="title" placeholder="İş Başlığı" value={newWork.title} onChange={(e) => setNewWork({ ...newWork, title: e.target.value })} required />
            </div>

            <div className="input-group">
              <label htmlFor="description">İş Açıklaması</label>
              <textarea id="description" placeholder="İş Açıklaması" value={newWork.description} onChange={(e) => setNewWork({ ...newWork, description: e.target.value })} required />
            </div>

            <div className="input-group">
              <label htmlFor="cardNumber">Kart Numarası</label>
              <input type="text" id="cardNumber" placeholder="Kart Numarası" value={newWork.cardNumber} onChange={(e) => setNewWork({ ...newWork, cardNumber: e.target.value })} required />
            </div>

            <div className="input-group">
              <label htmlFor="file">PDF Yükle</label>
              <input type="file" id="file" accept="application/pdf" onChange={(e) => setSelectedFile(e.target.files[0])} />
            </div>

            <button type="submit" className="submit-btn">İş Ekle</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
