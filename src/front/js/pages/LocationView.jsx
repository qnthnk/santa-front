import React, { useEffect, useState, useContext } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { Context } from "../store/appContext";
import "../../styles/home.css";
import { RiHome6Fill } from "react-icons/ri";
import Swal from 'sweetalert2';
import { FaInfo } from "react-icons/fa";



const libraries = ["places"];
const mapContainerStyle = { width: "100%", height: "350px" };

const LocationView = () => {
    const { store, actions } = useContext(Context);
    const [selectedType, setSelectedType] = useState(null);

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.GOOGLE_MAPS_API,
        libraries,
    });

    useEffect(() => {
        if (store.userLocation) {
            console.log("Ubicación detectada:", store.userLocation);
        }
    }, [store.userLocation]);

    useEffect(() => {
        if (selectedType && store.userLocation) {
            actions.fetchNearbyPlaces(selectedType);
        }
    }, [selectedType, store.userLocation]);

    if (loadError) return <p>Error cargando el mapa</p>;
    if (!isLoaded) return <p>Cargando mapa...</p>;

    return (
        <div className='containerRMC'>
            {!isLoaded ? (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                        height: "100vh",
                        position: "absolute",
                        backgroundColor: "rgba(255, 255, 255, 0.8)",
                        zIndex: 10,
                    }}
                >
                    <p style={{ fontSize: "1.5rem", fontWeight: "bold", color:"black" }}>Cargando...</p>
                </div>
            ) : null}
          <div className='containerH'>
      <div className="formContact">
                {!isLoaded ? (
                    <div className='inputContact'
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                        height: "100%",
                        position: "absolute",
                        backgroundColor: "rgba(255, 255, 255, 0.8)",
                        zIndex: 10
                    }}>
                        <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>Cargando...</p>
                    </div>
                ) : (
                    <>
                                                <div className="inputContact " style={{ width: "90vw", maxHeight:"90vh", display: "flex", flexDirection: "column", alignItems: "center"}}>
                                                    <GoogleMap
                                                        mapContainerStyle={mapContainerStyle}
                                                        center={store.userLocation}
                                                        zoom={14}
                                                    >
                                                        {store.userLocation && <Marker position={store.userLocation} />}
                                                        {store.nearbyPlaces?.map((place, index) => (
                                                            place.location && (
                                                                <Marker
                                                                    key={index}
                                                                    position={{
                                                                        lat: place.location.latitude,
                                                                        lng: place.location.longitude,
                                                                    }}
                                                                    onClick={() =>
                                                                        Swal.fire(
                                                                            `${place.displayName?.text || "Sin nombre"}\nDirección: ${place.formattedAddress}\nTeléfono: ${place.internationalPhoneNumber || "No disponible"}`
                                                                        )
                                                                    }
                                                                />
                                                            )
                                                        ))}
                                                    </GoogleMap>
                                                    <div className="" style={{ display: "flex", justifyContent: "center", marginTop: "10px", width:"80vw" }}>
                                                        <button className="buttonPearl" style={{width:"120px", height:"50px", borderRadius:"20px", color:'white'}} onClick={() => setSelectedType("hospital")}>Hospitales</button>
                                                        <button className="buttonPearl" style={{width:"120px", height:"50px", borderRadius:"20px", color:'white'}} onClick={() => setSelectedType("police")}>Policía</button>
                                                        <button className="buttonPearl" style={{width:"120px", height:"50px", borderRadius:"20px", color:'white'}} onClick={() => setSelectedType("city_hall")}>Gobierno</button>
                                                    </div>

                                                    
                        </div>
                        <div className="inputContact " style={{ borderRadius: "none", textAlign: "center", color:"black", maxHeight:"30vh", overflowY:"auto"}}>
                                                        {store.nearbyPlaces.length > 0 ? (
                                                            store.nearbyPlaces.map((place, index) => (
                                                                <div key={index} >
                                                                    <h2>{place.displayName?.text || "Sin nombre"}</h2>
                                                                    <p>{place.formattedAddress || "Dirección desconocida"}</p>
                                                                    {place.internationalPhoneNumber && (
                                                                        <p>Teléfono: {place.internationalPhoneNumber}</p>
                                                                        
                                                                    )}
                                                                    <hr />
                                                                </div>
                                                            ))
                                                        ) : (
                                    // PENDIENTE ARREGLAR ESTILO DEL TEXTO
                                    <h5 style={{}}>Presione la opción que desee para obtener las ubicaciones</h5>
                                )}
                            </div>
                    </>
                )}
         
            </div>
            </div>
            </div>
    );
};

export default LocationView;