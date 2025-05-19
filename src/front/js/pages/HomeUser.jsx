import React, { useEffect, useContext, useState } from 'react'
import { Context } from '../store/appContext';
import { Link } from "react-router-dom";
import './../../styles/home.css';
import { BsChatSquareTextFill } from "react-icons/bs";
import { TbMessageChatbotFilled } from "react-icons/tb";
import { RiContactsFill } from "react-icons/ri";
import { BsQuestionCircleFill } from "react-icons/bs";
import { FaLocationDot } from "react-icons/fa6";
import { MdAddAlert } from "react-icons/md";
import { MdTipsAndUpdates } from "react-icons/md";
import { FaQuestionCircle } from "react-icons/fa";
import { PiPawPrintFill } from "react-icons/pi";




const HomeUser = () => {
  const admin = JSON.parse(localStorage.getItem('admin'));
  const token = localStorage.getItem('token');
  const { store, actions } = useContext(Context);

  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);


  useEffect(() => {
    if (!navigator.geolocation) {
      setError("La geolocalización no es soportada por este navegador.");
      return;
    }

    const getLocation = () => {

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitud: latitude, longitud: longitude });
          actions.setUserLocation(latitude, longitude);
          console.log("ubiv", location);
        },
        (error) => {
          setError("Error al obtener la ubicación: ", error);
        }
      );

    };

    getLocation();
  }, []);
  return (
    <div>
      {token ? (
        <>
          <h2 className='headingH'>Inicio</h2>
          <div className='formis'>
            {token && (
              <button className='buttonPearl'>
                <Link className='wrap' to='/patient-profile'>
                  
                  <p>
                    {/* <span><RiContactsFill style={{ fontSize: '3em' }} /></span> */}
                    <span>Mi perfil</span>
                    
                  </p>
                </Link>
              </button>
            )}
            {token && (
                            <button className='buttonPearl'>

              <Link className='wrap' to='/complaint'>
              <p>
                    <span>
                <FaLocationDot style={{ fontSize: '3em' }} />
                </span>
                    <span>Estudios</span>
                    
                  </p>
              </Link>
              </button>
            )}
            {/* {token && (
                <Link className='login-buttones' to='/help'>
                  <FaQuestionCircle style={{ fontSize: '3em' }} />
                  <p>FAQ</p>
                </Link>
              )} */}
            {token && (
                            <button className='buttonPearl'>

              <Link className='wrap' to='/freq-asked-questions'>
              <p>
                    <span>
                <MdTipsAndUpdates style={{ fontSize: '3em' }} />
                </span>
                    <span>Recetas</span>
                    
                  </p>
              </Link>
              </button>
            )}

            {token && (
                            <button className='buttonPearl'>

              <Link className='wrap' to='/chatbot'>
              <p>
                    <span>
                <TbMessageChatbotFilled style={{ fontSize: '3em' }} />
                </span>
                    <span>Citas</span>
                    
                  </p>
              </Link>
              </button>
            )}
            {token && (
                            <button className='buttonPearl'>

              <Link className='wrap' to='/chatbot'>
              <p>
                    <span>
                <BsChatSquareTextFill style={{ fontSize: '3em' }} />
                </span>
                    <span>Chatbot</span>
                    
                  </p>
              </Link>
              </button>
            )}
            {token && (
                            <button className='buttonPearl'>

              <Link className='wrap' to='/contact-list'>
              <p>
                    <span className='wrap'>
                <PiPawPrintFill style={{ fontSize: '3em' }} />
                </span>
                    <span>Contactos de Emergencia</span>
                    
                  </p>
              </Link>
              </button>
            )}


          </div>
        </>
      ) : (
        <div>
          <h1>Por favor inicia sesión</h1>
          <Link to='/login'>Iniciar sesión</Link>
        </div>
      )}
    </div>
  );
};

export default HomeUser
