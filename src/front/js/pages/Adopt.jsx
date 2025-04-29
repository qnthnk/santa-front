import React, { useState } from "react";
import "../../styles/ContactList.css";
import { FaInfo } from "react-icons/fa";
import Dog1 from "../../img/adopt/dog1.jpg";
import Dog2 from "../../img/adopt/dog2.jpg";
import Dog3 from "../../img/adopt/dog3.jpg";
import Dog4 from "../../img/adopt/dog4.jpg";
import Dog5 from "../../img/adopt/dog5.jpg";
import Dog6 from "../../img/adopt/dog6.jpg";
import Dog7 from "../../img/adopt/dog7.jpg";
import Dog8 from "../../img/adopt/dog8.jpg";
import Dog9 from "../../img/adopt/dog9.jpg";
import Dog10 from "../../img/adopt/dog10.jpg";
import Dog11 from "../../img/adopt/dog11.jpg";

const dogs = [
    { question: "", answer: "", image: Dog1 },
    { question: "", answer: "", image: Dog2 },
    { question: "", answer: "", image: Dog3 },
    { question: "", answer: "", image: Dog4 },
    { question: "", answer: "", image: Dog5 },
    { question: "", answer: "", image: Dog6 },
    { question: "", answer: "", image: Dog7 },
    { question: "", answer: "", image: Dog8 },
    { question: "", answer: "", image: Dog9 },
    { question: "", answer: "", image: Dog10 },
    { question: "", answer: "", image: Dog11 }


   
]
const Adopt = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [modalImage, setModalImage] = useState(null);
  
    const toggleFAQ = (index) => {
      setOpenIndex(openIndex === index ? null : index);
    };
  
    return (
      <div className='containerRMCs' style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
      <div className='containerHs' style={{ textAlign: "center" }}>
      <div className='heroContact'>
      <form className="formContact">
      <h2 className='heading'>Adopta</h2>
      <div style={{ overflowY: "auto", maxHeight: "50vh", width: "90%", margin: "0 auto" }}>
      {dogs.map((dog, index) => (
      <div key={index} style={{ marginBottom: "20px" }}>
      <div
        className='inputContact submit'
        style={{ width: "100%", margin: "0 auto" }}
        onClick={() => toggleFAQ(index)}
      >
        <img
        src={dog.image}
        style={{ width: "100%", maxWidth: "600px", borderRadius: "20px", cursor: "pointer" }}
        onClick={() => setModalImage(dog.image)}
        />
      </div>
      </div>
      ))}
      </div>
      </form>
      </div>
      </div>
      {modalImage && (
      <div
      style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
      flexDirection: "column",
      }}
      
      >
      <img
      src={modalImage}
      style={{ width: "90%", maxWidth: "700px", maxHeight: "70vh", borderRadius: "10px" }}
      alt="Dog"
      />
      <button className="buttonPearl" style={{width:"120px", height:"50px", borderRadius:"20px", color:'white', marginTop: "20px"}} onClick={() => setModalImage(null)}>Cerrar</button>
      </div>
      )}
      </div>
    );
  };

export default Adopt;
