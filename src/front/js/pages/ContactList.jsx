import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import AddContact from "../component/AddContact.jsx";
import ViewContact from "../component/ViewContact.jsx";
import "../../styles/ContactList.css"
import { FaInfo } from "react-icons/fa";

const ContactList = () => {
  const { actions } = useContext(Context);
  const [view, setView] = useState(null);

  // Cargar los contactos al montar el componente
  useEffect(() => {
    actions.viewContacts();
  }, []);

  const toggleView = (viewName) => {
    setView(view === viewName ? null : viewName);
  };

  return (
    <div className="containerRMC">
      <div className="containerH">

        <div className="heroContact" >
          <form className="formContact">
            <button
              type="button"
              className="inputContact submit"
              onClick={() => toggleView("add")}
            >
              Agregar contacto
            </button>
            <button
              type="button"
              className="inputContact submit"
              onClick={() => toggleView("view")}
            >
              Ver contactos
            </button>
            <div style={{ overflowY: "auto", maxHeight: "40vh", minWidth: "80vw" }}>
              {view === "view" && <ViewContact />}
            </div>
            <div style={{ overflowY: "auto", maxHeight: "60vh" }}>
              {view === "add" && <AddContact />}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactList;
