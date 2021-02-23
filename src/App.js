import React, {useState, useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';
import axios from 'axios';

// 23 de Febrero 2021, API CRUD Prototipo 
// Martín Dorantes
// Lectura de Datos del API de Usuarios para el CRUD

function App() {
  const baseUrl="http://localhost/apiusuarios/";
  const [data, setData]=useState([]);

  const [modalInsertar, setModalInsertar]= useState(false);
  const [modalEditar, setModalEditar]= useState(false);
  const [modalEliminar, setModalEliminar]= useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado]=useState({
    id: '',
    nombre: '',
    especialidad: '',
    correo: ''
  });

  const handleChange=e=>{
    const {name, value}=e.target;
    setUsuarioSeleccionado((prevState)=>({
      ...prevState,
      [name]: value
    }))
    console.log(usuarioSeleccionado);
  }

  const abrirCerrarModalInsertar=()=>{
    setModalInsertar(!modalInsertar);
  }

  const abrirCerrarModalEditar=()=>{
    setModalEditar(!modalEditar);
  }

  const abrirCerrarModalEliminar=()=>{
    setModalEliminar(!modalEliminar);
  }

  const peticionGet=async()=>{
    await axios.get(baseUrl)
    .then(response=>{
      setData(response.data);
    }).catch(error=>{
      console.log(error);
    })
  }

  const peticionPost=async()=>{
    var f = new FormData();
    f.append("nombre", usuarioSeleccionado.nombre);
    f.append("especialidad", usuarioSeleccionado.especialidad);
    f.append("correo", usuarioSeleccionado.correo);
    f.append("METHOD", "POST");
    await axios.post(baseUrl, f)
    .then(response=>{
      setData(data.concat(response.data));
      abrirCerrarModalInsertar();
    }).catch(error=>{
      console.log(error);
    })
  }

  const peticionPut=async()=>{
    var f = new FormData();
    f.append("nombre", usuarioSeleccionado.nombre);
    f.append("especialidad", usuarioSeleccionado.especialidad);
    f.append("correo", usuarioSeleccionado.correo);
    f.append("METHOD", "PUT");
    await axios.post(baseUrl, f, {params: {id: usuarioSeleccionado.id}})
    .then(response=>{
      var dataNueva= data;
      dataNueva.map(usuario=>{
        if(usuario.id===usuarioSeleccionado.id){
          usuario.nombre=usuarioSeleccionado.nombre;
          usuario.especialidad=usuarioSeleccionado.especialidad;
          usuario.correo=usuarioSeleccionado.correo;
        }
      });
      setData(dataNueva);
      abrirCerrarModalEditar();
    }).catch(error=>{
      console.log(error);
    })
  }

  const peticionDelete=async()=>{
    var f = new FormData();
    f.append("METHOD", "DELETE");
    await axios.post(baseUrl, f, {params: {id: usuarioSeleccionado.id}})
    .then(response=>{
      setData(data.filter(usuario=>usuario.id!==usuarioSeleccionado.id));
      abrirCerrarModalEliminar();
    }).catch(error=>{
      console.log(error);
    })
  }

  const seleccionarUsuario=(usuario, caso)=>{
    setUsuarioSeleccionado(usuario);

    (caso==="Editar")?
    abrirCerrarModalEditar():
    abrirCerrarModalEliminar()
  }

  useEffect(() => {
    peticionGet();
  }, [])

  return (
    <div style={{textAlign: 'center'}}>
      <br />
          <button className="btn btn-success" onClick={()=>abrirCerrarModalInsertar()}>Insertar</button>
      <br /><br />
      
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Especialidad</th>
            <th>Correo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map(usuario=>(
            <tr key={usuario.id}>
              <td>{usuario.id}</td>
              <td>{usuario.nombre}</td>
              <td>{usuario.especialidad}</td>
              <td>{usuario.correo}</td>
              <td>
                <button className="btn btn-primary" onClick={()=>seleccionarUsuario(usuario, "Editar")}>Editar</button> {" "}
                <button className="btn btn-danger" onClick={()=>seleccionarUsuario(usuario, "Eliminar")}>Borrar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal isOpen={modalInsertar}>
      <ModalHeader>Insertar Framework</ModalHeader>
      <ModalBody>
        <div className="form-group">
          <label>Nombre: </label>
          <br />
          <input type="text" className="form-control" name="nombre" onChange={handleChange}/>
          <br />
          <label>Especialidad: </label>
          <br />
          <input type="text" className="form-control" name="especialidad" onChange={handleChange}/>
          <br />
          <label>Correo: </label>
          <br />
          <input type="text" className="form-control" name="correo" onChange={handleChange}/>
          <br />
        </div>
      </ModalBody>
      <ModalFooter>
        <button className="btn btn-primary" onClick={()=>peticionPost()}>Insertar</button>{"   "}
        <button className="btn btn-danger" onClick={()=>abrirCerrarModalInsertar()}>Cancelar</button>
      </ModalFooter>
    </Modal>
    
    <Modal isOpen={modalEditar}>
      <ModalHeader>Editar Framework</ModalHeader>
      <ModalBody>
        <div className="form-group">
          <label>Nombre: </label>
          <br />
          <input type="text" className="form-control" name="nombre" onChange={handleChange} value={usuarioSeleccionado && usuarioSeleccionado.nombre}/>
          <br />
          <label>Especialidad: </label>
          <br />
          <input type="text" className="form-control" name="especialidad" onChange={handleChange} value={usuarioSeleccionado && usuarioSeleccionado.especialidad}/>
          <br />
          <label>Correo: </label>
          <br />
          <input type="text" className="form-control" name="correo" onChange={handleChange} value={usuarioSeleccionado && usuarioSeleccionado.correo}/>
          <br />
        </div>
      </ModalBody>
      <ModalFooter>
        <button className="btn btn-primary" onClick={()=>peticionPut()}>Editar</button>{"   "}
        <button className="btn btn-danger" onClick={()=>abrirCerrarModalEditar()}>Cancelar</button>
      </ModalFooter>
    </Modal>

    <Modal isOpen={modalEliminar}>
        <ModalBody>
        ¿Estás seguro que deseas eliminar al usuario {usuarioSeleccionado && usuarioSeleccionado.nombre}?
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-danger" onClick={()=>peticionDelete()}>
            Sí
          </button>
          <button
            className="btn btn-secondary"
            onClick={()=>abrirCerrarModalEliminar()}
          >
            No
          </button>
        </ModalFooter>
      </Modal>

    </div>
  );
}

export default App;
