import React from "react";
import 'bootstrap/dist/css/bootstrap.css'
import {
  Button, Modal, ModalFooter,
  ModalHeader, ModalBody
} from "reactstrap"
import { useState, useEffect  } from 'react';
import axios from "axios";


const urlBase = "https://localhost:44300/Api/Producto/";

function App() {

  const[data,setData]=useState([]);
  const[modalInsertar, setModalInsertar] = useState(false);
  const[modalActualizar, setModalActualizar] = useState(false);
  const[modalEliminar, setModalEliminar] = useState(false);
  const[textoBuscar, settextoBuscar]=useState({
    TextoBuscar:''
  
  })
  const[productoSeleccionado, setProductoSeleccionado]=useState({
    Nombre:'',
    Descripcion:'',
    Categoria: ''
  })
  
  const handleChange =e=>{
    const {name,value}= e.target;
    setProductoSeleccionado({
      ...productoSeleccionado,
      [name]:value
    });
    console.log(productoSeleccionado);
  }

  const handleChangeTexto =e=>{
    const {name,value}= e.target;
    settextoBuscar({
      ...textoBuscar,
      [name]:value
    });    
    obtenerDatosBuscar();
    console.log(textoBuscar);


  }

  
  const abrirCerrarModalInsertar=()=>{
    setModalInsertar(!modalInsertar);
  
  }

  const abrirCerrarModalActualizar=()=>{
    setModalActualizar(!modalActualizar);
  
  }
   const abrirCerrarModalEliminar=()=>{
    setModalEliminar(!modalEliminar);
  
  }

  
  const obtenerDatosBuscar = async()=>{
    await axios.post(urlBase +"ObtenerProductosConsulta", textoBuscar)
   .then(response => {
     setData(response.data);
   }).catch(error=>{
     console.log(error);
   })
  }

  

  const obtenerDatos = async()=>{
    await axios.get(urlBase +"ObtenerProductos")
   .then(response => {
     setData(response.data);
   }).catch(error=>{
     console.log(error);
   })
  }
  
  const guardarDatos =async ()=>{
    delete productoSeleccionado.Id_Producto;
     await axios.post(urlBase +"GuardarProducto", productoSeleccionado)
    .then(response => {
      setData(data.concat(response.data));
      abrirCerrarModalInsertar();
    }).catch(error=>{
      console.log(error);
    })
  }

  const actualizarDatos =async ()=>{    
     await axios.put(urlBase +"ActualizarProducto", productoSeleccionado)
    .then(response => {
      var respuesta = response.data;
      var dataAuxiliar=data;
      dataAuxiliar.map(producto=>{
        if(producto.Id_Producto === productoSeleccionado.Id_Producto){
          producto.Nombre = productoSeleccionado.Nombre;
          producto.Descripcion = productoSeleccionado.Descripcion;
          producto.Categoria = productoSeleccionado.Categoria;
        }
      });      
      abrirCerrarModalActualizar();
    }).catch(error=>{
      console.log(error);
    });
  };

  const eliminarDatos =async ()=>{    
    await axios.delete(urlBase +"EliminarProducto/" + productoSeleccionado.Id_Producto)
   .then(response => {
     setData(data.filter(producto=>producto.Id_Producto!==response.data));
     abrirCerrarModalEliminar();     
   }).catch(error=>{
     console.log(error);
   })
 }

  const seleccionarProducto =(producto, caso)=>{
    setProductoSeleccionado(producto);
    (caso=='Actualizar')? abrirCerrarModalActualizar() : abrirCerrarModalEliminar();
  }
  
  useEffect(()=>{
    obtenerDatosBuscar();
  }, [])

  return (
    <div className="App">
      <br/><br/>    
      <input type="text" name="TextoBuscar" placeholder="Buscar" onChange={handleChangeTexto} ></input>
      <br/><br/>  
      <button onClick={()=>abrirCerrarModalInsertar()} className="btn btn-success">Insertar Nuevo Producto</button>     
      
      <br/><br/>
      <table className="table table-bordered">
      <thead>
      <tr>
      <th>Id</th>
      <th>Nombre</th>
      <th>Descripción</th>
      <th>Categoría</th>
      <th>Imagen del Producto</th>
      <th>Acciones</th>
      </tr>      
      </thead>
      <tbody>
      {data.map(producto=>(
      <tr key={producto.Id_Producto}>
        <td>{producto.Id_Producto}</td>
        <td>{producto.Nombre}</td>
        <td>{producto.Descripcion}</td>
        <td>{producto.Categoria}</td>   
        <td>{producto.Imagen}</td>    
        <td>
          <button className='btn btn-primary' onClick={()=>seleccionarProducto(producto, "Actualizar")}>Actualizar</button>{" "}
          <button className='btn btn-danger' onClick={()=>seleccionarProducto(producto, "Eliminar")}>Eliminar</button>
          </td>      
      </tr>
      ))
      }
      </tbody>
      </table>
     
  
      <Modal isOpen={modalInsertar}>
      <ModalHeader>Insertar un nuevo producto</ModalHeader>
      <ModalBody>
        <div className="form-group">
          <label>Nombre:</label>
          <br/>
          <input type="text" className="form-control" name="Nombre" donChange={handleChange}/>
          <br/>
          <label>Descripción:</label>
          <br/>
          <input type="text" className="form-control" name="Descripcion" onChange={handleChange}/>
          <br/>
          <label>Categoría:</label>
          <br/>
          <input type="text" className="form-control" name="Categoria" onChange={handleChange}/>
        </div>
      </ModalBody>
      <ModalFooter>
        <button className="btn btn-primary" onClick={()=>guardarDatos()}>Insertar</button>{' '}
        <button className="btn btn-danger" onClick={()=>abrirCerrarModalInsertar()}>Cancelar</button>      
      </ModalFooter>
    </Modal>
    <Modal isOpen={modalActualizar}>
      <ModalHeader>Editar un producto</ModalHeader>
      <ModalBody>
        <div className="form-group">
        <label>ID</label>
          <br/>
          <input type="text" className="form-control" name="Nombre" readOnly value={productoSeleccionado && productoSeleccionado.Id_Producto}/>
          <bt/>
          <label>Nombre:</label>
          <br/>
          <input type="text" className="form-control" name="Nombre" onChange={handleChange} value={productoSeleccionado && productoSeleccionado.Nombre}/>
          <br/>
          <label>Descripción:</label>
          <br/>
          <input type="text" className="form-control" name="Descripcion" onChange={handleChange} value={productoSeleccionado && productoSeleccionado.Descripcion}/>
          <br/>
          <label>Categoría:</label>
          <br/>
          <input type="text" className="form-control" name="Categoria" onChange={handleChange} value={productoSeleccionado && productoSeleccionado.Categoria}/>
        </div>
      </ModalBody>
      <ModalFooter>
        <button className="btn btn-primary" onClick={()=>actualizarDatos()}>Actualizar</button>{' '}
        <button className="btn btn-danger" onClick={()=>abrirCerrarModalActualizar()}>Cancelar</button>      
      </ModalFooter>
    </Modal>

    <Modal isOpen={modalEliminar}>
      <ModalBody>
        ¿Está seguro de eliminar el registro? {productoSeleccionado && productoSeleccionado.Nombre}
      </ModalBody>
      <ModalFooter>
        <button className="btn btn-danger" onClick={()=>eliminarDatos()}>Si</button>
        <button className="btn btn-secondary" onClick={()=>abrirCerrarModalEliminar()}>No</button>
      </ModalFooter>
    </Modal>


  </div >
  );
}

export default App;
