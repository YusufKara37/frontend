import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const WorkDetail = () => {
  const { id } = useParams();  // URL'den id parametresini alıyoruz
  const [work, setWork] = useState(null);

  const workStageMap = {
    2: "Yapilamadi",
    3: "Yapiliyor",
    4: "Yapildi"
  };

  const handleDone = async () => {
    const body = {
      workId : id,
      stageId : 4
    }
    try {
      const res = await axios.patch(`https://workfollowapi-production.up.railway.app/api/Work`, body);
      if(res.status === 200)
      {
        await fetchWorkDetail();
      }
      
    } catch (error) {
      console.log(error)
    }

  }

  const handleFail = async () => {
    const body = {
      workId : id,
      stageId : 2
    }
    try {
      const res = await axios.patch(`https://workfollowapi-production.up.railway.app/api/Work`, body);
      if(res.status === 200)
      {
        await fetchWorkDetail();
      }
      
    } catch (error) {
      console.log(error)
    }
  }

  const fetchWorkDetail = async () => {
    try {
      const response = await axios.get(`https://workfollowapi-production.up.railway.app/api/Work/${id}`);
      setWork(response.data);
    } catch (error) {
      console.error('Hata oluştu:', error);
    }
  };

  useEffect(() => {
    fetchWorkDetail();
  }, []);

  if (!work) return <p>Yükleniyor...</p>;

  return (
    <div className='bg-slate-500 rounded-lg mx-auto p-5'>
      <h2>İş Detayları</h2>
      <p>atg-{work.workId}</p>
      <p><strong>Başlık:</strong> {work.workName}</p>
      <p><strong>Açıklama:</strong> {work.workComment}</p>
      <p><strong>Başlangıç Tarihi:</strong> {new Date(work.workStartDate).toLocaleString()}</p>
    {work.workAndDate &&
      <p><strong>Bitiş Tarihi:</strong> {new Date(work.workAndDate).toLocaleString()}</p>
    }
      
      <p><strong>Is Durumu : </strong>{workStageMap[work.workStageId]}</p>
      <div className='group p-4 bg-black text-white hover:scale-105 duration-500'>Is Durumunu Guncelle
        <div className='hidden group-hover:block absolute left-0 p-5 rounded-md bg-black'>
          <ul className='space-y-2'>
            <li>
              <button type='button' onClick={handleDone}>
                Yapildi
              </button>
            </li>
            <li>
              <button type='button' onClick={handleFail}>
                Yapilamadi
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WorkDetail;
