import React, { useContext, useState, useEffect } from 'react';
import { Context } from '../store/appContext';
import Swal from 'sweetalert2';
import './../../styles/home.css';

const EmergencyButton = () => {
    const { actions } = useContext(Context);
    const [loading, setLoading] = useState(false);
    const [showCountdown, setShowCountdown] = useState(false);
    const [countdown, setCountdown] = useState(5);
    const [geolocationError, setGeolocationError] = useState(null);
    const [isDeviceConnected, setIsDeviceConnected] = useState(false);
    const [skipDeviceConfig, setSkipDeviceConfig] = useState(false);
    const [hasChosenDeviceOption, setHasChosenDeviceOption] = useState(false);



    const connectPreferredDevice = async () => {
        const preferredDeviceId = localStorage.getItem('preferredDeviceId');
        if (!preferredDeviceId) return;

        try {
            const devices = await navigator.bluetooth.getDevices();
            const device = devices.find(d => d.id === preferredDeviceId);

            if (device) {
                console.log('Dispositivo preferido encontrado:', device.name);

                device.addEventListener('gattserverdisconnected', () => {
                    console.log('¡Dispositivo desconectado!');
                    setIsDeviceConnected(false);
                    Swal.fire({
                        title: '¡Emergencia detectada!',
                        text: 'El dispositivo BLE se desconectó. Enviando alerta...',
                        icon: 'warning',
                        timer: 3000,
                        timerProgressBar: true,
                        showConfirmButton: false
                    });
                    handleEmergencia();
                });

                if (!device.gatt.connected) {
                    await device.gatt.connect();
                }

                setIsDeviceConnected(true);

                Swal.fire({
                    title: '¡Dispositivo preferido conectado!',
                    text: `Se conectó automáticamente a ${device.name}.`,
                    icon: 'success',
                    confirmButtonText: 'Entendido',
                    confirmButtonColor: '#28a745'
                });
            }
        } catch (error) {
            console.error('Error al conectar con el dispositivo preferido:', error);
        }
    };

    useEffect(() => {
        connectPreferredDevice();
    }, []);

    const getLocation = () => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocalización no soportada'));
                return;
            }

            navigator.geolocation.getCurrentPosition(
                position => resolve(position),
                error => {
                    let errorMessage = 'Error al obtener ubicación';
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            errorMessage = 'Permiso de ubicación denegado';
                            break;
                        case error.POSITION_UNAVAILABLE:
                            errorMessage = 'Información de ubicación no disponible';
                            break;
                        case error.TIMEOUT:
                            errorMessage = 'Tiempo de espera agotado';
                            break;
                    }
                    reject(new Error(errorMessage));
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                }
            );
        });
    };

    const requestDevice = async () => {
        setLoading(true); // 👈 Mostrar spinner al iniciar
        try {
            const device = await navigator.bluetooth.requestDevice({
                acceptAllDevices: true,
                optionalServices: ['battery_service']
            });
    
            localStorage.setItem('preferredDeviceId', device.id);
    
            device.addEventListener('gattserverdisconnected', () => {
                console.log('¡Dispositivo desconectado!');
                setIsDeviceConnected(false);
                Swal.fire({
                    title: '¡Emergencia detectada!',
                    text: 'El dispositivo BLE se desconectó. Enviando alerta...',
                    icon: 'warning',
                    timer: 3000,
                    timerProgressBar: true,
                    showConfirmButton: false
                });
                handleEmergencia();
            });
    
            const server = await device.gatt.connect();
            const service = await server.getPrimaryService('battery_service');
            const characteristic = await service.getCharacteristic('battery_level');
    
            await characteristic.startNotifications();
            characteristic.addEventListener('characteristicvaluechanged', (event) => {
                const value = event.target.value.getUint8(0);
                console.log('Nivel de batería actualizado:', value);
            });
    
            setIsDeviceConnected(true);
    
            await Swal.fire({
                title: '¡Dispositivo sincronizado!',
                html: `
                    <div style="text-align: left;">
                        <p><strong>Tu dispositivo BLE ha sido sincronizado correctamente.</strong></p>
                        <p>Ahora puedes usar el <strong>botón físico</strong> para activar una emergencia.</p>
                    </div>
                `,
                icon: 'success',
                confirmButtonText: 'Entendido',
                confirmButtonColor: '#28a745'
            });
        } catch (error) {
            console.error('Error en conexión/dispositivo:', error);
            await Swal.fire({
                title: 'Error al sincronizar',
                text: 'No se pudo conectar con el dispositivo BLE. Inténtalo de nuevo.',
                icon: 'error',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#d33'
            });
        } finally {
            setLoading(false); // 👈 Ocultar spinner al finalizar
        }
    };
    

    const handleEmergencia = async () => {
        setLoading(true);
        setGeolocationError(null);

        try {
            const position = await getLocation();
            const latitude = position.coords.latitude.toString();
            const longitude = position.coords.longitude.toString();
            const user_id = localStorage.getItem('id');

            if (!user_id) {
                throw new Error('No se pudo identificar al usuario');
            }

            const result = await actions.sendEmergencyCoordinates(latitude, longitude, user_id);
            showSuccessAlert(latitude, longitude, result.contacts_notified);
        } catch (error) {
            handleEmergencyError(error);
        } finally {
            setLoading(false);
        }
    };

    const showSuccessAlert = (latitude, longitude, contactsNotified) => {
        Swal.fire({
            title: '¡Alerta enviada!',
            html: `
                <div className="containerRMCs">
                    <div className="containerHs">
                        <div style="text-align: left;">
                            <p>Se notificó a <strong>${contactsNotified} contactos</strong>.</p>
                            <p><strong>Tu ubicación actual:</strong></p>
                            <ul>
                                <li>Latitud: ${latitude}</li>
                                <li>Longitud: ${longitude}</li>
                            </ul>
                            <a href="https://www.google.com/maps?q=${latitude},${longitude}" 
                               target="_blank" 
                               style="color: #d33; font-weight: bold; text-decoration: underline;">
                                Ver en Google Maps
                            </a>
                            <p style="margin-top: 15px; font-size: 0.9em; color: #555;">
                                Los contactos recibieron tus datos médicos importantes.
                            </p>
                        </div>
                    </div>
                </div>
            `,
            icon: 'success',
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#28a745'
        });
    };

    const handleEmergencyError = (error) => {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            html: `
                <p>${error.message}</p>
                ${geolocationError ?
                    '<p style="font-size: 0.9em;">Por favor habilita los permisos de ubicación en tu navegador.</p>' :
                    '<p style="font-size: 0.9em;">Intenta nuevamente o contacta al soporte.</p>'
                }
            `,
            confirmButtonText: 'Aceptar'
        });
    };
    useEffect(() => {
        const skipped = localStorage.getItem('deviceConfigSkipped') === 'true';
        if (skipped) {
            setSkipDeviceConfig(true);
        }
        connectPreferredDevice();
    }, []);
    

    useEffect(() => {
        let timer;
        if (showCountdown && countdown > 0) {
            timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        } else if (countdown === 0 && showCountdown) {
            handleEmergencia();
            setShowCountdown(false);
        }
        return () => clearTimeout(timer);
    }, [showCountdown, countdown]);

    return (
        <>
       {!hasChosenDeviceOption && (
    <button
        onClick={() => {
            Swal.fire({
                title: "¿Tienes un dispositivo para vincular?",
                icon: "question",
                showCancelButton: true,
                confirmButtonColor: "#28a745",
                cancelButtonColor: "#6c757d",
                confirmButtonText: "Sí, vincular dispositivo",
                cancelButtonText: "No, continuar sin vincular",
                focusCancel: true
            }).then((result) => {
                setHasChosenDeviceOption(true);
                localStorage.setItem('deviceConfigSkipped', result.isConfirmed ? 'false' : 'true'); // Oculta el botón
                if (result.isConfirmed) {
                    requestDevice();
                } else {
                    setSkipDeviceConfig(true);
                }
            });
        }}
        className="buttonPearlWT"
        style={{ backgroundColor: 'info' }}
    >
        Configurar dispositivo
    </button>
)}


{isDeviceConnected || skipDeviceConfig ? (
    <button
        onClick={() => {
            Swal.fire({
                title: "¿Estás en emergencia?",
                html: `
                    <div style="text-align: left;">
                        <p>Al confirmar, se enviará una alerta a:</p>
                        <ul>
                            <li>Todos tus contactos de emergencia</li>
                            <li>Con tu ubicación exacta en tiempo real</li>
                            <li>Tus datos médicos importantes</li>
                        </ul>
                        <p style="color: #d33; font-weight: bold; margin-top: 15px;">
                            Esta acción no puede deshacerse.
                        </p>
                    </div>
                `,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#6c757d",
                confirmButtonText: "Sí, necesito ayuda",
                cancelButtonText: "Cancelar",
                focusCancel: true
            }).then((result) => {
                if (result.isConfirmed) {
                    setShowCountdown(true);
                    setCountdown(5);
                }
            });
        }}
        className={`buttonPearlW ${loading ? 'disabled' : ''}`}
        disabled={loading}
    >
        <i className="fas fa-exclamation-triangle me-2"></i>
        {loading ? 'Enviando...' : 'Botón de Emergencia'}
        <i className="fas fa-exclamation-triangle me-2"></i>
    </button>
) : (
   <></>
)}


            {showCountdown && (
                <div className="modal-overlay">
                    <div className="modal-contentE" style={{ borderRadius: '50px' }}>
                        <h1>Enviando alerta en...{countdown}</h1>
                        <p className="countdown">
                            <button
                                className="buttonPearlAdmin"
                                style={{ color: 'white', height: '100px', width: '150px', borderRadius: '50px' }}
                                onClick={() => {
                                    setShowCountdown(false);
                                    setCountdown(5);
                                }}
                            >
                                Cancelar
                            </button>
                        </p>
                    </div>
                </div>
            )}
        </>
    );
};

export default EmergencyButton;
