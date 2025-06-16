"use client";
import { useContext, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import Link from "next/link";
import Terms_and_Condition from "@/components/user/perfil/functions/terminos_condiciones";
import { urlBackGlobal } from "@/constants/constants_backend";
import { Context } from "@/app/providers";

export default function Register() {
  const serverBack = urlBackGlobal;
  const router = useRouter();

  const [passwordVisiblie, setPasswordVisible] = useState("password");
  const passwordVisFunction = async (e) => {
    e.preventDefault();
    if (passwordVisiblie === "password") {
      setPasswordVisible("text");
      setTimeout(() => {
        setPasswordVisible("password");
      }, 3000);
    }
  };
  //estados de visibilidad
  const [enableButton, setEnableButton] = useState(false);
  const [showTerms, setShowTerms] = useState('none');
  const {csrf, pais} = useContext(Context);

  //registro mediante el form
  const refForm = useRef();
  const registrarUsuario = async () => {
    if (!refForm.current.reportValidity()) return;
    const dataForm = new FormData(refForm.current);
    const { password, passConfirm } = Object.fromEntries(dataForm.entries());
    if (password !== passConfirm) {
      await Swal.fire({
        title: "LAS CONTRASENAS NO COINCIDEN",
        text: "",
        icon: "warning",
      }); return;
    }
    dataForm.delete('passConfirm');
    const data = Object.fromEntries(dataForm.entries());

    if (data.pais === "default") {
      await Swal.fire({
        title: "DEBE SELECCIONAR UN PAIS",
        text: "",
        icon: "warning",
      });
      return;
    }
    const response = await fetch(serverBack + "/api/usuarios-c/register", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        "X-XSRF-Token": csrf
      },
      credentials: "include"
    });
    const res = await response.json();
    if (response.status === 409) {
      await Swal.fire({
        title: "ERROR",
        text: res.message,
        icon: "error",
      });
      return;
    };
    if (response.status === 400) {
      await Swal.fire({
        title: "ERROR",
        text: res.message,
        icon: "error",
      });
      return;
    }
    if (response.ok) {
      await Swal.fire({
        title: "CUENTA CREADA",
        text: "Por Favor, inicia sesion",
        icon: "success",
      });
      router.push("/user/login");
    } else {
      await Swal.fire({
        title: "ERROR",
        text: "No se pudo crear la cuenta\n" + res.message,
        icon: "error",
      });
    }
  }

  //componente
  return (
    <section className="container w-75 text-white form-container" style={{ marginBottom: "10%" }}>
      <form className="row g-3 needs-validation" noValidate ref={refForm}>
        <h3 className="text-center">REGISTRO</h3>
        <div className="col-md-4">
          <label htmlFor="validationCustom01" className="form-label">
            Nombres
          </label>
          <input
            name="nombre"
            type="text"
            className="form-control"
            id="validationCustom01"
            placeholder="Ingres su nombre"
            required
            maxLength="50"
          />
        </div>
        <div className="col-md-4">
          <label htmlFor="validationCustom02" className="form-label">
            Apellidos
          </label>
          <input
            name="apellido"
            type="text"
            className="form-control"
            id="validationCustom02"
            placeholder="Ingrese su apellido"
            required
            maxLength="50"
          />
          <div className="valid-feedback">Looks good!</div>
        </div>
        <div className="col-md-4">
          <label htmlFor="validationCustomUsername" className="form-label">
            Nombre de Usuario
          </label>
          <div className="input-group has-validation">
            <span className="input-group-text bg-dark" id="inputGroupPrepend">
              @
            </span>
            <input
              name="nom_usuario"
              placeholder="Example123"
              type="text"
              className="form-control"
              id="validationCustomUsername"
              aria-describedby="inputGroupPrepend"
              required
              maxLength="50"
            />
            <div className="invalid-feedback">Please choose a username.</div>
          </div>
        </div>
        <div className="col-12">
          <label>Correo Electronico</label>
          <input
            className="form-control"
            name="email"
            type="email"
            placeholder="example@gmail.com"
            required
            maxLength="50"
          ></input>
        </div>

        <div className="col-md-6 col-12">
          <label>Contraseña</label>
          <div className="d-flex">
            <input
              className="form-control input-pass"
              name="password"
              type={passwordVisiblie}
              required
              maxLength="100"
              minLength="8"
            ></input>
          </div>
        </div>

        <div className="col-md-6 col-12">
          <label>Confirmar Constraseña</label>
          <div className="d-flex">
            <input
              className="form-control input-pass"
              type={passwordVisiblie}
              name="passConfirm"
              required
              maxLength="100"
              minLength="8"
            />
            <button className="btn bg-dark btn-eye" onClick={(e) => passwordVisFunction(e)}>
              <i className="bi bi-eye"></i>
            </button>
          </div>
        </div>
        <div className="col-6 col-md-4">
          <label className="">TIPO</label>
          <br />
          <select className="form-select" name="rol" required defaultValue={"usuario"}>
            <option value="usuario">
              USUARIO
            </option>
            <option value="empresa">EMPRESA</option>
          </select>
        </div>

        <div className="col-6 col-md-4">
          <label>PAIS</label>
          <br />
          <select className="form-select" required name="pais" defaultValue={pais??""}>
            <option value="">
              --Seleccionar--
            </option>
            <option value="Chile">Chile</option>
            <option value="Peru">Peru</option>
            <option value="Bolivia">Bolivia</option>
            <option value="Argentina">Argentina</option>
            <option value="Colombia">Colombia</option>
            <option value="Ecuador">Ecuador</option>
            <option value="Paraguay">Paraguay</option>
            <option value="Uruguay">Uruguay</option>
          </select>
        </div>
        <div className="col-12">
          <div className="form-check">
            <input
              className="form-check-input p-0"
              type="checkbox"
              value=""
              id="invalidCheck"
              onChange={(e) => {
                setEnableButton(e.target.checked);
              }}
            />
            <a className="text-white" style={{ cursor: "pointer" }} htmlFor="invalidCheck" onClick={(e) => {
              e.preventDefault();
              if (showTerms === 'none') { setShowTerms('flex') }
              else { setShowTerms('none') }
            }}>
              Acepto los terminos y condiciones
            </a>
          </div>
        </div>
        <div className="col-6 mx-auto">
          <button
            className="btn btn-primary mx-auto mb-3 w-100"
            type="button"
            disabled={!enableButton}
            onClick={(e) => {
              e.preventDefault();
              registrarUsuario();
            }}
          >
            REGISTRARSE
          </button>
        </div>
        <div className="col-12 d-flex gap-1">
          <p>Ya tienes una cuenta? </p>
          <Link href="/user/login">INICIAR SESION</Link>
        </div>
      </form>
      <Terms_and_Condition show={showTerms} setShow={setShowTerms} />
    </section>
  );
}
