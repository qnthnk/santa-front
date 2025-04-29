import React, { useState, useEffect, useContext } from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import { Context } from '../store/appContext';

const mapContainerStyle = {
    width: '100%',
    height: '300px'
};

const Expediente = () => {
    const { actions } = useContext(Context);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.GOOGLE_MAPS_API,
    });

    useEffect(() => {
        const loadUsers = async () => {
            setLoading(true);
            try {
                const usersData = await actions.getAllUsers();
                setUsers(usersData);
            } catch (error) {
                console.error("Error cargando usuarios:", error);
            } finally {
                setLoading(false);
            }
        };
        loadUsers();
    }, []);

    const handleSelectUser = (userId) => {
        const user = users.find(u => u.id === userId);
        setSelectedUser(user);
    };

    const formatField = (value) => value || 'No especificado';

    return (
        
        <div className='containerRMCs' style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
            
            <div className='containerHs' style={{ textAlign: "center" }}>
                <div className='heroContact'>
                    <form className="formContact" style={{ overflowY: 'auto' }}>
                        <h2 className='heading'>Expediente</h2>
                        <div style={{ overflowY: "auto", maxHeight: "50vh", width: "90%", margin: "0 auto" }}>
                            <div className="inputContacts">
                                <label className="heading">Seleccione un Usuario</label>
                                <select
                                    className="form-select"
                                    onChange={(e) => handleSelectUser(parseInt(e.target.value))}
                                    disabled={loading}
                                >
                                    <option value="">-- Seleccione un usuario --</option>
                                    {users.map(user => (
                                        <option key={user.id} value={user.id}>
                                            {user.first_name} {user.first_last_name} ({user.email})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {loading && (
                            <div className="text-center my-4">
                                <div className="spinner-border" role="status">
                                    <span className="visually-hidden">Cargando...</span>
                                </div>
                            </div>
                        )}

                        {selectedUser && (
                            <div className="containerH" style={{ maxWidth: "80vw", maxHeight: "50vw", height: "auto", overflowY: "auto" }}>
                                <div className="modal-body">
                                    <h3 className='heading'>{selectedUser.first_name} {selectedUser.first_last_name}</h3>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <h5>Datos Personales</h5>
                                            <p><strong>Nombre:</strong> {selectedUser.first_name}</p>
                                            <p><strong>Apellido Paterno:</strong> {selectedUser.first_last_name}</p>
                                            <p><strong>Apellido Materno:</strong> {selectedUser.second_last_name}</p>
                                            <p><strong>CURP:</strong> {selectedUser.curp}</p>
                                            <p><strong>Género:</strong> {selectedUser.gender}</p>
                                            <p><strong>Fecha Nacimiento:</strong> {formatField(selectedUser.birthdate)}</p>

                                            <h5 className="mt-4">Contacto</h5>
                                            <p><strong>Email:</strong> {selectedUser.email}</p>
                                            <p><strong>Teléfono:</strong> {selectedUser.phone_number}</p>
                                            <p><strong>Facebook:</strong> {formatField(selectedUser.facebook)}</p>
                                            <p><strong>Instagram:</strong> {formatField(selectedUser.instagram)}</p>
                                            <p><strong>Twitter/X:</strong> {formatField(selectedUser.x)}</p>
                                        </div>

                                        <div className="col-md-6">
                                            <h5>Información Médica</h5>
                                            <p><strong>Tipo de Sangre:</strong> {formatField(selectedUser.blood_type)}</p>
                                            <p><strong>Alergias:</strong> {formatField(selectedUser.allergy)}</p>
                                            <p><strong>Enfermedades:</strong> {formatField(selectedUser.disease)}</p>

                                            <h5 className="mt-4">Dirección</h5>
                                            <p><strong>Calle:</strong> {selectedUser.street} #{selectedUser.house_number}</p>
                                            <p><strong>Colonia:</strong> {selectedUser.colonia_mex}</p>
                                            <p><strong>Municipio:</strong> {selectedUser.nombre_municipio}</p>
                                            <p><strong>Estado:</strong> {selectedUser.state}</p>
                                            <p><strong>Código Postal:</strong> {selectedUser.zip_code}</p>
                                            <p><strong>Sección:</strong> {selectedUser.seccion}</p>
                                            <p><strong>Distrito Federal:</strong> {selectedUser.distrito_federal}</p>
                                            <p><strong>Distrito Local:</strong> {selectedUser.distrito_local}</p>
                                            <p><strong>Tipo Sección:</strong> {selectedUser.tipo_seccion}</p>
                                            <p className="text-danger mt-4">
                                                <strong>Nota:</strong> Esta es una versión demo. Los usuarios han sido generados aleatoriamente por IA, y las coordenadas proporcionadas pueden no corresponder a ubicaciones en tierra.
                                            </p>

                                            {(() => {
                                                const lat = parseFloat(selectedUser.latitude);
                                                const lng = parseFloat(selectedUser.longitude);
                                                return (
                                                        <GoogleMap
                                                            mapContainerStyle={mapContainerStyle}
                                                            center={{ lat, lng }}
                                                            zoom={14}
                                                        >
                                                             <Marker
                                                                    position={{
                                                                        lat: lat,
                                                                        lng: lng,
                                                                    }}
                                                                    onClick={() =>
                                                                        Swal.fire(
                                                                            `${place.displayName?.text || "Sin nombre"}\nDirección: ${place.formattedAddress}\nTeléfono: ${place.internationalPhoneNumber || "No disponible"}`
                                                                        )
                                                                    }
                                                                />
                                                        </GoogleMap>
                                                ) ;
                                            })()}

                                            <p><strong>Coordenadas:</strong> {formatField(selectedUser.latitude)}, {formatField(selectedUser.longitude)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Expediente;
