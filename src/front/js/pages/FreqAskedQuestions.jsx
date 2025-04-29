import { Link } from 'react-router-dom';

import React, { useState } from 'react';
import "../../styles/home.css";
import { FaInfo } from "react-icons/fa";

const faqs = [
  { question: "Transporte", answer: "Datos sobre rutas de camiones y sitios de taxi seguros." },
  {
    question: "Números de emergencia",
    answer: (
      <ul>
        <li>911 - Emergencias</li>
      </ul>
    )
  },
  { question: "Programas de Gobierno", answer: "Programas y requisitos." },
  {
    question: "Links",
    answer: <a href="https://www.onmprinacional.org/" target="_blank" rel="noopener noreferrer">https://www.onmprinacional.org/</a>
  },
  { question: "Novedades", answer: "Servicios que actualmente están disponibles como albercas o pistas de hielo." },
  { question: "Otros", answer: <>Puedes consultar nuestro <Link to="/chatbot">Chatbot</Link>.</> },
];

const FreqAskedQuestions = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className='containerRMCs'>
      <div className='containerHs'>
        <div className='heroContact'>
          <form className="formContact">
            <h2 className='heading'>Entérate</h2>
            <div style={{ overflowY: "auto", maxHeight: "50vh", minWidth: "65vw", textAlign: "center" }}>
              {faqs.map((faq, index) => (
                <div key={index}>
                  <div
                    className='inputContact submit'
                    style={{
                      width: "65vw",
                      backgroundColor: openIndex === index ? "rgb(133,66,166)" : "transparent", // Change background color when active
                      color: openIndex === index ? "white" : "rgb(120, 117, 117)", // Change text color when active
                      textAlign: "center", // Center text
                    }}
                    onClick={() => toggleFAQ(index)}
                  >
                    <h5>{faq.question}</h5>
                  </div>

                  <div className={`collapse ${openIndex === index ? 'show' : ''}`}>
                    <div
                      className='inputContacts'
                      style={{
                        width: "65vw",
                        backgroundColor: "white",
                        textAlign: "center", // Center text
                      }}
                    >
                      {faq.answer}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FreqAskedQuestions;