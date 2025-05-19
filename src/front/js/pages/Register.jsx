import React, { useState, useContext, useEffect, useRef } from 'react';
import { Context } from '../store/appContext';
import './../../styles/Register.css';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import ReCAPTCHA from 'react-google-recaptcha';

const Register = () => {
  const { store, actions } = useContext(Context);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const recaptchaRef = useRef(null);

  // Configuración de reCAPTCHA
  const RECAPTCHA_SITE_KEY = process.env.REACT_APP_RECAPTCHA_SITE_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI";

  // Estado del formulario (manteniendo todos tus campos originales)
  const [formData, setFormData] = useState({
    first_name: '',
    first_last_name: '',
    second_last_name: '',
    gender: '',
    birthdate: '',
    email: '',
    password: '',
    facebook: '',
    instagram: '',
    x: '',
    state: '',
    colonia_mex: '',
    house_number: '',
    street: '',
    zip_code: '',
    municipality: '',
    country:'',
    marriage_status: '',
    age: '',
    occupation: '',
    phone_number_home: '',
    phone_number_work: '',
    phone_number_mobile: '',
    reffered_by: '',
    latitude: '',
    longitude: ''
  });

  useEffect(() => {
    if (formData.birthdate) {
      const birthDate = new Date(formData.birthdate);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      setFormData(prevData => ({
        ...prevData,
        age: age.toString()
      }));
    }
  }, [formData.birthdate]);

  const [errors, setErrors] = useState({});
  const [matchingColonies, setMatchingColonies] = useState([]);
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handler para reCAPTCHA
  const onCaptchaChange = (token) => {
    setRecaptchaToken(token);
    if (errors.recaptcha) {
      setErrors(prev => ({ ...prev, recaptcha: undefined }));
    }
  };

  const resetRecaptcha = () => {
    setRecaptchaToken(null);
    if (recaptchaRef.current) {
      recaptchaRef.current.reset();
    }
  };

  // Validación del formulario (modificada para incluir reCAPTCHA en el paso 5)
  const validateForm = (currentStep) => {
    let newErrors = {};
    let genericLegend = "Completa este campo para continuar.";

    if (currentStep === 1) {
      if (!formData.first_name.trim()) newErrors.first_name = genericLegend;
      if (!formData.first_last_name.trim()) newErrors.first_last_name = genericLegend;
      if (!formData.second_last_name.trim()) newErrors.second_last_name = genericLegend;
      if (!formData.gender.trim()) newErrors.gender = genericLegend;
      if (!formData.birthdate.trim()) newErrors.birthdate = genericLegend;
      if (!formData.marriage_status.trim()) newErrors.marriage_status = genericLegend;
      if (!formData.occupation.trim()) newErrors.occupation = genericLegend;
    }

    if (currentStep === 2) {
      if (!formData.state.trim()) newErrors.state = genericLegend;
if (!formData.municipality.trim()) newErrors.municipality = genericLegend;

      if (!formData.street.trim()) newErrors.street = genericLegend;
      if (!formData.zip_code.trim()) {
        newErrors.zip_code = genericLegend;
      } else if (!/^\d{5}$/.test(formData.zip_code)) {
        newErrors.zip_code = "Ingrese un código postal válido de 5 dígitos.";
      } 
      if (!formData.country.trim()) newErrors.country = genericLegend;
    }

    if (currentStep === 3) {
      if (!formData.email.trim()) {
        newErrors.email = genericLegend;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Formato de email inválido.";
      }
      if (!formData.phone_number_mobile.trim()) {
        newErrors.phone_number_mobile = genericLegend;
      } else if (!/^\d{10}$/.test(formData.phone_number_mobile)) {
        newErrors.phone_number_mobile = "El teléfono debe contener 10 dígitos.";
      }
      
    }

    if (currentStep === 4) {
      if (!formData.password) {
        newErrors.password = genericLegend;
      } else if (formData.password.length < 8) {
        newErrors.password = "La contraseña debe tener al menos 8 caracteres.";
      }
      if (!recaptchaToken) {
        newErrors.recaptcha = "Por favor completa la verificación reCAPTCHA.";
      }
      
    }


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handlers originales (se mantienen igual)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prevErrors => ({ ...prevErrors, [name]: undefined }));
    }
    if (name === 'colonia_mex' && errors.colonia_mex) {
      setErrors(prevErrors => ({ ...prevErrors, colonia_mex: undefined }));
    }
  };


  const handleNext = () => {
    if (validateForm(step)) {
      setStep(step + 1);
    } else {
      console.log("Errores de validación impiden avanzar:", errors);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
    if (step === 4) {
      resetRecaptcha();
    }
  };

  // Handler de envío modificado para incluir reCAPTCHA
  const handleSubmit = async () => {
    setIsSubmitting(true);
    if (!validateForm(4)) {
      Swal.fire("Formulario incompleto", "Por favor complete los campos requeridos en el último paso.", "warning");
      setIsSubmitting(false);
      return;
    }

    let dataToSend = {
      ...formData,
      recaptcha_token: recaptchaToken
    };

    try {
      const result = await actions.register(dataToSend);
      Swal.fire({
        title: "¡Registro Exitoso!",
        text: "Serás redirigido al inicio de sesión.",
        icon: "success"
      }).then(() => {
        navigate('/login');
      });
    } catch (error) {
      console.error("Error en el registro:", error);
      resetRecaptcha();
      const errorMessage = error.response?.data?.message || error.message || "Ocurrió un error inesperado durante el registro.";
      Swal.fire("Error", errorMessage, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      console.error("La geolocalización no es soportada por este navegador.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setFormData((prevData) => ({
          ...prevData,
          latitude: latitude.toString(),
          longitude: longitude.toString()
        }));
      },
      (geoError) => {
        console.error("Error al obtener la ubicación: ", geoError);
      }
    );
  }, []);

  return (

    <div className='containerRMCs'>
      <div className='containerHs'>
        <h3 className='heading'>Completa el siguiente formulario para inscribirte</h3>
        <div className="heroContact">
          <form className='formContact' onSubmit={(e) => e.preventDefault()} noValidate>
            {step === 1 && (
              <div>
                <h3 className='heading'>Paso 1: Datos Generales</h3>
                <input className={`inputContacts ${errors.first_name ? 'input-error' : ''}`} type="text" name="first_name" placeholder='Nombre(s)' value={formData.first_name} onChange={handleChange} />
                {errors.first_name && <p className="error-text">{errors.first_name}</p>}
                <input className={`inputContacts ${errors.first_last_name ? 'input-error' : ''}`} type="text" name="first_last_name" placeholder='Apellido Paterno' value={formData.first_last_name} onChange={handleChange} />
                {errors.first_last_name && <p className="error-text">{errors.first_last_name}</p>}
                <input className={`inputContacts ${errors.second_last_name ? 'input-error' : ''}`} type="text" name="second_last_name" placeholder='Apellido Materno' value={formData.second_last_name} onChange={handleChange} />
                {errors.second_last_name && <p className="error-text">{errors.second_last_name}</p>}
                <select
                  className={`inputContacts ${errors.gender ? 'input-error' : ''}`}
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="">Seleccione su género</option>
                  <option value="masculino">Masculino</option>
                  <option value="femenino">Femenino</option>
                </select>
                {errors.gender && <p className="error-text">{errors.gender}</p>}
                <input className={`inputContacts ${errors.birthdate ? 'input-error' : ''}`} type="date" name="birthdate" placeholder='Fecha de Nacimiento' value={formData.birthdate} onChange={handleChange} />
                {errors.birthdate && <p className="error-text">{errors.birthdate}</p>}
                <div>
                  <p>Edad: {formData.age} años</p>
                </div>
                <select
                  className={`inputContacts ${errors.marriage_status ? 'input-error' : ''}`}
                  name="marriage_status"
                  value={formData.marriage_status}
                  onChange={handleChange}
                >
                  <option value="">Seleccione su estado civil</option>
                  <option value="soltera/o">Soltera/o</option>
                  <option value="casada/o">Casada/o</option>
                  <option value="divorciada/o">Divorciada/o</option>
                  <option value="viuda/o">Viuda/o</option>
                  <option value="union libre">Union libre</option>
                  <option value="separada/o">Separada/o</option>
                  <option value="no especificado">No especificado</option>
                  <option value="otro">Otro</option>
                  <option value="prefiero no decir">Prefiero no decir</option>
                </select>
                {errors.marriage_status && <p className="error-text">{errors.marriage_status}</p>}
                <input className={`inputContacts ${errors.occupation ? 'input-error' : ''}`} type="text" name="occupation" placeholder='Ocupación (opcional)' value={formData.occupation} onChange={handleChange} />
                {errors.occupation && <p className="error-text">{errors.occupation}</p>}
                <button className='buttonPearl' style={{ width: "120px", height: "50px", borderRadius: "20px", color: 'white' }} type="button" onClick={handleNext}>Siguiente</button>
              </div>
            )}

            {step === 2 && (
              <div>
                <h3 className='heading'>Paso 2: Dirección</h3>
                <input className={`inputContacts ${errors.country ? 'input-error' : ''}`} type="text" name="country" placeholder='País (opcional)' value={formData.country} onChange={handleChange} />
                {errors.country && <p className="error-text">{errors.country}</p>}
                <input
                  className={`inputContacts ${errors.state ? 'input-error' : ''}`}
                  type="text"
                  name="state"
                  placeholder='Estado (opcional)'
                  value={formData.state}
                  onChange={handleChange}
                />
                {errors.state && <p className="error-text">{errors.state}</p>}

                <input
                  className={`inputContacts ${errors.zip_code ? 'input-error' : ''}`}
                  type="text"
                  inputMode='numeric'
                  name="zip_code"
                  placeholder='Código Postal (5 dígitos)'
                  value={formData.zip_code}
                  onChange={handleChange}
                />
                {errors.zip_code && <p className="error-text">{errors.zip_code}</p>}
                <input
                  className={`inputContacts ${errors.municipality ? 'input-error' : ''}`}
                  type="text"
                  name="municipality"
                  placeholder='Municipio'
                  value={formData.municipality}
                  onChange={handleChange}
                />
                {errors.municipality && <p className="error-text">{errors.municipality}</p>}
                <input
                  className={`inputContacts ${errors.colonia_mex ? 'input-error' : ''}`}
                  name="colonia_mex"
                  value={formData.colonia_mex}
                  onChange={handleChange} 
                  placeholder='Colonia'
                  type='text'
                  />
                {errors.colonia_mex && <p className="error-text">{errors.colonia_mex}</p>}


                <input
                  className={`inputContacts ${errors.street ? 'input-error' : ''}`}
                  type="text"
                  name="street"
                  placeholder='Calle y Número Ext./Int.'
                  value={formData.street}
                  onChange={handleChange}
                />
                {errors.street && <p className="error-text">{errors.street}</p>}
                <input
                  className={`inputContacts ${errors.house_number ? 'input-error' : ''}`}
                  type="text"
                  name="house_number"
                  placeholder='Número de casa'
                  value={formData.house_number}
                  onChange={handleChange}
                />
                {errors.house_number && <p className="error-text">{errors.house_number}</p>}

                <button className='buttonPearl' style={{ width: "120px", height: "50px", borderRadius: "20px", color: 'white' }} type="button" onClick={handleBack}>Atrás</button>
                <button className='buttonPearl' style={{ width: "120px", height: "50px", borderRadius: "20px", color: 'white' }} type="button" onClick={handleNext}>Siguiente</button>
              </div>
            )}

            {step === 3 && (
              <div>
                <h3 className='heading'>Paso 3: Datos de Contacto</h3>
                <input className={`inputContacts ${errors.email ? 'input-error' : ''}`} type="email" name="email" placeholder='Email' value={formData.email} onChange={handleChange} />
                {errors.email && <p className="error-text">{errors.email}</p>}
                <input className='inputContacts' type="text" name="phone_number_home" placeholder='Teléfono (10 dígitos)' value={formData.phone_number_home} onChange={handleChange} />
                <input className='inputContacts' type="text" name="phone_number_work" placeholder='Teléfono de trabajo (opcional)' value={formData.phone_number_work} onChange={handleChange} />
                <input className={`inputContacts ${errors.phone_number_mobile ? 'input-error' : ''}`} type="text" name="phone_number_mobile" placeholder='Teléfono móvil (10 dígitos)' value={formData.phone_number_mobile} onChange={handleChange} />
                {errors.phone_number_mobile && <p className="error-text">{errors.phone_number_mobile}</p>}
                <input className='inputContacts' type="text" name="facebook" placeholder='Usuario Facebook (opcional)' value={formData.facebook} onChange={handleChange} />
                <input className='inputContacts' type="text" name="instagram" placeholder='Usuario Instagram (opcional)' value={formData.instagram} onChange={handleChange} />
                <input className='inputContacts' type="text" name="x" placeholder='Usuario X / Twitter (opcional)' value={formData.x} onChange={handleChange} />
                <button className='buttonPearl' style={{ width: "120px", height: "50px", borderRadius: "20px", color: 'white' }} type="button" onClick={handleBack}>Atrás</button>
                <button className='buttonPearl' style={{ width: "120px", height: "50px", borderRadius: "20px", color: 'white' }} type="button" onClick={handleNext}>Siguiente</button>
              </div>
            )}

            {step === 4 && (
              <div>
              <h3 className='heading'>Paso 5: Finalizar Registro</h3>
              <input className={`inputContacts ${errors.password ? 'input-error' : ''}`} type="password" name="password" placeholder='Crear contraseña (mín. 8 caracteres)' value={formData.password} onChange={handleChange} />
              {errors.password && <p className="error-text">{errors.password}</p>}

              <div className="recaptcha-container">
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={RECAPTCHA_SITE_KEY}
                  onChange={onCaptchaChange}
                />
                {errors.recaptcha && <p className="error-text">{errors.recaptcha}</p>}
              </div>

              <button className='buttonPearl' style={{ width: "120px", height: "50px", borderRadius: "20px", color: 'white' }} type="button" onClick={handleBack}>Atrás</button>
              <button
                type="button"
                className="buttonPearl"
                style={{ width: "120px", height: "50px", borderRadius: "20px", color: 'white' }}
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Registrando...' : 'Registrarse'}
              </button>
            </div>
            )}
          </form>
        </div>
      </div>
      <br />
      <br />
    </div>
  );
};

export default Register;